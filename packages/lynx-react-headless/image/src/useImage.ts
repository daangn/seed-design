import { useCallback, useEffect, useMemo, useRef, useState } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";

export type ImageLoadingStatus = "loading" | "loaded" | "error";

export interface UseImageProps {
  /** 표시할 이미지 src. 없으면 곧바로 `error` 상태로 시작한다. */
  src?: string;
  /** 로딩 상태가 바뀔 때 호출된다. */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export interface UseImageReturn {
  loadingStatus: ImageLoadingStatus;
  isLoaded: boolean;
  /** Lynx `<image>`의 `bindload`에 연결한다. */
  handleLoad: () => void;
  /** Lynx `<image>`의 `binderror`에 연결한다. */
  handleError: () => void;
}

/**
 * @platform Lynx
 *
 * Lynx `<image>`의 로딩 상태를 추적하는 headless 훅.
 * src를 바꾸는 소비자는 `<image key={src}>`로 native 요청도 분리한다.
 *
 * 웹 `@seed-design/react-image`는 `img.complete`/`naturalWidth` 같은 DOM API로
 * 캐시된 이미지를 감지하지만, Lynx `<image>`에는 해당 API가 없으므로 `bindload`/
 * `binderror` 이벤트만으로 상태를 만든다. 또한 Lynx는 attribute selector를 스타일에
 * 적용하지 않으므로, 소비 측(`lynx-react`)은 `loadingStatus`로 fallback을 조건부
 * 렌더링한다.
 */
export function useImage(props: UseImageProps): UseImageReturn {
  const { src, onLoadingStatusChange } = props;
  // Each source selection is a distinct request, including A → B → A.
  const request = useMemo(() => ({ src }), [src]);
  const activeRequest = useRef(request);
  activeRequest.current = request;
  const [state, setState] = useState<{ request: typeof request; status: ImageLoadingStatus }>({
    request,
    status: src ? "loading" : "error",
  });
  const loadingStatus = state.request === request ? state.status : src ? "loading" : "error";
  const notifyStatus = useMemoizedFn((status: ImageLoadingStatus) => {
    onLoadingStatusChange?.(status);
  });

  useEffect(() => {
    notifyStatus(loadingStatus);
  }, [request, loadingStatus, notifyStatus]);

  const updateStatus = useCallback(
    (status: ImageLoadingStatus) => {
      if (!request.src || activeRequest.current !== request) return;
      setState((previous) =>
        previous.request === request && previous.status === status ? previous : { request, status },
      );
    },
    [request],
  );

  const handleLoad = useCallback(() => updateStatus("loaded"), [updateStatus]);
  const handleError = useCallback(() => updateStatus("error"), [updateStatus]);

  return {
    loadingStatus,
    isLoaded: loadingStatus === "loaded",
    handleLoad,
    handleError,
  };
}

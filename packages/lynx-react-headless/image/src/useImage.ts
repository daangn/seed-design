import { useEffect, useState } from "@lynx-js/react";
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
 *
 * 웹 `@seed-design/react-image`는 `img.complete`/`naturalWidth` 같은 DOM API로
 * 캐시된 이미지를 감지하지만, Lynx `<image>`에는 해당 API가 없으므로 `bindload`/
 * `binderror` 이벤트만으로 상태를 만든다. 또한 Lynx는 attribute selector를 스타일에
 * 적용하지 않으므로, 소비 측(`lynx-react`)은 `loadingStatus`로 fallback을 조건부
 * 렌더링한다.
 */
export function useImage(props: UseImageProps): UseImageReturn {
  const { src, onLoadingStatusChange } = props;
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>(src ? "loading" : "error");

  const updateStatus = useMemoizedFn((status: ImageLoadingStatus) => {
    setLoadingStatus(status);
    onLoadingStatusChange?.(status);
  });

  // src가 바뀌면 다시 로딩 상태로 되돌린다.
  useEffect(() => {
    updateStatus(src ? "loading" : "error");
  }, [src, updateStatus]);

  const handleLoad = useMemoizedFn(() => updateStatus("loaded"));
  const handleError = useMemoizedFn(() => updateStatus("error"));

  return {
    loadingStatus,
    isLoaded: loadingStatus === "loaded",
    handleLoad,
    handleError,
  };
}

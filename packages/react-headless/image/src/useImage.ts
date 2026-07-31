import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps, imgProps } from "@seed-design/dom-utils";
import { useCallback, useMemo, useRef, useState } from "react";

export type ImageLoadingStatus = "loading" | "loaded" | "error";

export interface UseImageProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export type UseImageReturn = ReturnType<typeof useImage>;

export function useImage(props: UseImageProps) {
  const onLoadingStatusChange = useCallbackRef(props.onLoadingStatusChange);
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>("loading");
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        if (imageRef.current.naturalWidth === 0 || imageRef.current.naturalHeight === 0) {
          setLoadingStatus("error");
          onLoadingStatusChange?.("error");
        } else {
          setLoadingStatus("loaded");
          onLoadingStatusChange?.("loaded");
        }
      }
    }
  }, [onLoadingStatusChange]);

  const isLoaded = loadingStatus === "loaded";

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-loading-state": loadingStatus,
      }),
    [loadingStatus],
  );

  const setSrc = useCallback(
    (src: string | undefined) => {
      if (src === undefined || src === null) {
        setLoadingStatus("error");
        onLoadingStatusChange?.("error");
      } else {
        setLoadingStatus("loading");
        onLoadingStatusChange?.("loading");
      }
    },
    [onLoadingStatusChange],
  );

  const getContentProps = useCallback(
    ({ src }: { src?: string }) => {
      return imgProps({
        // 로딩 중에는 숨기지 않는다. 숨기면 lazy 로드가 막히고 LCP가 밀린다 (#1791)
        hidden: loadingStatus === "error",
        "data-visible": dataAttr(isLoaded),
        src,
        ...stateProps,
      });
    },
    [isLoaded, loadingStatus, stateProps],
  );

  const handleLoad = useCallback(() => {
    setLoadingStatus("loaded");
    onLoadingStatusChange?.("loaded");
  }, [onLoadingStatusChange]);

  const handleError = useCallback(() => {
    setLoadingStatus("error");
    onLoadingStatusChange?.("error");
  }, [onLoadingStatusChange]);

  const fallbackProps = useMemo(
    () =>
      elementProps({
        hidden: isLoaded,
        "data-visible": dataAttr(!isLoaded),
        ...stateProps,
      }),
    [isLoaded, stateProps],
  );

  return {
    refs: {
      image: imageRef,
    },
    loadingStatus,
    stateProps,
    rootProps: stateProps,
    setSrc,
    getContentProps,
    handleLoad,
    handleError,
    fallbackProps,
  };
}

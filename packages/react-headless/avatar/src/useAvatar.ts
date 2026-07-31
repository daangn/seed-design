/**
 * @deprecated Use `@seed-design/react-image` instead.
 * @see https://seed-design.io/docs/react/components/image
 */

import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { ariaAttr, dataAttr, elementProps, imgProps } from "@seed-design/dom-utils";
import { useMemo, useRef, useState } from "react";

/** @deprecated Use `ImageLoadingStatus` from `@seed-design/react-image` instead. */
type LoadingStatus = "loading" | "loaded" | "error";

interface UseAvatarStateProps {
  onLoadingStatusChange?: (status: LoadingStatus) => void;
}

function useAvatarState(props: UseAvatarStateProps) {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const onLoadingStatusChange = useCallbackRef(props.onLoadingStatusChange);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("loading");

  const events = useMemo(
    () => ({
      setSrc: (payload: { src: string | undefined }) => {
        setSrc(payload.src);
        if (src === payload.src) return;
        if (payload.src === null) {
          setLoadingStatus("error");
          onLoadingStatusChange?.("error");
        } else {
          setLoadingStatus("loading");
          onLoadingStatusChange?.("loading");
        }
      },
      loadSuccess: () => {
        setLoadingStatus("loaded");
        onLoadingStatusChange?.("loaded");
      },
      loadError: () => {
        setLoadingStatus("error");
        onLoadingStatusChange?.("error");
      },
    }),
    [src, onLoadingStatusChange],
  );

  return {
    loadingStatus,
    events,
  };
}

export interface UseAvatarProps extends UseAvatarStateProps {}

export type UseAvatarReturn = ReturnType<typeof useAvatar>;

// srcSet만 있는 반응형 이미지는 src 없이도 로드된다
function hasSource(src?: string, srcSet?: string) {
  return Boolean(src) || Boolean(srcSet);
}

export function useAvatar(props: UseAvatarProps) {
  const { loadingStatus, events } = useAvatarState(props);

  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        if (imageRef.current.naturalWidth === 0 || imageRef.current.naturalHeight === 0) {
          events.loadError();
        } else {
          events.loadSuccess();
        }
      }
    }
  }, [events]);

  const isLoaded = loadingStatus === "loaded";
  const stateProps = elementProps({
    "data-loading-state": loadingStatus,
  });

  return {
    refs: {
      image: imageRef,
    },
    loadingStatus,
    stateProps,
    rootProps: elementProps({
      ...stateProps,
    }),
    getImageProps: ({
      src,
      srcSet,
      onLoad,
      onError,
    }: {
      src?: string;
      srcSet?: string;
      onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
      onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    }) => {
      useLayoutEffect(() => {
        events.setSrc({ src });
      }, [src]);

      return imgProps({
        hidden: loadingStatus === "error" || (!isLoaded && !hasSource(src, srcSet)),
        "data-visible": dataAttr(isLoaded),
        src,
        srcSet,
        onLoad: (e) => {
          events.loadSuccess();
          onLoad?.(e);
        },
        onError: (e) => {
          events.loadError();
          onError?.(e);
        },
        ...stateProps,
      });
    },
    fallbackProps: elementProps({
      hidden: isLoaded,
      // 로딩 중에는 이미지의 alt가 이름을 맡는다. 플레이스홀더까지 노출하면 중복 낭독된다.
      "aria-hidden": ariaAttr(loadingStatus === "loading"),
      "data-visible": dataAttr(!isLoaded),
      ...stateProps,
    }),
  };
}

import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps, imgProps } from "@seed-design/dom-utils";
import { useMemo, useRef, useState } from "react";

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

export function useAvatar(props: UseAvatarProps) {
  const { loadingStatus, events } = useAvatarState(props);

  const imageRef = useRef<HTMLImageElement>(null);

  // TODO: this is triggered after hydration, so image display is delayed in SSR environment. We might add "idle" status or adjust css to handle this.
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
      onLoad,
      onError,
    }: {
      src?: string;
      onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
      onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    }) => {
      useLayoutEffect(() => {
        events.setSrc({ src });
      }, [src]);

      return imgProps({
        hidden: !isLoaded,
        "data-visible": dataAttr(isLoaded),
        src,
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
      "data-visible": dataAttr(!isLoaded),
      ...stateProps,
    }),
  };
}

import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps, imgProps } from "@seed-design/dom-utils";
import { useState } from "react";

type LoadingStatus = "loading" | "loaded" | "error";

export interface UseAvatarStateProps {
  src?: string;

  onLoadingStatusChange?: (status: LoadingStatus) => void;
}

export function useAvatarState(props: UseAvatarStateProps) {
  const { src, onLoadingStatusChange } = props;
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("loading");

  const events = {
    srcChange: () => {
      setLoadingStatus("loading");
      onLoadingStatusChange?.("loading");
    },
    loadSuccess: () => {
      setLoadingStatus("loaded");
      onLoadingStatusChange?.("loaded");
    },
    loadError: () => {
      setLoadingStatus("error");
      onLoadingStatusChange?.("error");
    },
  };

  useLayoutEffect(() => {
    if (!src) {
      events.loadError();
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    events.srcChange();

    image.onload = () => {
      if (!isMounted) return;
      events.loadSuccess();
    };
    image.onerror = () => {
      if (!isMounted) return;
      events.loadError();
    };
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return {
    loadingStatus,
    events,
  };
}

export interface UseAvatarProps extends UseAvatarStateProps {}

export function useAvatar(props: UseAvatarProps) {
  const { ...restProps } = props;
  const { loadingStatus } = useAvatarState(props);
  const isLoaded = loadingStatus === "loaded";

  const stateProps = {
    "data-loading-status": loadingStatus,
  };

  return {
    loadingStatus,
    restProps,
    stateProps,
    rootProps: elementProps({
      ...stateProps,
    }),
    imageProps: imgProps({
      hidden: !isLoaded,
      "data-visible": dataAttr(isLoaded),
      src: props.src,
      ...stateProps,
    }),
    fallbackProps: elementProps({
      hidden: isLoaded,
      "data-visible": dataAttr(!isLoaded),
      ...stateProps,
    }),
  };
}

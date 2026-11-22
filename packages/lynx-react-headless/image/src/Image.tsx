import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { useImageRequest, type ImageLoadingStatus, type UseImageProps } from "./useImage.js";

type ViewProps = IntrinsicElements["view"];
type ImageProps = IntrinsicElements["image"];
interface ImageContextValue {
  loadingStatus: ImageLoadingStatus;
  isLoaded: boolean;
  setLoadingStatus: (status: ImageLoadingStatus) => void;
}
const ImageContext = React.createContext<ImageContextValue | null>(null);
const ImageStatusContext = React.createContext<ImageContextValue["setLoadingStatus"] | null>(null);

export function useImageContext(): ImageContextValue {
  const context = React.useContext(ImageContext);
  if (!context) throw new Error("Image slots must be rendered inside Image.Root.");
  return context;
}

export interface ImageRootProps extends ViewProps {
  onLoadingStatusChange?: UseImageProps["onLoadingStatusChange"];
}
export const ImageRoot = React.forwardRef<unknown, ImageRootProps>((props, ref) => {
  const { children, onLoadingStatusChange, ...nativeProps } = props;
  const [loadingStatus, setStatus] = React.useState<ImageLoadingStatus>("error");
  const setLoadingStatus = useMemoizedFn((status: ImageLoadingStatus) => {
    "background only";
    setStatus(status);
    onLoadingStatusChange?.(status);
  });
  const context = React.useMemo(
    () => ({
      loadingStatus,
      isLoaded: loadingStatus === "loaded",
      setLoadingStatus,
    }),
    [loadingStatus, setLoadingStatus],
  );
  return (
    <ImageContext.Provider value={context}>
      <ImageStatusContext.Provider value={setLoadingStatus}>
        <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
          {children}
        </view>
      </ImageStatusContext.Provider>
    </ImageContext.Provider>
  );
});
ImageRoot.displayName = "ImageRoot";

export interface ImageContentProps extends Omit<ImageProps, "children"> {
  children?: never;
  alt?: string;
}
// A component boundary recreates the native snapshot when the source changes.
const ImageRequest = React.forwardRef<unknown, ImageContentProps>((props, ref) => {
  const { src, alt, children: _children, bindload, binderror, ...nativeProps } = props;
  return (
    <image
      {...(ref ? { ref: ref as ImageProps["ref"] } : {})}
      accessibility-label={alt}
      accessibility-element={alt !== undefined ? alt.length > 0 : undefined}
      accessibility-traits="image"
      {...nativeProps}
      src={src}
      bindload={bindload}
      binderror={binderror}
    />
  );
});
ImageRequest.displayName = "ImageRequest";
export const ImageContent = React.forwardRef<unknown, ImageContentProps>((props, ref) => {
  const setLoadingStatus = React.useContext(ImageStatusContext);
  if (!setLoadingStatus) throw new Error("Image slots must be rendered inside Image.Root.");
  const { request, activeRequest } = useImageRequest(props.src);
  const status = React.useMemo<{ current: ImageLoadingStatus }>(
    () => ({ current: request.src ? "loading" : "error" }),
    [request],
  );
  const mounted = React.useRef(true);
  React.useEffect(() => {
    "background only";
    mounted.current = true;
    return () => {
      "background only";
      mounted.current = false;
      setLoadingStatus("error");
    };
  }, [setLoadingStatus]);
  React.useEffect(() => {
    "background only";
    if (activeRequest.current !== request) return;
    if (status.current === (request.src ? "loading" : "error")) setLoadingStatus(status.current);
  }, [activeRequest, request, status, setLoadingStatus]);
  const updateStatus = (next: ImageLoadingStatus) => {
    "background only";
    if (!mounted.current || activeRequest.current !== request || !request.src) return;
    if (status.current === next) return;
    status.current = next;
    setLoadingStatus(next);
  };
  return (
    <ImageRequest
      key={props.src}
      {...props}
      {...(ref ? { ref } : {})}
      bindload={(event) => {
        "background only";
        props.bindload?.(event);
        updateStatus("loaded");
      }}
      binderror={(event) => {
        "background only";
        props.binderror?.(event);
        updateStatus("error");
      }}
    />
  );
});
ImageContent.displayName = "ImageContent";

export interface ImageFallbackProps extends ViewProps {}
export const ImageFallback = React.forwardRef<unknown, ImageFallbackProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { isLoaded } = useImageContext();
  if (isLoaded) return null;
  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
ImageFallback.displayName = "ImageFallback";

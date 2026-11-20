import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { ImageLoadingStatus, UseImageProps } from "./useImage.js";

type ViewProps = IntrinsicElements["view"];
type ImageProps = IntrinsicElements["image"];
interface ImageContextValue {
  loadingStatus: ImageLoadingStatus;
  isLoaded: boolean;
  setLoadingStatus: (status: ImageLoadingStatus) => void;
}
const ImageContext = React.createContext<ImageContextValue | null>(null);

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
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
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
// Report straight to Image.Root: a second state here would commit once more per load.
export const ImageContent = React.forwardRef<unknown, ImageContentProps>((props, ref) => {
  const { src } = props;
  const { setLoadingStatus } = useImageContext();
  // Each source selection is a distinct request, including A → B → A.
  const request = React.useMemo(
    () => ({ src, status: undefined as ImageLoadingStatus | undefined }),
    [src],
  );
  const activeRequest = React.useRef(request);
  activeRequest.current = request;
  const report = (status: ImageLoadingStatus) => {
    "background only";
    if (activeRequest.current !== request || request.status === status) return;
    request.status = status;
    setLoadingStatus(status);
  };
  React.useEffect(() => report(src ? "loading" : "error"), [request]);
  React.useEffect(() => () => setLoadingStatus("error"), [setLoadingStatus]);
  return (
    <ImageRequest
      key={src}
      {...props}
      {...(ref ? { ref } : {})}
      bindload={(event) => {
        props.bindload?.(event);
        if (src) report("loaded");
      }}
      binderror={(event) => {
        props.binderror?.(event);
        if (src) report("error");
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

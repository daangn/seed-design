"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useImage, type UseImageProps } from "./useImage";
import { ImageProvider, useImageContext } from "./useImageContext";

export interface ImageRootProps
  extends UseImageProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ImageRoot = forwardRef<HTMLDivElement, ImageRootProps>((props, ref) => {
  const { onLoadingStatusChange, ...otherProps } = props;
  const api = useImage({ onLoadingStatusChange });
  return (
    <ImageProvider value={api}>
      <Primitive.div ref={ref} {...mergeProps(api.rootProps, otherProps)} />
    </ImageProvider>
  );
});
ImageRoot.displayName = "ImageRoot";

export interface ImageContentProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const ImageContent = forwardRef<HTMLImageElement, ImageContentProps>((props, ref) => {
  const { src, onLoad, onError, ...otherProps } = props;

  const { refs, setSrc, getContentProps, handleLoad, handleError } = useImageContext();

  useLayoutEffect(() => {
    setSrc(src);
  }, [src, setSrc]);

  const contentProps = getContentProps({ src });

  return (
    <Primitive.img
      ref={composeRefs(refs.image, ref)}
      {...mergeProps(contentProps, otherProps, {
        // if loading is lazy, we should not hide the image even if it's not loaded yet,
        // because the browser should be able to check if it's in the viewport.
        // TODO: it should be better than this; why doesn't useImage properly handle this case?
        hidden: otherProps.loading === "lazy" ? false : contentProps.hidden,
      })}
      onLoad={(e) => {
        handleLoad();
        onLoad?.(e);
      }}
      onError={(e) => {
        handleError();
        onError?.(e);
      }}
    />
  );
});
ImageContent.displayName = "ImageContent";

export interface ImageFallbackProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const ImageFallback = forwardRef<HTMLDivElement, ImageFallbackProps>((props, ref) => {
  const { fallbackProps } = useImageContext();
  return <Primitive.div ref={ref} {...mergeProps(fallbackProps, props)} />;
});
ImageFallback.displayName = "ImageFallback";

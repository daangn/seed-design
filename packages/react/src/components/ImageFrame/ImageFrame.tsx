import { Image } from "@seed-design/react-image";
import {
  imageFrame as imageFrameRecipe,
  type ImageFrameVariantProps,
} from "@seed-design/css/recipes/image-frame";
import * as React from "react";
import { AspectRatio, type AspectRatioProps } from "../AspectRatio/AspectRatio";

export interface ImageFrameProps
  extends Omit<AspectRatioProps, "children">,
    ImageFrameVariantProps {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  crossOrigin?: "anonymous" | "use-credentials" | "";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  sizes?: string;
  srcSet?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  /**
   * Overlay elements to be rendered on top of the image.
   * Use ImageFrameOverlayPositioner to position them.
   */
  children?: React.ReactNode;
}

export const ImageFrame = React.forwardRef<HTMLDivElement, ImageFrameProps>(
  (
    {
      ratio = 4 / 3,
      rounded,
      stroke,
      src,
      alt,
      fallback,
      className,
      loading,
      decoding,
      crossOrigin,
      referrerPolicy,
      sizes,
      srcSet,
      onLoad,
      onError,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <AspectRatio ref={ref} ratio={ratio} className={className} {...rest}>
        <Image.Root className={imageFrameRecipe({ rounded, stroke })}>
          <Image.Content
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            crossOrigin={crossOrigin}
            referrerPolicy={referrerPolicy}
            sizes={sizes}
            srcSet={srcSet}
            onLoad={onLoad}
            onError={onError}
          />
          {fallback && <Image.Fallback>{fallback}</Image.Fallback>}
          {children}
        </Image.Root>
      </AspectRatio>
    );
  },
);

ImageFrame.displayName = "ImageFrame";

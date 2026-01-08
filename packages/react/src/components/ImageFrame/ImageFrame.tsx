import { Image } from "@seed-design/react-image";
import {
  imageFrame as imageFrameRecipe,
  type ImageFrameVariantProps,
} from "@seed-design/css/recipes/image-frame";
import clsx from "clsx";
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
      ...rest
    },
    ref,
  ) => {
    return (
      <AspectRatio
        ref={ref}
        ratio={ratio}
        className={clsx(imageFrameRecipe({ rounded, stroke }), className)}
        {...rest}
      >
        <Image.Root>
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
        </Image.Root>
      </AspectRatio>
    );
  },
);

ImageFrame.displayName = "ImageFrame";

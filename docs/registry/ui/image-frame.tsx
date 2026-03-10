"use client";

import {
  ImageFrameBadge as SeedImageFrameBadge,
  ImageFrameContent as SeedImageFrameContent,
  ImageFrameFallback as SeedImageFrameFallback,
  ImageFrameFloater as SeedImageFrameFloater,
  ImageFrameIcon as SeedImageFrameIcon,
  ImageFrameIndicator as SeedImageFrameIndicator,
  ImageFrameReactionButton as SeedImageFrameReactionButton,
  ImageFrameRoot as SeedImageFrameRoot,
  type ImageFrameBadgeProps as SeedImageFrameBadgeProps,
  type ImageFrameFloaterProps as SeedImageFrameFloaterProps,
  type ImageFrameIconProps as SeedImageFrameIconProps,
  type ImageFrameIndicatorProps as SeedImageFrameIndicatorProps,
  type ImageFrameReactionButtonProps as SeedImageFrameReactionButtonProps,
  type ImageFrameRootProps as SeedImageFrameRootProps,
} from "@seed-design/react";
import * as React from "react";

export interface ImageFrameProps extends SeedImageFrameRootProps {
  src?: string;

  alt?: string;

  fallback?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/image-frame
 */
export const ImageFrame = React.forwardRef<HTMLDivElement, ImageFrameProps>(
  ({ src, alt, fallback, children, ...otherProps }, ref) => {
    return (
      <SeedImageFrameRoot ref={ref} {...otherProps}>
        <SeedImageFrameFallback>{fallback}</SeedImageFrameFallback>
        <SeedImageFrameContent src={src} alt={alt} />
        {children}
      </SeedImageFrameRoot>
    );
  },
);
ImageFrame.displayName = "ImageFrame";

export interface ImageFrameFloaterProps extends SeedImageFrameFloaterProps {}

export const ImageFrameFloater = SeedImageFrameFloater;

export interface ImageFrameBadgeProps extends SeedImageFrameBadgeProps {}

export const ImageFrameBadge = SeedImageFrameBadge;

export interface ImageFrameIconProps extends SeedImageFrameIconProps {}

export const ImageFrameIcon = SeedImageFrameIcon;

export interface ImageFrameIndicatorProps extends SeedImageFrameIndicatorProps {}

export const ImageFrameIndicator = SeedImageFrameIndicator;

export interface ImageFrameReactionButtonProps extends SeedImageFrameReactionButtonProps {}

export const ImageFrameReactionButton = SeedImageFrameReactionButton;

import {
  imageFrame as imageFrameRecipe,
  type ImageFrameVariantProps,
} from "@seed-design/css/recipes/image-frame";
import {
  imageFrameIcon,
  type ImageFrameIconVariantProps,
} from "@seed-design/css/recipes/image-frame-icon";
import {
  imageFrameIndicator,
  type ImageFrameIndicatorVariantProps,
} from "@seed-design/css/recipes/image-frame-indicator";
import { imageFrameReactionButton } from "@seed-design/css/recipes/image-frame-reaction-button";
import { imageFrameFloater as floaterVars } from "@seed-design/css/vars/component";
import { mergeProps } from "@seed-design/dom-utils";
import { Image } from "@seed-design/react-image";
import { Toggle as TogglePrimitive, useToggleContext } from "@seed-design/react-toggle";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import type { DistributiveOmit } from "../../utils/styled";
import { AspectRatio, type AspectRatioProps } from "../AspectRatio/AspectRatio";
import { Badge, type BadgeProps } from "../Badge/Badge";
import { Float, type FloatProps } from "../Float/Float";
import { Icon } from "../Icon/Icon";
import { InternalIcon } from "../private/Icon";

////////////////////////////////////////////////////////////////////////////////////

export type ImageFrameProps = DistributiveOmit<AspectRatioProps, "children"> &
  ImageFrameVariantProps & {
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
    children?: React.ReactNode;
  };

export const ImageFrame = React.forwardRef<HTMLDivElement, ImageFrameProps>(
  (
    {
      ratio = 4 / 3,
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
      borderRadius = "r2",
      children,
      ...rest
    },
    ref,
  ) => {
    const [variantProps, restProps] = imageFrameRecipe.splitVariantProps(rest);
    const classNames = imageFrameRecipe(variantProps);

    return (
      <AspectRatio
        ref={ref}
        ratio={ratio}
        className={className}
        borderRadius={borderRadius}
        // splitVariantProps collapses the margin/bleed union; re-assert the shape.
        {...(restProps as AspectRatioProps)}
      >
        <Image.Root className={classNames.root}>
          <Image.Content
            className={classNames.content}
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
          {fallback && <Image.Fallback className={classNames.fallback}>{fallback}</Image.Fallback>}
          {children}
        </Image.Root>
      </AspectRatio>
    );
  },
);

ImageFrame.displayName = "ImageFrame";

////////////////////////////////////////////////////////////////////////////////////

export interface ImageFrameFloaterProps extends FloatProps {}

/**
 * ImageFrame 내에서 오버레이 요소를 배치하기 위한 컴포넌트
 *
 * @remarks
 * offsetX, offsetY 기본값은 rootage 스펙(image-frame-floater)에서 가져옵니다.
 */
export const ImageFrameFloater = React.forwardRef<HTMLDivElement, ImageFrameFloaterProps>(
  (
    {
      offsetX = floaterVars.base.enabled.root.offset,
      offsetY = floaterVars.base.enabled.root.offset,
      ...rest
    },
    ref,
  ) => {
    return <Float ref={ref} offsetX={offsetX} offsetY={offsetY} {...rest} />;
  },
);

ImageFrameFloater.displayName = "ImageFrameFloater";

////////////////////////////////////////////////////////////////////////////////////

export interface ImageFrameBadgeProps extends BadgeProps {}

export const ImageFrameBadge = React.forwardRef<HTMLSpanElement, ImageFrameBadgeProps>(
  (props, ref) => {
    return <Badge ref={ref} {...props} />;
  },
);

ImageFrameBadge.displayName = "ImageFrameBadge";

////////////////////////////////////////////////////////////////////////////////////

export interface ImageFrameIconProps
  extends ImageFrameIconVariantProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  svg: React.ReactNode;
}

export const ImageFrameIcon = React.forwardRef<HTMLSpanElement, ImageFrameIconProps>(
  ({ svg, className, ...rest }, ref) => {
    return (
      <span ref={ref} className={clsx(imageFrameIcon(), className)} {...rest}>
        <Icon svg={svg} />
      </span>
    );
  },
);

ImageFrameIcon.displayName = "ImageFrameIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface ImageFrameIndicatorProps
  extends ImageFrameIndicatorVariantProps,
    React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const ImageFrameIndicator = React.forwardRef<HTMLSpanElement, ImageFrameIndicatorProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <span ref={ref} className={clsx(imageFrameIndicator(), className)} {...rest}>
        {children}
      </span>
    );
  },
);

ImageFrameIndicator.displayName = "ImageFrameIndicator";

////////////////////////////////////////////////////////////////////////////////////

const {
  ClassNamesProvider: ImageFrameReactionButtonClassNamesProvider,
  useClassNames: useImageFrameReactionButtonClassNames,
} = createSlotRecipeContext(imageFrameReactionButton);

////////////////////////////////////////////////////////////////////////////////////

const HeartFillPath =
  "M15.5452 10C11.7873 10 9.25 12.9484 9.25 16.6267C9.25 19.8754 11.1219 22.0952 13.1877 23.969C13.7807 24.5069 14.4438 25.0617 15.095 25.6066C15.5434 25.9817 15.9862 26.3522 16.3967 26.7093C17.4501 27.6257 18.4191 28.557 19.1995 29.5994C19.3886 29.8518 19.6856 30.0003 20.001 30C20.3163 29.9997 20.6131 29.8507 20.8016 29.5979C21.5785 28.5562 22.5453 27.6253 23.598 26.7091C24.0105 26.35 24.4568 25.9766 24.9089 25.5984C25.5573 25.0559 26.2176 24.5035 26.807 23.9693C28.8739 22.096 30.75 19.8761 30.75 16.6267C30.75 12.9484 28.2127 10 24.4548 10C22.6365 10 21.1002 11.0545 20 12.4906C18.8998 11.0545 17.3635 10 15.5452 10Z";

const HeartOutlineStrokePath =
  "M15.5452 12C13.0342 12 11.25 13.905 11.25 16.6267C11.25 18.9912 12.5659 20.7048 14.5314 22.4876C15.1157 23.0176 15.7038 23.5087 16.3148 24.019C16.7646 24.3946 17.2269 24.7807 17.7093 25.2003C18.4947 25.8835 19.2814 26.6141 19.9988 27.4215C20.7144 26.614 21.5001 25.8836 22.2849 25.2005C22.7714 24.7771 23.2368 24.3885 23.6895 24.0105C24.2967 23.5035 24.8813 23.0154 25.4639 22.4874C27.4317 20.704 28.75 18.9906 28.75 16.6267C28.75 13.905 26.9658 12 24.4548 12C23.069 12 21.747 12.8325 20.8919 14.5189C20.7215 14.8549 20.3768 15.0667 20 15.0667C19.6233 15.0667 19.2785 14.8549 19.1081 14.5189C18.2531 12.8325 16.931 12 15.5452 12ZM9.25 16.6267C9.25 12.9484 11.7873 10 15.5452 10C17.3146 10 18.8683 10.8364 20 12.2306C21.1317 10.8364 22.6854 10 24.4548 10C28.2127 10 30.75 12.9484 30.75 16.6267C30.75 19.8761 28.8739 22.096 26.807 23.9693C26.2176 24.5035 25.5573 25.0559 24.9089 25.5984C24.4568 25.9766 24.0105 26.35 23.598 26.7091C22.5453 27.6253 21.5785 28.5562 20.8016 29.5979C20.6131 29.8507 20.3163 29.9997 20.001 30C19.6856 30.0003 19.3886 29.8518 19.1995 29.5994C18.4191 28.557 17.4501 27.6257 16.3967 26.7093C15.9862 26.3522 15.5434 25.9817 15.095 25.6066C14.4438 25.0617 13.7807 24.5069 13.1877 23.969C11.1219 22.0952 9.25 19.8754 9.25 16.6267Z";

const HeartFillSvg = (props: React.SVGAttributes<SVGSVGElement>) => {
  const id = React.useId();
  const gradientId = `seed-heart-gradient${id.replace(/:/g, "")}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="8 9 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d={HeartFillPath} fill={`url(#${gradientId})`} />
      <defs>
        <linearGradient
          id={gradientId}
          x1="7"
          y1="8.5"
          x2="26.0974"
          y2="10.5391"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9A56" />
          <stop offset="1" stopColor="#FF6600" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const HeartLineSvg = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="8 9 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path fillRule="evenodd" clipRule="evenodd" d={HeartOutlineStrokePath} fill="currentColor" />
  </svg>
);

export interface ImageFrameReactionButtonProps
  extends Omit<TogglePrimitive.RootProps, "children"> {}

const ReactionButtonIcon = () => {
  const { pressed, stateProps } = useToggleContext();
  const classNames = useImageFrameReactionButtonClassNames();
  const iconProps = mergeProps(stateProps, {
    className: pressed ? classNames.fillIcon : classNames.lineIcon,
  } as React.HTMLAttributes<HTMLElement>);

  return <InternalIcon svg={pressed ? <HeartFillSvg /> : <HeartLineSvg />} {...iconProps} />;
};

export const ImageFrameReactionButton = React.forwardRef<
  HTMLButtonElement,
  ImageFrameReactionButtonProps
>(({ className, ...rest }, ref) => {
  const classNames = imageFrameReactionButton();

  return (
    <ImageFrameReactionButtonClassNamesProvider value={classNames}>
      <TogglePrimitive.Root ref={ref} className={clsx(classNames.root, className)} {...rest}>
        <ReactionButtonIcon />
      </TogglePrimitive.Root>
    </ImageFrameReactionButtonClassNamesProvider>
  );
});

ImageFrameReactionButton.displayName = "ImageFrameReactionButton";

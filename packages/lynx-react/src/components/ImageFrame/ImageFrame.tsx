import * as React from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements } from "@lynx-js/types";
import { imageFrame, type ImageFrameVariantProps } from "@seed-design/lynx-css/recipes/image-frame";
import { imageFrameIcon } from "@seed-design/lynx-css/recipes/image-frame-icon";
import { imageFrameIndicator } from "@seed-design/lynx-css/recipes/image-frame-indicator";
import { imageFrameReactionButton } from "@seed-design/lynx-css/recipes/image-frame-reaction-button";
import { Image, useImageContext, type UseImageProps } from "@seed-design/lynx-react-image";
import { Toggle, useToggleContext, type UseToggleProps } from "@seed-design/lynx-react-toggle";
import clsx from "clsx";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxIconElementProps, LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { handleDimension, useStyleProps, type StyleProps } from "../../utils/styled";
import { Badge, type BadgeProps } from "../Badge";
import { InternalIcon } from "../Icon/Icon";
import { heartFillSource, heartLineSource } from "./heart-assets";

/**
 * @platform Lynx
 * Native image loading uses bindload/binderror; HTML image loading, decoding,
 * crossOrigin, referrerPolicy, sizes, srcSet and polymorphic as/asChild are unsupported.
 */
export interface ImageFrameProps extends StyleProps, Omit<LynxViewProps, "style"> {
  style?: CSSProperties;
  src: string;
  alt: string;
  ratio?: number;
  stroke?: boolean;
  fallback?: React.ReactNode;
  bindload?: IntrinsicElements["image"]["bindload"];
  binderror?: IntrinsicElements["image"]["binderror"];
  onLoadingStatusChange?: UseImageProps["onLoadingStatusChange"];
}

export const ImageFrame = React.forwardRef<unknown, ImageFrameProps>((props, ref) => {
  const [variantProps, otherProps] = imageFrame.splitVariantProps(props);
  const {
    ratio = 4 / 3,
    src,
    alt,
    fallback,
    bindload,
    binderror,
    onLoadingStatusChange,
    borderRadius = "r2",
    ...rest
  } = otherProps;
  const { style, restProps } = useStyleProps({ borderRadius, ...rest });
  const { children, className, ...nativeProps } = restProps;
  const classNames = imageFrame(variantProps);
  const frameStyle = {
    "--seed-image-frame-ratio": String(ratio),
    "--seed-image-frame-radius": handleDimension(style.borderRadius ?? 0),
    ...style,
  };

  // Forward resolved caller corner overrides to the stroke as well as the
  // clipping root. Keep the shorthand in the recipe so multi-value radii work.
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
  } = style;
  const strokeStyle = {
    borderTopLeftRadius: borderTopLeftRadius ?? "",
    borderTopRightRadius: borderTopRightRadius ?? "",
    borderBottomRightRadius: borderBottomRightRadius ?? "",
    borderBottomLeftRadius: borderBottomLeftRadius ?? "",
  };

  return (
    <Image.Root
      onLoadingStatusChange={onLoadingStatusChange}
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classNames.root, className)}
      style={frameStyle}
    >
      {fallback != null ? (
        <Image.Fallback className={classNames.fallback}>{fallback}</Image.Fallback>
      ) : null}
      <FrameImage src={src} alt={alt} bindload={bindload} binderror={binderror} />
      {children}
      {variantProps.stroke ? (
        <view className={classNames.stroke} style={strokeStyle} accessibility-elements-hidden />
      ) : null}
    </Image.Root>
  );
});
ImageFrame.displayName = "ImageFrame";

function FrameImage(props: Pick<ImageFrameProps, "src" | "alt" | "bindload" | "binderror">) {
  const { isLoaded } = useImageContext();
  return (
    <Image.Content
      {...props}
      mode="aspectFill"
      className={imageFrame({ loaded: isLoaded }).content}
    />
  );
}

/** @platform Lynx Native view placement; polymorphic `as` is unsupported. */
export interface ImageFrameFloaterProps extends Omit<LynxViewProps, "style"> {
  style?: CSSProperties;
  placement: NonNullable<ImageFrameVariantProps["placement"]>;
  offsetX?: 0 | StyleProps["width"];
  offsetY?: 0 | StyleProps["height"];
  zIndex?: number;
}

export const ImageFrameFloater = React.forwardRef<unknown, ImageFrameFloaterProps>((props, ref) => {
  const [variantProps, otherProps] = imageFrame.splitVariantProps(props);
  const {
    offsetX = variantProps.placement?.endsWith("-center") ? 0 : "x1_5",
    offsetY = variantProps.placement?.startsWith("middle-") ? 0 : "x1_5",
    zIndex,
    children,
    className,
    style,
    ...nativeProps
  } = otherProps;
  const floaterStyle = {
    "--seed-image-frame-offset-x": handleDimension(offsetX),
    "--seed-image-frame-offset-y": handleDimension(offsetY),
    zIndex,
    ...style,
  };
  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(imageFrame(variantProps).floater, className)}
      style={floaterStyle}
    >
      {children}
    </view>
  );
});
ImageFrameFloater.displayName = "ImageFrameFloater";

export interface ImageFrameBadgeProps extends BadgeProps {}
export const ImageFrameBadge = React.forwardRef<unknown, ImageFrameBadgeProps>((props, ref) => (
  <Badge {...(ref ? { ref } : {})} {...props} />
));
ImageFrameBadge.displayName = "ImageFrameBadge";

/** @platform Lynx `svg` accepts a Lynx icon component; native DOM SVG is unsupported. */
export interface ImageFrameIconProps extends Omit<LynxViewProps, "children" | "style"> {
  style?: CSSProperties;
  children?: never;
  svg: React.ReactElement<LynxIconElementProps>;
}
export const ImageFrameIcon = React.forwardRef<unknown, ImageFrameIconProps>(
  ({ svg, children: _children, className, ...props }, ref) => (
    <InternalIcon
      {...(ref ? { ref } : {})}
      {...props}
      icon={svg}
      className={clsx(imageFrameIcon(), className)}
    />
  ),
);
ImageFrameIcon.displayName = "ImageFrameIcon";

export interface ImageFrameIndicatorProps extends LynxViewProps {
  children: React.ReactNode;
}
export const ImageFrameIndicator = React.forwardRef<unknown, ImageFrameIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const classNames = imageFrameIndicator();
    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, props)}
        className={clsx(classNames.root, className)}
      >
        <text className={classNames.label}>{children}</text>
      </view>
    );
  },
);
ImageFrameIndicator.displayName = "ImageFrameIndicator";

/** @platform Lynx No HTML button/form props, keyboard focus or `asChild`. */
export interface ImageFrameReactionButtonProps
  extends UseToggleProps,
    Omit<LynxViewProps, "children"> {
  children?: never;
}
const { ClassNamesProvider: ReactionClassNamesProvider, useClassNames: useReactionClassNames } =
  createSlotRecipeContext(imageFrameReactionButton);
function ReactionIcon() {
  const { pressed } = useToggleContext();
  const classNames = useReactionClassNames();
  return (
    <image
      src={pressed ? heartFillSource : heartLineSource}
      className={pressed ? classNames.fillIcon : classNames.lineIcon}
      accessibility-elements-hidden
    />
  );
}
export const ImageFrameReactionButton = React.forwardRef<unknown, ImageFrameReactionButtonProps>(
  (props, ref) => {
    const { children: _children, disabled = false, className, ...nativeProps } = props;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({ disabled });
    const classNames = imageFrameReactionButton();
    return (
      <ReactionClassNamesProvider value={classNames}>
        <Toggle.Root
          {...mergeProps(
            ref ? { ref: ref as LynxViewRef } : {},
            scaleFeedbackTargetProps,
            scaleFeedbackTriggerProps,
            nativeProps,
          )}
          disabled={disabled}
          flatten={false}
          hit-slop={props["hit-slop"] ?? "8px"}
          className={clsx(classNames.root, className)}
        >
          <ReactionIcon />
        </Toggle.Root>
      </ReactionClassNamesProvider>
    );
  },
);
ImageFrameReactionButton.displayName = "ImageFrameReactionButton";

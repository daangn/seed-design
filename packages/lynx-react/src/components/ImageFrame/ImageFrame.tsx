import * as React from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements } from "@lynx-js/types";
import { imageFrame, type ImageFrameVariantProps } from "@seed-design/lynx-css/recipes/image-frame";
import { imageFrameIcon } from "@seed-design/lynx-css/recipes/image-frame-icon";
import { imageFrameIndicator } from "@seed-design/lynx-css/recipes/image-frame-indicator";
import { imageFrameReactionButton } from "@seed-design/lynx-css/recipes/image-frame-reaction-button";
import { useImage, type UseImageProps } from "@seed-design/lynx-react-image";
import { useToggle, type UseToggleProps } from "@seed-design/lynx-react-toggle";
import clsx from "clsx";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxIconElementProps, LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { handleDimension, useStyleProps, type StyleProps } from "../../utils/styled";
import { Badge, type BadgeProps } from "../Badge";
import { Icon } from "../Icon";
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
  const { isLoaded, handleLoad, handleError } = useImage({ src, onLoadingStatusChange });
  const classNames = imageFrame({ ...variantProps, loaded: isLoaded });
  const frameStyle = {
    "--seed-image-frame-ratio": String(ratio),
    "--seed-image-frame-radius": String(style.borderRadius ?? 0),
    ...style,
  };

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classNames.root, className)}
      style={frameStyle}
    >
      {!isLoaded && fallback != null ? (
        <view className={classNames.fallback}>{fallback}</view>
      ) : null}
      <FrameImage
        key={src}
        src={src}
        alt={alt}
        className={classNames.content}
        {...mergeProps({ bindload: handleLoad, binderror: handleError }, { bindload, binderror })}
      />
      {children}
      {variantProps.stroke ? (
        <view className={classNames.stroke} accessibility-elements-hidden />
      ) : null}
    </view>
  );
});
ImageFrame.displayName = "ImageFrame";

// Key the component boundary, so the compiled native image snapshot is recreated per request.
function FrameImage({
  src,
  alt,
  ...props
}: Pick<ImageFrameProps, "src" | "alt" | "bindload" | "binderror" | "className">) {
  return (
    <image
      {...props}
      src={src}
      mode="aspectFill"
      accessibility-element={alt.length > 0}
      accessibility-label={alt}
      accessibility-traits="image"
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
    offsetX = "x1_5",
    offsetY = "x1_5",
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
    <Icon
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
function ReactionIcon({ pressed }: { pressed: boolean }) {
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
    const {
      children: _children,
      pressed,
      defaultPressed,
      onPressedChange,
      disabled = false,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      ...nativeProps
    } = props;
    const toggle = useToggle({ pressed, defaultPressed, onPressedChange, disabled });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({ disabled });
    const classNames = imageFrameReactionButton();
    return (
      <ReactionClassNamesProvider value={classNames}>
        <view
          {...mergeProps(
            ref ? { ref: ref as LynxViewRef } : {},
            scaleFeedbackTargetProps,
            scaleFeedbackTriggerProps,
            toggle.rootProps,
            nativeProps,
            {
              bindtap: disabled ? undefined : bindtap,
              "main-thread:bindtap": disabled ? undefined : mainThreadBindtap,
            },
          )}
          flatten={false}
          hit-slop={props["hit-slop"] ?? "8px"}
          className={clsx(classNames.root, className)}
          accessibility-element={props["accessibility-element"] ?? true}
          accessibility-traits={disabled ? "disabled" : "button"}
          accessibility-role-description={
            props["accessibility-role-description"] ?? "toggle button"
          }
          accessibility-value={
            props["accessibility-value"] ?? (toggle.pressed ? "pressed" : "not pressed")
          }
        >
          <ReactionIcon pressed={toggle.pressed} />
        </view>
      </ReactionClassNamesProvider>
    );
  },
);
ImageFrameReactionButton.displayName = "ImageFrameReactionButton";

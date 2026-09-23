import * as React from "@lynx-js/react";
import { avatar, type AvatarVariantProps } from "@seed-design/lynx-css/recipes/avatar";
import {
  avatarStack,
  type AvatarStackVariantProps,
} from "@seed-design/lynx-css/recipes/avatar-stack";
import { Image, useImageContext, type ImageLoadingStatus } from "@seed-design/lynx-react-image";
import clsx from "clsx";
import { toArray } from "../../utils/children";
import type { LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(avatar);
/** @platform Lynx Native view props replace DOM/asChild props. Badge cutouts use generated clip paths on native views. */
export interface AvatarRootProps extends AvatarVariantProps, LynxViewProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export const AvatarRoot = React.forwardRef<unknown, AvatarRootProps>((props, ref) => {
  const [variantProps, otherProps] = avatar.splitVariantProps(mergeProps(useProps() ?? {}, props));
  const { children, className, onLoadingStatusChange, ...nativeProps } = otherProps;
  const classes = avatar(variantProps);
  return (
    <ClassNamesProvider value={classes}>
      <PropsProvider value={variantProps}>
        <Image.Root
          onLoadingStatusChange={onLoadingStatusChange}
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classes.root, className)}
        >
          {children}
          <view
            flatten={false}
            className={classes.stroke}
            user-interaction-enabled={false}
            accessibility-elements-hidden={true}
          />
        </Image.Root>
      </PropsProvider>
    </ClassNamesProvider>
  );
});
AvatarRoot.displayName = "AvatarRoot";

/** @platform Lynx Uses native image props; alt maps to accessibility-label. srcSet and asChild are unsupported. */
export interface AvatarImageProps extends Image.ContentProps {}
export const AvatarImage = React.forwardRef<unknown, AvatarImageProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const classes = useClassNames();
  const { isLoaded } = useImageContext();
  return (
    <view
      flatten={false}
      // Explicit native gating keeps pending image layers from intercepting fallback taps.
      user-interaction-enabled={isLoaded}
      className={clsx(classes.imageContainer, !isLoaded && classes.pendingImageContainer)}
    >
      <Image.Content
        mode="aspectFill"
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classes.image, !isLoaded && classes.pendingImage, className)}
      />
    </view>
  );
});
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends Image.FallbackProps {}
export const AvatarFallback = React.forwardRef<unknown, AvatarFallbackProps>(
  ({ children, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    return (
      <Image.Fallback
        {...nativeProps}
        flatten={false}
        {...(ref ? { ref } : {})}
        className={clsx(classes.fallback, className)}
      >
        {children}
      </Image.Fallback>
    );
  },
);
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarBadgeProps extends LynxViewProps {}
export const AvatarBadge = React.forwardRef<unknown, AvatarBadgeProps>(
  ({ children, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.badge, className)}
      >
        {children}
      </view>
    );
  },
);
AvatarBadge.displayName = "AvatarBadge";

export interface AvatarStackProps extends AvatarStackVariantProps, LynxViewProps {}
export const AvatarStack = React.forwardRef<unknown, AvatarStackProps>((props, ref) => {
  const [variantProps, otherProps] = avatarStack.splitVariantProps(props);
  const { children, className, ...nativeProps } = otherProps;
  const classes = avatarStack(variantProps);
  const value = React.useMemo(() => ({ size: variantProps.size ?? "48" }), [variantProps.size]);
  return (
    <PropsProvider value={value}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.root, className)}
      >
        {toArray(children).map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Wrapper order defines stacking order, matching React AvatarStack.
          <view key={index} className={clsx(classes.item, index > 0 && classes.overlap)}>
            {child}
          </view>
        ))}
      </view>
    </PropsProvider>
  );
});
AvatarStack.displayName = "AvatarStack";

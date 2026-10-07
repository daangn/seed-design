import { pageBanner, type PageBannerVariantProps } from "@seed-design/lynx-css/recipes/page-banner";
import {
  getIndependentActionProps,
  PageBannerProvider,
  usePageBanner,
  usePageBannerButton,
  usePageBannerCloseButton,
  type UsePageBannerProps,
  type UsePageBannerCloseButtonProps,
} from "@seed-design/lynx-react-page-banner";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";
import { toArray } from "../../utils/children";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(pageBanner);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * Differences from React Web:
 * - Uses Lynx native `<view>` and `bindtap` instead of `asChild` and DOM events.
 * - Does not provide a web focus ring.
 * - Actionable banners group their children for Content Scale. Render CloseButton
 *   directly under Root (or in a Fragment) to exclude it from that group.
 *   A CloseButton hidden inside a custom component remains in the content group.
 */
export interface PageBannerRootProps
  extends Omit<PageBannerVariantProps, "pressed" | "closeButtonPressed" | "interactive">,
    Pick<
      UsePageBannerProps,
      "defaultOpen" | "open" | "onDismiss" | "bindtap" | "main-thread:bindtap"
    >,
    Omit<
      LynxHostProps<"view">,
      | keyof PageBannerVariantProps
      | "defaultOpen"
      | "open"
      | "onDismiss"
      | "bindtap"
      | "main-thread:bindtap"
    > {}

export const PageBannerRoot = React.forwardRef<unknown, PageBannerRootProps>((props, ref) => {
  if (
    process.env.NODE_ENV !== "production" &&
    props.variant === "solid" &&
    props.tone === "magic"
  ) {
    console.error(
      '`magic` tone is not available for `solid` variant in PageBanner components. Please use variant="weak" or a different tone instead.',
    );
  }

  const [variantProps, otherProps] = pageBanner.splitVariantProps(props);
  const {
    children,
    className,
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = otherProps;
  const api = usePageBanner({
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": nativeProps["accessibility-element"],
    "accessibility-traits": nativeProps["accessibility-traits"],
  });
  const { interactive, pressed, rootProps } = api;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: !interactive,
    onTouchStart: rootProps.bindtouchstart,
    onTouchEnd: rootProps.bindtouchend,
    onTouchCancel: rootProps.bindtouchcancel,
  });
  const childArray = flattenPageBannerChildren(children);
  const closeButtons = childArray.filter(isPageBannerCloseButton);
  const scaleChildren = childArray.filter((child) => !isPageBannerCloseButton(child));
  const classNames = pageBanner({ ...variantProps, pressed, interactive });
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        prefixIcon: classNames.prefixIcon,
        suffixIcon: classNames.suffixIcon,
      },
      deps: [variantProps.tone ?? "neutral", variantProps.variant ?? "weak", pressed],
    }),
    [
      classNames.prefixIcon,
      classNames.suffixIcon,
      pressed,
      variantProps.tone,
      variantProps.variant,
    ],
  );

  if (!api.open) return null;

  return (
    <PageBannerProvider value={api}>
      <ClassNamesProvider value={classNames}>
        <PropsProvider value={variantProps}>
          <IconSlotProvider value={iconSlotContextValue}>
            <view
              {...mergeProps(
                rootProps,
                interactive ? scaleFeedbackTriggerProps : {},
                nativeProps,
                ref ? { ref: ref as LynxViewRef } : {},
              )}
              className={clsx(classNames.root, className)}
            >
              {interactive ? (
                <>
                  <view {...scaleFeedbackTargetProps} className={classNames.scaleContent}>
                    {scaleChildren}
                  </view>
                  {closeButtons}
                </>
              ) : (
                children
              )}
            </view>
          </IconSlotProvider>
        </PropsProvider>
      </ClassNamesProvider>
    </PageBannerProvider>
  );
});
PageBannerRoot.displayName = "PageBannerRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerContentProps extends LynxHostProps<"view"> {}

export const PageBannerContent = React.forwardRef<unknown, PageBannerContentProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classNames.content, className)}
    >
      {children}
    </view>
  );
});
PageBannerContent.displayName = "PageBannerContent";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerBodyProps extends LynxHostProps<"text"> {}

export const PageBannerBody = React.forwardRef<unknown, PageBannerBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.body, className)}
    >
      {children}
    </text>
  );
});
PageBannerBody.displayName = "PageBannerBody";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerTitleProps extends LynxHostProps<"text"> {}

export const PageBannerTitle = React.forwardRef<unknown, PageBannerTitleProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.title, className)}
    >
      {children}
      {"  "}
    </text>
  );
});
PageBannerTitle.displayName = "PageBannerTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerDescriptionProps extends LynxHostProps<"text"> {}

export const PageBannerDescription = React.forwardRef<unknown, PageBannerDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classNames.description, className)}
      >
        {children}
      </text>
    );
  },
);
PageBannerDescription.displayName = "PageBannerDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerButtonProps extends LynxHostProps<"text"> {}

export const PageBannerButton = React.forwardRef<unknown, PageBannerButtonProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();
  const { buttonProps } = usePageBannerButton({
    "accessibility-element": nativeProps["accessibility-element"],
    "accessibility-traits": nativeProps["accessibility-traits"],
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();

  return (
    <text
      {...getIndependentActionProps(
        mergeProps(
          { flatten: false },
          buttonProps,
          scaleFeedbackTriggerProps,
          scaleFeedbackTargetProps,
          nativeProps,
          ref ? { ref: ref as LynxTextRef } : {},
        ),
      )}
      className={clsx(classNames.button, className)}
    >
      {children}
    </text>
  );
});
PageBannerButton.displayName = "PageBannerButton";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerCloseButtonProps
  extends Omit<LynxHostProps<"view">, "bindtap" | "main-thread:bindtap">,
    Pick<UsePageBannerCloseButtonProps, "bindtap" | "main-thread:bindtap"> {}

export const PageBannerCloseButton = React.forwardRef<unknown, PageBannerCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      ...nativeProps
    } = props;
    const parentVariantProps = useProps() ?? {};
    const { pressed, closeButtonProps } = usePageBannerCloseButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": nativeProps["accessibility-element"],
      "accessibility-label": nativeProps["accessibility-label"],
      "accessibility-traits": nativeProps["accessibility-traits"],
    });
    // Press state follows the Scale Feedback Main Thread touch handlers, as before the split.
    const { bindtouchstart, bindtouchend, bindtouchcancel, ...closeProps } = closeButtonProps;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const classNames = pageBanner({
      ...parentVariantProps,
      closeButtonPressed: pressed,
    });
    const iconSlotContextValue = React.useMemo(
      () => ({
        classNames: { suffixIcon: classNames.closeButtonIcon },
        deps: [parentVariantProps.tone ?? "neutral", parentVariantProps.variant ?? "weak", pressed],
      }),
      [classNames.closeButtonIcon, parentVariantProps.tone, parentVariantProps.variant, pressed],
    );

    return (
      <IconSlotProvider value={iconSlotContextValue}>
        <view
          {...getIndependentActionProps(
            mergeProps(
              { flatten: false },
              closeProps,
              scaleFeedbackTriggerProps,
              scaleFeedbackTargetProps,
              nativeProps,
              ref ? { ref: ref as LynxViewRef } : {},
            ),
          )}
          className={clsx(classNames.closeButton, className)}
        >
          {children}
        </view>
      </IconSlotProvider>
    );
  },
);
PageBannerCloseButton.displayName = "PageBannerCloseButton";

function isPageBannerCloseButton(node: React.ReactNode) {
  return React.isValidElement(node) && node.type === PageBannerCloseButton;
}

function flattenPageBannerChildren(children: React.ReactNode): React.ReactNode[] {
  return toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment
      ? flattenPageBannerChildren(child.props.children)
      : [child],
  );
}

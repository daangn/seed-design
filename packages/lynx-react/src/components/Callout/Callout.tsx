import { callout, type CalloutVariantProps } from "@seed-design/lynx-css/recipes/callout";
import {
  CalloutProvider,
  useCallout,
  useCalloutCloseButton,
  type UseCalloutProps,
} from "@seed-design/lynx-react-callout";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(callout);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 차이:
 * - `asChild`와 DOM 이벤트 대신 Lynx native `<view>`와 `bindtap`을 사용합니다.
 * - 웹 focus ring은 지원하지 않습니다.
 */
export interface CalloutRootProps
  extends Omit<CalloutVariantProps, "pressed" | "interactive">,
    Pick<UseCalloutProps, "defaultOpen" | "open" | "onDismiss">,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const CalloutRoot = React.forwardRef<unknown, CalloutRootProps>((props, ref) => {
  const [variantProps, otherProps] = callout.splitVariantProps(props);
  const {
    children,
    className,
    style,
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = otherProps;
  const api = useCallout({
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  });
  const { interactive, pressed } = api;
  // Press state follows the Scale Feedback Main Thread touch handlers, as before the split.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: !interactive,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classNames = callout({ ...variantProps, pressed, interactive });
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        prefixIcon: classNames.prefixIcon,
        suffixIcon: classNames.suffixIcon,
      },
      deps: [variantProps.tone ?? "neutral", pressed],
    }),
    [classNames.prefixIcon, classNames.suffixIcon, pressed, variantProps.tone],
  );

  if (!api.open) return null;

  return (
    <CalloutProvider value={api}>
      <ClassNamesProvider value={classNames}>
        <IconSlotProvider value={iconSlotContextValue}>
          <view
            {...mergeProps(
              ref ? { ref: ref as LynxViewRef } : {},
              rootProps,
              interactive ? scaleFeedbackTargetProps : {},
              interactive ? scaleFeedbackTriggerProps : {},
              nativeProps,
            )}
            className={clsx(classNames.root, className)}
            style={style}
            {...(interactive ? { flatten: false } : {})}
          >
            {children}
          </view>
        </IconSlotProvider>
      </ClassNamesProvider>
    </CalloutProvider>
  );
});
CalloutRoot.displayName = "CalloutRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutContentProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const CalloutContent = React.forwardRef<unknown, CalloutContentProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.content, className)}
      style={style}
    >
      {children}
    </text>
  );
});
CalloutContent.displayName = "CalloutContent";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutTitleProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const CalloutTitle = React.forwardRef<unknown, CalloutTitleProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.title, className)}
      style={style}
    >
      {children}
      {"  "}
    </text>
  );
});
CalloutTitle.displayName = "CalloutTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutDescriptionProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const CalloutDescription = React.forwardRef<unknown, CalloutDescriptionProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classNames.description, className)}
        style={style}
      >
        {children}
        {"  "}
      </text>
    );
  },
);
CalloutDescription.displayName = "CalloutDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutLinkProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const CalloutLink = React.forwardRef<unknown, CalloutLinkProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "link",
    ...nativeProps
  } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits}
      className={clsx(classNames.link, className)}
      style={style}
    >
      {children}
    </text>
  );
});
CalloutLink.displayName = "CalloutLink";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutCloseButtonProps
  // Keep the scale target's Android View even if shared props later expose flatten.
  extends Omit<LynxStyledElementProps, "flatten">,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const CalloutCloseButton = React.forwardRef<unknown, CalloutCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const classNames = useClassNames();
    const { closeButtonProps } = useCalloutCloseButton({
      bindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();

    return (
      <view
        {...mergeProps(
          closeButtonProps,
          ref ? { ref: ref as LynxViewRef } : {},
          scaleFeedbackTargetProps,
          scaleFeedbackTriggerProps,
          nativeProps,
        )}
        className={clsx(classNames.closeButton, className)}
        style={style}
        flatten={false}
      >
        {children}
      </view>
    );
  },
);
CalloutCloseButton.displayName = "CalloutCloseButton";

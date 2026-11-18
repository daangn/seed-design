import { callout, type CalloutVariantProps } from "@seed-design/lynx-css/recipes/callout";
import {
  CalloutProvider,
  useCallout,
  useCalloutCloseButton,
  type UseCalloutProps,
  type UseCalloutCloseButtonProps,
} from "@seed-design/lynx-react-callout";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
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
    Omit<
      LynxHostProps<"view">,
      | keyof CalloutVariantProps
      | "defaultOpen"
      | "open"
      | "onDismiss"
      | "bindtap"
      | "main-thread:bindtap"
    >,
    Pick<UseCalloutProps, "bindtap" | "main-thread:bindtap"> {}

export const CalloutRoot = React.forwardRef<unknown, CalloutRootProps>((props, ref) => {
  const [variantProps, otherProps] = callout.splitVariantProps(props);
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
  const api = useCallout({
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": nativeProps["accessibility-element"],
    "accessibility-traits": nativeProps["accessibility-traits"],
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
              interactive ? { flatten: false } : {},
              rootProps,
              interactive ? scaleFeedbackTargetProps : {},
              interactive ? scaleFeedbackTriggerProps : {},
              nativeProps,
              ref ? { ref: ref as LynxViewRef } : {},
            )}
            className={clsx(classNames.root, className)}
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

export interface CalloutContentProps extends LynxHostProps<"text"> {}

export const CalloutContent = React.forwardRef<unknown, CalloutContentProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.content, className)}
    >
      {children}
    </text>
  );
});
CalloutContent.displayName = "CalloutContent";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutTitleProps extends LynxHostProps<"text"> {}

export const CalloutTitle = React.forwardRef<unknown, CalloutTitleProps>((props, ref) => {
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
CalloutTitle.displayName = "CalloutTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutDescriptionProps extends LynxHostProps<"text"> {}

export const CalloutDescription = React.forwardRef<unknown, CalloutDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classNames.description, className)}
      >
        {children}
        {"  "}
      </text>
    );
  },
);
CalloutDescription.displayName = "CalloutDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutLinkProps extends LynxHostProps<"text"> {}

export const CalloutLink = React.forwardRef<unknown, CalloutLinkProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...mergeProps(
        { "accessibility-element": true, "accessibility-traits": "link" } as const,
        nativeProps,
        ref ? { ref: ref as LynxTextRef } : {},
      )}
      className={clsx(classNames.link, className)}
    >
      {children}
    </text>
  );
});
CalloutLink.displayName = "CalloutLink";

////////////////////////////////////////////////////////////////////////////////////

export interface CalloutCloseButtonProps
  extends Omit<LynxHostProps<"view">, "bindtap">,
    Pick<UseCalloutCloseButtonProps, "bindtap"> {}

export const CalloutCloseButton = React.forwardRef<unknown, CalloutCloseButtonProps>(
  (props, ref) => {
    const { children, className, bindtap, ...nativeProps } = props;
    const classNames = useClassNames();
    const { closeButtonProps } = useCalloutCloseButton({
      bindtap,
      "accessibility-element": nativeProps["accessibility-element"],
      "accessibility-label": nativeProps["accessibility-label"],
      "accessibility-traits": nativeProps["accessibility-traits"],
    });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();

    return (
      <view
        {...mergeProps(
          { flatten: false },
          closeButtonProps,
          scaleFeedbackTargetProps,
          scaleFeedbackTriggerProps,
          nativeProps,
          ref ? { ref: ref as LynxViewRef } : {},
        )}
        className={clsx(classNames.closeButton, className)}
      >
        {children}
      </view>
    );
  },
);
CalloutCloseButton.displayName = "CalloutCloseButton";

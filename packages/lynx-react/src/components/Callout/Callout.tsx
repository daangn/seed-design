import { callout, type CalloutVariantProps } from "@seed-design/lynx-css/recipes/callout";
import * as React from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(callout);

type TapHandler = NonNullable<LynxViewProps["bindtap"]>;

interface CalloutContextValue {
  dismiss: () => void;
}

const CalloutContext = React.createContext<CalloutContextValue | null>(null);

function useCalloutContext(consumer: string) {
  const context = React.useContext(CalloutContext);

  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <CalloutRoot/>.`);
  }

  return context;
}

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
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  defaultOpen?: boolean;
  open?: boolean;
  onDismiss?: () => void;
}

export const CalloutRoot = React.forwardRef<unknown, CalloutRootProps>((props, ref) => {
  const [variantProps, otherProps] = callout.splitVariantProps(props);
  const {
    children,
    className,
    style,
    defaultOpen = true,
    open: openProp,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = otherProps;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const isInteractive = bindtap != null || mainThreadBindtap != null;
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressTapHandlers } =
    usePressTap({
      disabled: !isInteractive,
      onTap: bindtap,
      mainThreadOnTap: mainThreadBindtap,
    });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: !isInteractive,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classNames = callout({ ...variantProps, pressed, interactive: isInteractive });
  const dismiss = useMemoizedFn(() => {
    if (!open) return;

    setOpen(false);
    onDismiss?.();
  });
  const contextValue = React.useMemo(() => ({ dismiss }), [dismiss]);
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

  if (!open) return null;

  return (
    <CalloutContext.Provider value={contextValue}>
      <ClassNamesProvider value={classNames}>
        <IconSlotProvider value={iconSlotContextValue}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            {...(isInteractive ? pressTapHandlers : {})}
            {...(isInteractive ? scaleFeedbackTargetProps : {})}
            {...(isInteractive ? scaleFeedbackTriggerProps : {})}
            accessibility-element={accessibilityElement ?? (isInteractive ? true : undefined)}
            accessibility-traits={accessibilityTraits ?? (isInteractive ? "button" : undefined)}
            className={clsx(classNames.root, className)}
            style={style}
          >
            {children}
          </view>
        </IconSlotProvider>
      </ClassNamesProvider>
    </CalloutContext.Provider>
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
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
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
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
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
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        {...nativeProps}
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
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
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
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const CalloutCloseButton = React.forwardRef<unknown, CalloutCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits = "button",
      ...nativeProps
    } = props;
    const classNames = useClassNames();
    const { dismiss } = useCalloutContext("CalloutCloseButton");
    const handleTap = useMemoizedFn<TapHandler>((event) => {
      bindtap?.(event);
      dismiss();
    });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();

    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("CalloutCloseButton requires `accessibility-label` for accessibility.");
    }

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        bindtap={handleTap}
        {...scaleFeedbackTargetProps}
        {...scaleFeedbackTriggerProps}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-traits={accessibilityTraits}
        className={clsx(classNames.closeButton, className)}
        style={style}
      >
        {children}
      </view>
    );
  },
);
CalloutCloseButton.displayName = "CalloutCloseButton";

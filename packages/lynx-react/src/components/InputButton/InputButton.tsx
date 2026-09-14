import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  inputButton,
  type InputButtonVariantProps,
} from "@seed-design/lynx-css/recipes/input-button";
import clsx from "clsx";

import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback, type ScaleFeedbackTriggerProps } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import { toArray } from "../../utils/children";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";

interface InputButtonContextValue {
  variantProps: InputButtonVariantProps;
  disabled: boolean;
  readOnly: boolean;
  pressed: boolean;
  scaleFeedbackTriggerProps: ScaleFeedbackTriggerProps;
}

const InputButtonContext = React.createContext<InputButtonContextValue | null>(null);

function useInputButtonContext(consumer: string): InputButtonContextValue {
  const context = React.useContext(InputButtonContext);

  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <InputButton.Root/>.`);
  }

  return context;
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `size="responsive"`: Lynx에는 CSS viewport breakpoint가 없음
 * - HTML form 제출과 DOM ARIA id 연결
 * - Content Scale을 적용하려면 Button을 Root의 직접 자식 또는 Fragment 안에 둡니다.
 *   커스텀 컴포넌트로 감싼 Button은 기존 구조를 보존하며 Content Scale을 생략합니다.
 */
export interface InputButtonRootProps
  extends Omit<InputButtonVariantProps, "pressed">,
    LynxStyledElementProps {}

export const InputButtonRoot = React.forwardRef<NodesRef, InputButtonRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = inputButton.splitVariantProps(props);
    const { children, className, ...nativeProps } = otherProps;
    const disabled = variantProps.disabled ?? false;
    const readOnly = variantProps.readOnly ?? false;
    const classes = inputButton(variantProps);
    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel } = usePressTap({
      disabled: disabled || readOnly,
    });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: disabled || readOnly,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const childArray = flattenInputButtonChildren(children);
    const buttonChildren = childArray.filter(isInputButtonButton);
    const contentChildren = childArray.filter((child) => !isInputButtonButton(child));
    const contextValue = React.useMemo(
      () => ({ variantProps, disabled, readOnly, pressed, scaleFeedbackTriggerProps }),
      [variantProps, disabled, readOnly, pressed, scaleFeedbackTriggerProps],
    );

    return (
      <InputButtonContext.Provider value={contextValue}>
        <view
          {...(forwardedRef ? { ref: forwardedRef } : {})}
          className={clsx(classes.root, className)}
          {...nativeProps}
        >
          {buttonChildren.length > 0 ? (
            <>
              {buttonChildren}
              <view {...scaleFeedbackTargetProps} className={classes.content}>
                {contentChildren}
              </view>
            </>
          ) : (
            children
          )}
        </view>
      </InputButtonContext.Provider>
    );
  },
);
InputButtonRoot.displayName = "InputButtonRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface InputButtonButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const InputButtonButton = React.forwardRef<unknown, InputButtonButtonProps>((props, ref) => {
  const context = useInputButtonContext("InputButton.Button");
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const nonInteractive = context.disabled || context.readOnly;
  const { bindtap: handleTap, "main-thread:bindtap": handleMainThreadTap } = usePressTap({
    disabled: nonInteractive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = inputButton({ ...context.variantProps, pressed: context.pressed });

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.button, className)}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits ?? (nonInteractive ? "disabled" : "button")}
      {...mergeProps(
        { bindtap: handleTap, "main-thread:bindtap": handleMainThreadTap },
        context.scaleFeedbackTriggerProps,
        nativeProps,
      )}
    >
      <view className={classes.baseStroke} accessibility-elements-hidden={true} />
      <view className={classes.stroke} accessibility-elements-hidden={true} />
      {children}
    </view>
  );
});
InputButtonButton.displayName = "InputButtonButton";

function isInputButtonButton(node: React.ReactNode) {
  return React.isValidElement(node) && node.type === InputButtonButton;
}

function flattenInputButtonChildren(children: React.ReactNode): React.ReactNode[] {
  return toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment
      ? flattenInputButtonChildren(child.props.children)
      : [child],
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface InputButtonValueProps extends LynxStyledElementProps {}

export const InputButtonValue = React.forwardRef<unknown, InputButtonValueProps>((props, ref) => {
  const context = useInputButtonContext("InputButton.Value");
  const classes = inputButton(context.variantProps);
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.value, className)}
      accessibility-elements-hidden={true}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
InputButtonValue.displayName = "InputButtonValue";

export interface InputButtonPlaceholderProps extends LynxStyledElementProps {}

export const InputButtonPlaceholder = React.forwardRef<unknown, InputButtonPlaceholderProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.Placeholder");
    const classes = inputButton(context.variantProps);
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.placeholder, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
InputButtonPlaceholder.displayName = "InputButtonPlaceholder";

////////////////////////////////////////////////////////////////////////////////////

export interface InputButtonPrefixTextProps extends LynxStyledElementProps {}

export const InputButtonPrefixText = React.forwardRef<unknown, InputButtonPrefixTextProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.PrefixText");
    const classes = inputButton(context.variantProps);
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.prefixText, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
InputButtonPrefixText.displayName = "InputButtonPrefixText";

export interface InputButtonPrefixIconProps extends InternalIconProps {}

export const InputButtonPrefixIcon = React.forwardRef<unknown, InputButtonPrefixIconProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.PrefixIcon");
    const classes = inputButton(context.variantProps);
    const { className, ...otherProps } = props;

    return (
      <InternalIcon
        ref={ref}
        className={clsx(classes.prefixIcon, className)}
        accessibility-elements-hidden={true}
        {...otherProps}
      />
    );
  },
);
InputButtonPrefixIcon.displayName = "InputButtonPrefixIcon";

export interface InputButtonSuffixTextProps extends LynxStyledElementProps {}

export const InputButtonSuffixText = React.forwardRef<unknown, InputButtonSuffixTextProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.SuffixText");
    const classes = inputButton(context.variantProps);
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.suffixText, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
InputButtonSuffixText.displayName = "InputButtonSuffixText";

export interface InputButtonSuffixIconProps extends InternalIconProps {}

export const InputButtonSuffixIcon = React.forwardRef<unknown, InputButtonSuffixIconProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.SuffixIcon");
    const classes = inputButton(context.variantProps);
    const { className, ...otherProps } = props;

    return (
      <InternalIcon
        ref={ref}
        className={clsx(classes.suffixIcon, className)}
        accessibility-elements-hidden={true}
        {...otherProps}
      />
    );
  },
);
InputButtonSuffixIcon.displayName = "InputButtonSuffixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface InputButtonClearButtonProps
  extends InternalIconProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const InputButtonClearButton = React.forwardRef<unknown, InputButtonClearButtonProps>(
  (props, ref) => {
    const context = useInputButtonContext("InputButton.ClearButton");
    const {
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    } = props;
    const nonInteractive = context.disabled || context.readOnly;
    const { pressed, ...pressHandlers } = usePressTap({
      disabled: nonInteractive,
      onTap: bindtap,
      mainThreadOnTap: mainThreadBindtap,
    });
    const classes = inputButton({ ...context.variantProps, pressed });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: nonInteractive,
    });

    if (nonInteractive) return null;

    if (process.env.NODE_ENV !== "production" && !accessibilityLabel) {
      console.warn("InputButton.ClearButton requires `accessibility-label` for accessibility.");
    }

    return (
      <InternalIcon
        ref={ref}
        className={clsx(classes.clearButton, className)}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-traits="button"
        {...mergeProps(
          pressHandlers,
          scaleFeedbackTriggerProps,
          scaleFeedbackTargetProps,
          otherProps,
          { flatten: false },
        )}
      />
    );
  },
);
InputButtonClearButton.displayName = "InputButtonClearButton";

import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  fieldButton,
  type FieldButtonVariantProps,
} from "@seed-design/lynx-css/recipes/field-button";
import {
  FieldButtonProvider,
  useFieldButton,
  useFieldButtonButton,
  useFieldButtonClearButton,
  useFieldButtonContext,
  type UseFieldButtonContext,
  type UseFieldButtonProps,
} from "@seed-design/lynx-react-field-button";
import clsx from "clsx";

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

interface StyledFieldButtonContextValue extends UseFieldButtonContext {
  variantProps: FieldButtonVariantProps;
  scaleFeedbackTriggerProps: ScaleFeedbackTriggerProps;
}

function isStyledFieldButtonContext(
  context: UseFieldButtonContext,
): context is StyledFieldButtonContextValue {
  return "variantProps" in context;
}

function useStyledFieldButtonContext(consumer: string): StyledFieldButtonContextValue {
  const context = useFieldButtonContext();
  if (!isStyledFieldButtonContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <FieldButton.Root/>.`);
  }
  return context;
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-field-button`의 상태·press·접근성 위에 SEED recipe, stroke,
 * Content Scale과 Value/Placeholder/affix 표현을 조립합니다.
 *
 * 웹 대비 미지원 기능:
 * - `size="responsive"`: Lynx에는 CSS viewport breakpoint가 없음
 * - `name`·HiddenInput 등 HTML form 제출과 DOM ARIA id 연결
 * - Content Scale을 적용하려면 Button을 Root의 직접 자식 또는 Fragment 안에 둡니다.
 *   커스텀 컴포넌트로 감싼 Button은 기존 구조를 보존하며 Content Scale을 생략합니다.
 */
export interface FieldButtonRootProps
  extends Omit<FieldButtonVariantProps, "pressed">,
    Pick<UseFieldButtonProps, "values" | "onValuesChange">,
    LynxStyledElementProps {}

export const FieldButtonRoot = React.forwardRef<NodesRef, FieldButtonRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = fieldButton.splitVariantProps(props);
    const { children, className, values, onValuesChange, ...nativeProps } = otherProps;
    const api = useFieldButton({
      values,
      onValuesChange,
      disabled: variantProps.disabled,
      invalid: variantProps.invalid,
      readOnly: variantProps.readOnly,
    });
    const classes = fieldButton(variantProps);
    // Button이 이 Main Thread touch handler를 눌림 상태 갱신과 합성해 Background로 넘긴다.
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: !api.interactive,
    });
    const childArray = flattenFieldButtonChildren(children);
    const buttonChildren = childArray.filter(isFieldButtonButton);
    const contentChildren = childArray.filter((child) => !isFieldButtonButton(child));
    const contextValue = React.useMemo<StyledFieldButtonContextValue>(
      () => ({ ...api, variantProps, scaleFeedbackTriggerProps }),
      [api, variantProps, scaleFeedbackTriggerProps],
    );

    return (
      <FieldButtonProvider value={contextValue}>
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
      </FieldButtonProvider>
    );
  },
);
FieldButtonRoot.displayName = "FieldButtonRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const FieldButtonButton = React.forwardRef<unknown, FieldButtonButtonProps>((props, ref) => {
  const context = useStyledFieldButtonContext("FieldButton.Button");
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  // Scale Feedback의 Main Thread touch handler가 눌림 상태를 Background로 넘기므로
  // Background touch handler는 바인딩하지 않는다.
  const {
    pressed,
    buttonProps: {
      bindtouchstart: _bindtouchstart,
      bindtouchend: _bindtouchend,
      bindtouchcancel: _bindtouchcancel,
      ...buttonProps
    },
  } = useFieldButtonButton({
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...context.scaleFeedbackTriggerProps,
  });
  const classes = fieldButton({ ...context.variantProps, pressed });

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.button, className)}
      {...mergeProps(buttonProps, nativeProps)}
    >
      <view className={classes.baseStroke} accessibility-elements-hidden={true} />
      <view className={classes.stroke} accessibility-elements-hidden={true} />
      {children}
    </view>
  );
});
FieldButtonButton.displayName = "FieldButtonButton";

function isFieldButtonButton(node: React.ReactNode) {
  return React.isValidElement(node) && node.type === FieldButtonButton;
}

function flattenFieldButtonChildren(children: React.ReactNode): React.ReactNode[] {
  return toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment
      ? flattenFieldButtonChildren(child.props.children)
      : [child],
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonValueProps extends LynxStyledElementProps {}

export const FieldButtonValue = React.forwardRef<unknown, FieldButtonValueProps>((props, ref) => {
  const context = useStyledFieldButtonContext("FieldButton.Value");
  const classes = fieldButton(context.variantProps);
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
FieldButtonValue.displayName = "FieldButtonValue";

export interface FieldButtonPlaceholderProps extends LynxStyledElementProps {}

export const FieldButtonPlaceholder = React.forwardRef<unknown, FieldButtonPlaceholderProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.Placeholder");
    const classes = fieldButton(context.variantProps);
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
FieldButtonPlaceholder.displayName = "FieldButtonPlaceholder";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonPrefixTextProps extends LynxStyledElementProps {}

export const FieldButtonPrefixText = React.forwardRef<unknown, FieldButtonPrefixTextProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.PrefixText");
    const classes = fieldButton(context.variantProps);
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
FieldButtonPrefixText.displayName = "FieldButtonPrefixText";

export interface FieldButtonPrefixIconProps extends InternalIconProps {}

export const FieldButtonPrefixIcon = React.forwardRef<unknown, FieldButtonPrefixIconProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.PrefixIcon");
    const classes = fieldButton(context.variantProps);
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
FieldButtonPrefixIcon.displayName = "FieldButtonPrefixIcon";

export interface FieldButtonSuffixTextProps extends LynxStyledElementProps {}

export const FieldButtonSuffixText = React.forwardRef<unknown, FieldButtonSuffixTextProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.SuffixText");
    const classes = fieldButton(context.variantProps);
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
FieldButtonSuffixText.displayName = "FieldButtonSuffixText";

export interface FieldButtonSuffixIconProps extends InternalIconProps {}

export const FieldButtonSuffixIcon = React.forwardRef<unknown, FieldButtonSuffixIconProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.SuffixIcon");
    const classes = fieldButton(context.variantProps);
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
FieldButtonSuffixIcon.displayName = "FieldButtonSuffixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonClearButtonProps
  extends InternalIconProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const FieldButtonClearButton = React.forwardRef<unknown, FieldButtonClearButtonProps>(
  (props, ref) => {
    const context = useStyledFieldButtonContext("FieldButton.ClearButton");
    const {
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...otherProps
    } = props;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: !context.interactive,
    });
    const { pressed, rendered, clearButtonProps } = useFieldButtonClearButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
    });
    const classes = fieldButton({ ...context.variantProps, pressed });

    if (!rendered) return null;

    if (process.env.NODE_ENV !== "production" && !accessibilityLabel) {
      console.warn("FieldButton.ClearButton requires `accessibility-label` for accessibility.");
    }

    return (
      <InternalIcon
        ref={ref}
        className={clsx(classes.clearButton, className)}
        accessibility-label={accessibilityLabel}
        {...mergeProps(
          clearButtonProps,
          scaleFeedbackTriggerProps,
          scaleFeedbackTargetProps,
          otherProps,
          { flatten: false },
        )}
      />
    );
  },
);
FieldButtonClearButton.displayName = "FieldButtonClearButton";

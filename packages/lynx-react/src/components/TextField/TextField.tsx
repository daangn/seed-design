import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { textInput, type TextInputVariantProps } from "@seed-design/lynx-css/recipes/text-input";
import clsx from "clsx";

import type { LynxStyledElementProps, LynxTextRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";
import { useFieldContext } from "../Field/context";
import { TextFieldContext } from "./context";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(textInput);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 이번 기반 구현에는 native `<input>`과 `<textarea>`가 포함되지 않는다.
 * 입력 값 상태, 키보드 회피 등록, autoresize는 후속 입력 primitive에서 연결한다.
 */
export interface TextFieldRootProps
  extends Omit<TextInputVariantProps, "focused">,
    LynxStyledElementProps {
  required?: boolean;
}

export const TextFieldRoot = React.forwardRef<NodesRef, TextFieldRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = textInput.splitVariantProps(props);
    const { children, className, required: requiredProp, ...nativeProps } = otherProps;
    const fieldContext = useFieldContext({ strict: false });
    const rootRef = React.useRef<NodesRef | null>(null);
    const [localFocused, setLocalFocused] = React.useState(false);
    const disabled = variantProps.disabled ?? fieldContext?.disabled ?? false;
    const invalid = variantProps.invalid ?? fieldContext?.invalid ?? false;
    const readOnly = variantProps.readOnly ?? fieldContext?.readOnly ?? false;
    const required = requiredProp ?? fieldContext?.required ?? false;
    const focused = fieldContext?.focused ?? localFocused;
    const classes = textInput({
      ...variantProps,
      disabled,
      focused: focused && !readOnly,
      invalid,
      readOnly,
    });

    const mergedRef = React.useCallback(
      (node: NodesRef | null) => {
        "background only";

        rootRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const setFocused = React.useCallback(
      (nextFocused: boolean) => {
        "background only";

        setLocalFocused(nextFocused);
        fieldContext?.setFocused(nextFocused);
      },
      [fieldContext],
    );

    const contextValue = React.useMemo(
      () => ({
        rootRef,
        disabled,
        invalid,
        readOnly,
        required,
        focused,
        setFocused,
      }),
      [disabled, focused, invalid, readOnly, required, setFocused],
    );

    return (
      <TextFieldContext.Provider value={contextValue}>
        <ClassNamesProvider value={classes}>
          <view ref={mergedRef} className={clsx(classes.root, className)} {...nativeProps}>
            {children}
          </view>
        </ClassNamesProvider>
      </TextFieldContext.Provider>
    );
  },
);
TextFieldRoot.displayName = "TextFieldRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldPrefixIconProps extends InternalIconProps {}

export const TextFieldPrefixIcon = React.forwardRef<unknown, TextFieldPrefixIconProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { className, ...otherProps } = props;

    return (
      <InternalIcon ref={ref} className={clsx(classes.prefixIcon, className)} {...otherProps} />
    );
  },
);
TextFieldPrefixIcon.displayName = "TextFieldPrefixIcon";

export interface TextFieldPrefixTextProps extends LynxStyledElementProps {}

export const TextFieldPrefixText = React.forwardRef<unknown, TextFieldPrefixTextProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.prefixText, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
TextFieldPrefixText.displayName = "TextFieldPrefixText";

export interface TextFieldSuffixIconProps extends InternalIconProps {}

export const TextFieldSuffixIcon = React.forwardRef<unknown, TextFieldSuffixIconProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { className, ...otherProps } = props;

    return (
      <InternalIcon ref={ref} className={clsx(classes.suffixIcon, className)} {...otherProps} />
    );
  },
);
TextFieldSuffixIcon.displayName = "TextFieldSuffixIcon";

export interface TextFieldSuffixTextProps extends LynxStyledElementProps {}

export const TextFieldSuffixText = React.forwardRef<unknown, TextFieldSuffixTextProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.suffixText, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
TextFieldSuffixText.displayName = "TextFieldSuffixText";

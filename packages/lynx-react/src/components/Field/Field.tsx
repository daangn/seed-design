import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { field, type FieldVariantProps } from "@seed-design/lynx-css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/lynx-css/recipes/field-label";
import clsx from "clsx";

import type { LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { FieldContext, useFieldContext } from "./context";

const { ClassNamesProvider: FieldClassNamesProvider, useClassNames: useFieldClassNames } =
  createSlotRecipeContext(field);
const { ClassNamesProvider: FieldLabelClassNamesProvider, useClassNames: useFieldLabelClassNames } =
  createSlotRecipeContext(fieldLabel);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HTML label의 `for` 연결과 native form의 `name` 제출 모델
 * - DOM ARIA id 연결. 입력 컴포넌트에서 `accessibility-label`을 사용해야 함
 */
export interface FieldRootProps extends Omit<FieldVariantProps, "empty">, LynxStyledElementProps {
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export const FieldRoot = React.forwardRef<NodesRef, FieldRootProps>((props, forwardedRef) => {
  const [variantProps, otherProps] = field.splitVariantProps(props);
  const {
    children,
    className,
    required = false,
    disabled = false,
    readOnly = false,
    ...nativeProps
  } = otherProps;
  const invalid = variantProps.invalid ?? false;
  const [focused, setFocused] = React.useState(false);
  const rootRef = React.useRef<NodesRef | null>(null);
  const classes = field({ invalid });

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
    [disabled, focused, invalid, readOnly, required],
  );

  return (
    <FieldContext.Provider value={contextValue}>
      <FieldClassNamesProvider value={classes}>
        <view ref={mergedRef} className={clsx(classes.root, className)} {...nativeProps}>
          {children}
        </view>
      </FieldClassNamesProvider>
    </FieldContext.Provider>
  );
});
FieldRoot.displayName = "FieldRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldHeaderProps extends LynxStyledElementProps {}

export const FieldHeader = React.forwardRef<unknown, FieldHeaderProps>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.header, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
FieldHeader.displayName = "FieldHeader";

export interface FieldLabelProps extends FieldLabelVariantProps, LynxStyledElementProps {}

export const FieldLabel = React.forwardRef<unknown, FieldLabelProps>((props, ref) => {
  const [variantProps, otherProps] = fieldLabel.splitVariantProps(props);
  const { children, className, ...nativeProps } = otherProps;
  const classes = fieldLabel(variantProps);

  return (
    <FieldLabelClassNamesProvider value={classes}>
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </text>
    </FieldLabelClassNamesProvider>
  );
});
FieldLabel.displayName = "FieldLabel";

export interface FieldIndicatorTextProps extends LynxStyledElementProps {}

export const FieldIndicatorText = React.forwardRef<unknown, FieldIndicatorTextProps>(
  (props, ref) => {
    const classes = useFieldLabelClassNames();
    const { children, className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.indicatorText, className)}
        {...nativeProps}
      >
        {"\u00a0"}
        {children}
      </text>
    );
  },
);
FieldIndicatorText.displayName = "FieldIndicatorText";

export interface FieldRequiredIndicatorProps extends LynxStyledElementProps {}

export const FieldRequiredIndicator = React.forwardRef<unknown, FieldRequiredIndicatorProps>(
  (props, ref) => {
    const classes = useFieldLabelClassNames();
    const { children = "*", className, ...nativeProps } = props;

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        accessibility-elements-hidden={true}
        className={clsx(classes.indicatorIcon, className)}
        {...nativeProps}
      >
        {"\u200a"}
        {children}
      </text>
    );
  },
);
FieldRequiredIndicator.displayName = "FieldRequiredIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldFooterProps extends LynxStyledElementProps {}

export const FieldFooter = React.forwardRef<unknown, FieldFooterProps>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.footer, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
FieldFooter.displayName = "FieldFooter";

export interface FieldDescriptionProps extends LynxStyledElementProps {}

export const FieldDescription = React.forwardRef<unknown, FieldDescriptionProps>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.description, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorMessageProps extends LynxStyledElementProps {}

export const FieldErrorMessage = React.forwardRef<unknown, FieldErrorMessageProps>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.errorMessage, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
FieldErrorMessage.displayName = "FieldErrorMessage";

////////////////////////////////////////////////////////////////////////////////////

export interface FieldCharacterCountProps extends LynxStyledElementProps {
  /** 현재 문자 또는 grapheme 수 */
  current: number;
  /** 허용하는 최대 문자 또는 grapheme 수 */
  max: number;
}

export const FieldCharacterCount = React.forwardRef<unknown, FieldCharacterCountProps>(
  (props, ref) => {
    const { current, max, children: _children, className, ...nativeProps } = props;
    const context = useFieldContext({ strict: true });
    const classes = field({ invalid: context.invalid, empty: current === 0 });

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.characterCountArea, className)}
        {...nativeProps}
      >
        <text className={classes.characterCount}>{current}</text>
        <text className={classes.maxCharacterCount}>/{max}</text>
      </view>
    );
  },
);
FieldCharacterCount.displayName = "FieldCharacterCount";

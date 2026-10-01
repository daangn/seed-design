import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { field } from "@seed-design/lynx-css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/lynx-css/recipes/field-label";
import {
  FieldDescription as HeadlessFieldDescription,
  FieldErrorMessage as HeadlessFieldErrorMessage,
  FieldLabel as HeadlessFieldLabel,
  FieldRoot as HeadlessFieldRoot,
  useFieldContext,
  type UseFieldProps,
} from "@seed-design/lynx-react-field";
import clsx from "clsx";

import type { LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider: FieldClassNamesProvider, useClassNames: useFieldClassNames } =
  createSlotRecipeContext(field);
const { ClassNamesProvider: FieldLabelClassNamesProvider, useClassNames: useFieldLabelClassNames } =
  createSlotRecipeContext(fieldLabel);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-field`의 상태·native root 위에 SEED recipe와 안내 slot 표현을 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - HTML label의 `for` 연결과 native form의 `name` 제출 모델
 * - DOM ARIA id 연결. 입력 컴포넌트에서 `accessibility-label`을 사용해야 함
 */
export interface FieldRootProps extends UseFieldProps, LynxStyledElementProps {}

export const FieldRoot = React.forwardRef<NodesRef, FieldRootProps>((props, ref) => {
  const { children, className, invalid = false, ...otherProps } = props;
  const classes = field({ invalid });

  return (
    <HeadlessFieldRoot
      ref={ref}
      invalid={invalid}
      {...otherProps}
      className={clsx(classes.root, className)}
    >
      <FieldClassNamesProvider value={classes}>{children}</FieldClassNamesProvider>
    </HeadlessFieldRoot>
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
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.header, className)}
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
      <HeadlessFieldLabel ref={ref} {...nativeProps} className={clsx(classes.root, className)}>
        {children}
      </HeadlessFieldLabel>
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
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classes.indicatorText, className)}
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
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        accessibility-elements-hidden={true}
        className={clsx(classes.indicatorIcon, className)}
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
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.footer, className)}
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
    <HeadlessFieldDescription
      ref={ref}
      {...nativeProps}
      className={clsx(classes.description, className)}
    >
      {children}
    </HeadlessFieldDescription>
  );
});
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorMessageProps extends LynxStyledElementProps {}

export const FieldErrorMessage = React.forwardRef<unknown, FieldErrorMessageProps>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <HeadlessFieldErrorMessage
      ref={ref}
      {...nativeProps}
      className={clsx(classes.errorMessage, className)}
    >
      {children}
    </HeadlessFieldErrorMessage>
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
    const context = useFieldContext();
    const classes = field({ invalid: context.invalid, empty: current === 0 });

    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.characterCountArea, className)}
      >
        <text className={classes.characterCount}>{current}</text>
        <text className={classes.maxCharacterCount}>/{max}</text>
      </view>
    );
  },
);
FieldCharacterCount.displayName = "FieldCharacterCount";

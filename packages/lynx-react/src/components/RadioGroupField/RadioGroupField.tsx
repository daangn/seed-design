import * as React from "@lynx-js/react";
import { field } from "@seed-design/lynx-css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/lynx-css/recipes/field-label";
import {
  RadioGroupDescription as HeadlessRadioGroupDescription,
  RadioGroupErrorMessage as HeadlessRadioGroupErrorMessage,
  RadioGroupLabel as HeadlessRadioGroupLabel,
  RadioGroupRoot as HeadlessRadioGroupRoot,
  type UseRadioGroupProps,
} from "@seed-design/lynx-react-radio-group";
import clsx from "clsx";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
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
 * `@seed-design/lynx-react-radio-group`의 선택 상태·Root 접근성 위에 Field recipe의 label·안내 slot을 조립한다.
 * Item 배치는 안에 둔 `RadioGroup.Root`가 맡는다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / form: Lynx에 native form 제출 모델이 없음
 * - DOM ARIA id 연결. Root에 `accessibility-label`을 지정해야 함
 */
export interface RadioGroupFieldRootProps
  extends UseRadioGroupProps,
    LynxStyledElementProps,
    Omit<LynxAccessibilityProps, keyof UseRadioGroupProps> {}

export const RadioGroupFieldRoot = React.forwardRef<unknown, RadioGroupFieldRootProps>(
  (props, ref) => {
    const { children, className, invalid = false, ...otherProps } = props;
    const classes = field({ invalid });

    return (
      <HeadlessRadioGroupRoot
        ref={ref}
        invalid={invalid}
        {...otherProps}
        className={clsx(classes.root, className)}
      >
        <FieldClassNamesProvider value={classes}>{children}</FieldClassNamesProvider>
      </HeadlessRadioGroupRoot>
    );
  },
);
RadioGroupFieldRoot.displayName = "RadioGroupFieldRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupFieldHeaderProps extends LynxStyledElementProps {}

export const RadioGroupFieldHeader = React.forwardRef<unknown, RadioGroupFieldHeaderProps>(
  (props, ref) => {
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
  },
);
RadioGroupFieldHeader.displayName = "RadioGroupFieldHeader";

export interface RadioGroupFieldLabelProps extends FieldLabelVariantProps, LynxStyledElementProps {}

export const RadioGroupFieldLabel = React.forwardRef<unknown, RadioGroupFieldLabelProps>(
  (props, ref) => {
    const [variantProps, otherProps] = fieldLabel.splitVariantProps(props);
    const { children, className, ...nativeProps } = otherProps;
    const classes = fieldLabel(variantProps);

    return (
      <FieldLabelClassNamesProvider value={classes}>
        <HeadlessRadioGroupLabel
          ref={ref}
          {...nativeProps}
          className={clsx(classes.root, className)}
        >
          {children}
        </HeadlessRadioGroupLabel>
      </FieldLabelClassNamesProvider>
    );
  },
);
RadioGroupFieldLabel.displayName = "RadioGroupFieldLabel";

export interface RadioGroupFieldIndicatorTextProps extends LynxStyledElementProps {}

export const RadioGroupFieldIndicatorText = React.forwardRef<
  unknown,
  RadioGroupFieldIndicatorTextProps
>((props, ref) => {
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
});
RadioGroupFieldIndicatorText.displayName = "RadioGroupFieldIndicatorText";

export interface RadioGroupFieldRequiredIndicatorProps extends LynxStyledElementProps {}

export const RadioGroupFieldRequiredIndicator = React.forwardRef<
  unknown,
  RadioGroupFieldRequiredIndicatorProps
>((props, ref) => {
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
});
RadioGroupFieldRequiredIndicator.displayName = "RadioGroupFieldRequiredIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupFieldFooterProps extends LynxStyledElementProps {}

export const RadioGroupFieldFooter = React.forwardRef<unknown, RadioGroupFieldFooterProps>(
  (props, ref) => {
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
  },
);
RadioGroupFieldFooter.displayName = "RadioGroupFieldFooter";

export interface RadioGroupFieldDescriptionProps extends LynxStyledElementProps {}

export const RadioGroupFieldDescription = React.forwardRef<
  unknown,
  RadioGroupFieldDescriptionProps
>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <HeadlessRadioGroupDescription
      ref={ref}
      {...nativeProps}
      className={clsx(classes.description, className)}
    >
      {children}
    </HeadlessRadioGroupDescription>
  );
});
RadioGroupFieldDescription.displayName = "RadioGroupFieldDescription";

export interface RadioGroupFieldErrorMessageProps extends LynxStyledElementProps {}

export const RadioGroupFieldErrorMessage = React.forwardRef<
  unknown,
  RadioGroupFieldErrorMessageProps
>((props, ref) => {
  const classes = useFieldClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <HeadlessRadioGroupErrorMessage
      ref={ref}
      {...nativeProps}
      className={clsx(classes.errorMessage, className)}
    >
      {children}
    </HeadlessRadioGroupErrorMessage>
  );
});
RadioGroupFieldErrorMessage.displayName = "RadioGroupFieldErrorMessage";

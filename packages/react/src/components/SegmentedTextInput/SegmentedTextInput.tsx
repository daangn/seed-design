import { composeRefs } from "@radix-ui/react-compose-refs";
import {
  segmentedTextInput,
  type SegmentedTextInputVariantProps,
} from "@seed-design/css/recipes/segmented-text-input";
import { mergeProps } from "@seed-design/dom-utils";
import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  SegmentedTextInput as SegmentedTextInputPrimitive,
  useSegmentedTextInputContext,
  useSegmentedTextInputSegment,
} from "@seed-design/react-segmented-text-input";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(segmentedTextInput);

const withStateProps = createWithStateProps([useSegmentedTextInputContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface SegmentedTextInputRootProps
  extends SegmentedTextInputVariantProps,
    SegmentedTextInputPrimitive.RootProps {}

const FieldAwareRoot = forwardRef<HTMLDivElement, SegmentedTextInputPrimitive.RootProps>(
  ({ disabled, readOnly, invalid, required, ...otherProps }, ref) => {
    const fieldContext = useFieldContext({ strict: false });

    return (
      <SegmentedTextInputPrimitive.Root
        ref={ref}
        // Field label이 group 전체의 이름이 된다.
        aria-labelledby={fieldContext?.inputAriaAttributes["aria-labelledby"]}
        disabled={disabled || fieldContext?.inputProps.disabled}
        readOnly={readOnly || fieldContext?.inputProps.readOnly}
        invalid={invalid || fieldContext?.invalid}
        required={required || fieldContext?.required}
        {...otherProps}
      />
    );
  },
);
FieldAwareRoot.displayName = "SegmentedTextInputRoot";

export const SegmentedTextInputRoot = withProvider<HTMLDivElement, SegmentedTextInputRootProps>(
  FieldAwareRoot,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

interface SegmentLayoutProps {
  /**
   * `fill`이면 남은 공간을 나눠 가진다.
   * @default "fit"
   */
  sizing?: "fit" | "fill";
  /**
   * Segment 안의 입력과 정적 텍스트 묶음을 정렬한다. 입력 안의 텍스트 정렬이 아니다.
   * @default "start"
   */
  align?: "start" | "center";
}

export interface SegmentedTextInputInputSegmentProps
  extends SegmentLayoutProps,
    SegmentedTextInputPrimitive.SegmentProps {
  /**
   * 입력 앞에 고정으로 표시하는 텍스트. 보조기기에서 읽지 않는다.
   */
  staticPrefix?: string;
  /**
   * 입력 뒤에 고정으로 표시하는 텍스트(예: 주민등록번호 뒷자리 불릿 `"••••••"`). 보조기기에서 읽지 않는다.
   */
  staticSuffix?: string;
  staticText?: never;
}

export interface SegmentedTextInputStaticSegmentProps
  extends SegmentLayoutProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Segment 전체를 입력 없이 정적 텍스트로 표시한다. 값 배열에 포함하지 않으며 보조기기에서 읽지 않는다.
   */
  staticText: string;
}

export type SegmentedTextInputSegmentProps =
  | SegmentedTextInputInputSegmentProps
  | SegmentedTextInputStaticSegmentProps;

const SegmentedTextInputStaticSegment = forwardRef<
  HTMLSpanElement,
  SegmentedTextInputStaticSegmentProps
>(({ staticText, sizing = "fit", align = "start", className, ...otherProps }, ref) => {
  const classNames = useClassNames();

  return (
    <span className={classNames.segment} data-sizing={sizing} data-align={align}>
      <SegmentedTextInputPrimitive.StaticText
        ref={ref}
        {...otherProps}
        className={clsx(classNames.staticText, className)}
      >
        {staticText}
      </SegmentedTextInputPrimitive.StaticText>
    </span>
  );
});

const SegmentedTextInputInputSegment = forwardRef<
  HTMLInputElement,
  SegmentedTextInputInputSegmentProps
>(
  (
    {
      length,
      masked,
      inputMode,
      autoComplete,
      normalize,
      sizing = "fit",
      align = "start",
      staticPrefix,
      staticSuffix,
      className,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = useClassNames();
    const fieldContext = useFieldContext({ strict: false });
    const { index, inputRef, inputProps } = useSegmentedTextInputSegment({
      length,
      masked,
      inputMode,
      autoComplete,
      normalize,
    });

    const mergedProps = mergeProps(
      inputProps,
      fieldContext
        ? {
            "aria-describedby": fieldContext.inputAriaAttributes["aria-describedby"],
            // Field label을 누르면 첫 입력 Segment로 이동한다.
            ...(index === 0 && { id: fieldContext.inputProps.id }),
          }
        : {},
      otherProps,
    );

    return (
      <span className={classNames.segment} data-sizing={sizing} data-align={align}>
        {staticPrefix && (
          <SegmentedTextInputPrimitive.StaticText className={classNames.staticText}>
            {staticPrefix}
          </SegmentedTextInputPrimitive.StaticText>
        )}
        <span className={classNames.valueContainer} data-sizing={sizing} data-align={align}>
          {/* 입력 너비를 자리 수만큼의 숫자·불릿 글자 너비로 맞춘다. */}
          <span className={classNames.valueSizer} aria-hidden>
            {(masked ? "•" : "0").repeat(length)}
          </span>
          <Primitive.input
            ref={composeRefs(inputRef, ref)}
            {...mergedProps}
            className={clsx(classNames.value, className)}
          />
        </span>
        {staticSuffix && (
          <SegmentedTextInputPrimitive.StaticText className={classNames.staticText}>
            {staticSuffix}
          </SegmentedTextInputPrimitive.StaticText>
        )}
      </span>
    );
  },
);

export const SegmentedTextInputSegment = forwardRef<
  HTMLInputElement | HTMLSpanElement,
  SegmentedTextInputSegmentProps
>((props, ref) => {
  if (props.staticText !== undefined) {
    return (
      <SegmentedTextInputStaticSegment
        ref={ref as React.Ref<HTMLSpanElement>}
        {...(props as SegmentedTextInputStaticSegmentProps)}
      />
    );
  }

  return (
    <SegmentedTextInputInputSegment
      ref={ref as React.Ref<HTMLInputElement>}
      {...(props as SegmentedTextInputInputSegmentProps)}
    />
  );
});
SegmentedTextInputSegment.displayName = "SegmentedTextInputSegment";

////////////////////////////////////////////////////////////////////////////////////

export interface SegmentedTextInputSeparatorProps
  extends SegmentedTextInputPrimitive.SeparatorProps {}

export const SegmentedTextInputSeparator = withContext<
  HTMLSpanElement,
  SegmentedTextInputSeparatorProps
>(SegmentedTextInputPrimitive.Separator, "separator");

export interface SegmentedTextInputSuffixProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * 카드사 로고처럼 입력 끝에 붙는 부가 요소. 세로 가운데에 두고 오른쪽 끝에 붙인다. 크기는 내용이 정한다.
 */
export const SegmentedTextInputSuffix = withContext<HTMLDivElement, SegmentedTextInputSuffixProps>(
  withStateProps(Primitive.div),
  "suffix",
);

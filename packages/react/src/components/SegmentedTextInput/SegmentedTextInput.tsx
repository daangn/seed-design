import { composeRefs } from "@radix-ui/react-compose-refs";
import {
  segmentedTextInput,
  type SegmentedTextInputVariantProps,
} from "@seed-design/css/recipes/segmented-text-input";
import { dataAttr, mergeProps } from "@seed-design/dom-utils";
import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  SegmentedTextInput as SegmentedTextInputPrimitive,
  useSegmentedTextInputContext,
  useSegmentedTextInputSegment,
} from "@seed-design/react-segmented-text-input";
import clsx from "clsx";
import type * as React from "react";
import { Fragment, forwardRef, useState } from "react";
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
    Omit<SegmentedTextInputPrimitive.SegmentProps, "placeholder"> {
  /**
   * 빈 Segment에 표시하는 내용. 문자열이 아니면(예: `<SegmentedTextInput.Dots count={1} />`) 입력 위에 겹쳐 그린다.
   * masked Segment는 빈 자리를 점으로 그리므로 쓰지 않는다.
   */
  placeholder?: React.ReactNode;
  /**
   * 입력 앞에 고정으로 표시하는 내용. 보조기기에서 읽지 않는다.
   */
  staticPrefix?: React.ReactNode;
  /**
   * 입력 뒤에 고정으로 표시하는 내용(예: 주민등록번호 뒷자리 `<SegmentedTextInput.Dots count={6} />`). 보조기기에서 읽지 않는다.
   */
  staticSuffix?: React.ReactNode;
  staticText?: never;
}

export interface SegmentedTextInputStaticSegmentProps
  extends SegmentLayoutProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Segment 전체를 입력 없이 정적 내용으로 표시한다. 값 배열에 포함하지 않으며 보조기기에서 읽지 않는다.
   */
  staticText: React.ReactNode;
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
      placeholder,
      staticPrefix,
      staticSuffix,
      className,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = useClassNames();
    const fieldContext = useFieldContext({ strict: false });
    const ctx = useSegmentedTextInputContext();
    const [focused, setFocused] = useState(false);
    const { index, value, inputRef, inputProps } = useSegmentedTextInputSegment({
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
      {
        placeholder: !masked && typeof placeholder === "string" ? placeholder : undefined,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
      },
      otherProps,
    );

    const disabled = ctx.disabled || !!otherProps.disabled;
    const readOnly = ctx.readOnly || !!otherProps.readOnly;

    const showPlaceholderOverlay =
      !masked && placeholder != null && typeof placeholder !== "string" && value === "";

    return (
      <span className={classNames.segment} data-sizing={sizing} data-align={align}>
        {staticPrefix && (
          <SegmentedTextInputPrimitive.StaticText
            className={classNames.staticText}
            data-position="prefix"
          >
            {staticPrefix}
          </SegmentedTextInputPrimitive.StaticText>
        )}
        <span className={classNames.valueContainer} data-sizing={sizing} data-align={align}>
          {masked ? (
            // 입력 글자 대신 자리 수만큼 점을 그린다. 채운 자리는 진하게, caret은 마지막 글자 뒤에 둔다.
            <span
              className={classNames.dots}
              data-masked=""
              data-disabled={dataAttr(disabled)}
              aria-hidden
            >
              {Array.from({ length }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 점은 자리 순서 외에 구분할 값이 없다.
                <Fragment key={i}>
                  {i === value.length && <MaskedCaret focused={focused} readOnly={readOnly} />}
                  <span
                    className={classNames.dot}
                    data-filled={dataAttr(i < value.length)}
                    data-disabled={dataAttr(disabled)}
                  />
                </Fragment>
              ))}
              {value.length >= length && <MaskedCaret focused={focused} readOnly={readOnly} />}
            </span>
          ) : (
            // 입력 너비를 자리 수만큼의 숫자 글자 너비로 맞춘다.
            <span className={classNames.valueSizer} aria-hidden>
              {"0".repeat(length)}
            </span>
          )}
          {showPlaceholderOverlay && (
            <span className={classNames.placeholder} data-disabled={dataAttr(disabled)} aria-hidden>
              {placeholder}
            </span>
          )}
          <Primitive.input
            ref={composeRefs(inputRef, ref)}
            {...mergedProps}
            className={clsx(classNames.value, className)}
          />
        </span>
        {staticSuffix && (
          <SegmentedTextInputPrimitive.StaticText
            className={classNames.staticText}
            data-position="suffix"
          >
            {staticSuffix}
          </SegmentedTextInputPrimitive.StaticText>
        )}
      </span>
    );
  },
);

function MaskedCaret({ focused, readOnly }: { focused: boolean; readOnly: boolean }) {
  const classNames = useClassNames();

  return (
    <span
      className={classNames.caret}
      data-focus={dataAttr(focused)}
      data-readonly={dataAttr(readOnly)}
    />
  );
}

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

export interface SegmentedTextInputDotsProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 점 개수.
   */
  count: number;
}

/**
 * 주민등록번호 뒷자리처럼 가린 자리를 점으로 표시한다. `staticText`·`staticPrefix`·`staticSuffix`·`placeholder`에 넣는다.
 * 보조기기에서 읽지 않는다.
 */
export const SegmentedTextInputDots = forwardRef<HTMLSpanElement, SegmentedTextInputDotsProps>(
  ({ count, className, ...otherProps }, ref) => {
    const classNames = useClassNames();

    return (
      <Primitive.span
        ref={ref}
        aria-hidden
        {...otherProps}
        className={clsx(classNames.dots, className)}
      >
        {Array.from({ length: count }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 점은 자리 순서 외에 구분할 값이 없다.
          <span key={i} className={classNames.dot} />
        ))}
      </Primitive.span>
    );
  },
);
SegmentedTextInputDots.displayName = "SegmentedTextInputDots";

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

import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  segmentedTextInput,
  type SegmentedTextInputVariantProps,
} from "@seed-design/lynx-css/recipes/segmented-text-input";
import {
  SegmentedTextInputProvider,
  useSegmentedTextInput,
  useSegmentedTextInputSegment,
  useSegmentedTextInputSegmentInput,
} from "@seed-design/lynx-react-segmented-text-input";
import { TextFieldProvider } from "@seed-design/lynx-react-text-field";
import clsx from "clsx";

import type { LynxHostProps } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(segmentedTextInput);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 값은 입력 Segment 순서대로 나열한 `string[]`이다. 정적 Segment는 포함하지 않는다.
 * Segment의 순서는 처음 렌더링한 순서다. 이미 렌더링한 Segment 사이에 새 Segment를 조건부로 넣으면
 * 끝에 붙은 것으로 취급하므로, 그 뒤 Segment에도 `key`를 바꿔 다시 렌더링한다.
 */
export interface SegmentedTextInputRootProps
  extends Omit<SegmentedTextInputVariantProps, "focused">,
    Omit<LynxHostProps<"view">, keyof SegmentedTextInputVariantProps | "children"> {
  children?: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따른다.
   * @default false
   */
  required?: boolean;
}

/**
 * `@seed-design/lynx-react-segmented-text-input`의 값·Segment 등록부·Field 상태 위에 SEED recipe와 stroke를 조립한다.
 */
export const SegmentedTextInputRoot = React.forwardRef<NodesRef, SegmentedTextInputRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = segmentedTextInput.splitVariantProps(props);
    const { children, className, value, defaultValue, onValueChange, required, ...nativeProps } =
      otherProps;
    const api = useSegmentedTextInput({
      value,
      defaultValue,
      onValueChange,
      required,
      disabled: variantProps.disabled,
      readOnly: variantProps.readOnly,
      invalid: variantProps.invalid,
    });
    const { rootRef } = api;
    const mergedRef = React.useMemo(
      () => mergeProps({ ref: rootRef }, { ref: forwardedRef }).ref,
      [rootRef, forwardedRef],
    );

    const classes = segmentedTextInput({
      size: variantProps.size ?? "large",
      disabled: api.disabled,
      readOnly: api.readOnly,
      invalid: api.invalid,
      focused: api.focused && !api.readOnly,
    });

    return (
      <SegmentedTextInputProvider value={api}>
        <ClassNamesProvider value={classes}>
          <view
            {...mergeProps({ ref: mergedRef }, nativeProps)}
            className={clsx(classes.root, className)}
          >
            <view className={classes.baseStroke} accessibility-elements-hidden={true} />
            <view className={classes.stroke} accessibility-elements-hidden={true} />
            {children}
          </view>
        </ClassNamesProvider>
      </SegmentedTextInputProvider>
    );
  },
);
SegmentedTextInputRoot.displayName = "SegmentedTextInputRoot";

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

type NativeInputProps = LynxHostProps<"input">;

/**
 * @platform Lynx
 *
 * Segment마다 native `<input>` 하나를 렌더링한다. `readOnly`에서는 TextField처럼 `<text>`로 렌더링한다.
 *
 * React와의 차이:
 * - native 입력에 paste 이벤트가 없어, 한 번의 입력으로 두 글자 이상 늘어나면 붙여넣기·자동완성으로 보고
 *   현재 Segment부터 나눠 채운다.
 * - 빈 Segment에서 Backspace를 눌러도 native 입력 이벤트가 오지 않아 이전 Segment로 이동하지 않는다.
 *   방향키 이동도 없다.
 */
export interface SegmentedTextInputInputSegmentProps
  extends SegmentLayoutProps,
    Omit<
      NativeInputProps,
      "type" | "maxlength" | "default-value" | "readonly" | "disabled" | "placeholder"
    > {
  /**
   * 자리 수. 다 채운 Segment에서만 native `maxlength`로 추가 입력을 막고, 그 밖에는 붙여넣은 값이 잘리지 않도록 JS로 제한한다.
   */
  length: number;
  /**
   * 값을 가린다. native 입력의 글자는 숨기고 자리 수만큼 점을 그린다. caret은 항상 값 끝에 둔다.
   * @default false
   */
  masked?: boolean;
  /**
   * 생략하면 Root의 `readOnly`를 따른다. `true`이면 native 입력 대신 `<text>`를 렌더링하고,
   * 붙여넣기 분배가 이 Segment 앞에서 멈춘다. 외부 키패드로 값을 채울 때 `bindtap`과 함께 쓴다.
   */
  readOnly?: boolean;
  /**
   * @platform Lynx
   * native 입력의 키보드 종류.
   * @default "number"
   */
  type?: "number" | "digit" | "tel" | "text" | "email";
  /**
   * `"bday"`면 붙여넣은 날짜를 `length`에 맞춰 정규화한다(6 → `yyMMdd`, 8 → `yyyyMMdd`).
   * Lynx native 입력에는 자동완성 속성이 없어 native에는 전달하지 않는다.
   */
  autoComplete?: string;
  /**
   * 입력값을 정규화한다. 기본값은 `type`이 `"text"`·`"email"`이 아니면 숫자 외 문자를 지우고, 그 밖에는 그대로 둔다.
   */
  normalize?: (value: string) => string;
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
    Omit<LynxHostProps<"view">, "children"> {
  /**
   * Segment 전체를 입력 없이 정적 내용으로 표시한다. 값 배열에 포함하지 않으며 보조기기에서 읽지 않는다.
   */
  staticText: React.ReactNode;
}

export type SegmentedTextInputSegmentProps =
  | SegmentedTextInputInputSegmentProps
  | SegmentedTextInputStaticSegmentProps;

function getSegmentClassName(
  classes: ReturnType<typeof useClassNames>,
  sizing: SegmentLayoutProps["sizing"],
  align: SegmentLayoutProps["align"],
) {
  return clsx(
    classes.segment,
    sizing === "fill" && classes.segmentFill,
    align === "center" && classes.segmentCenter,
  );
}

type DotsTone = "static" | "placeholder";

// Lynx view에는 currentColor가 없어, Dots가 놓인 자리(정적 내용·placeholder)를 context로 알린다.
const DotsToneContext = React.createContext<DotsTone>("static");

/**
 * 정적 내용을 그린다. 문자열은 `<text>`로, 그 밖의 내용(예: Dots)은 세로 가운데에 둔 `<view>`로 감싼다.
 */
function StaticContent({
  children,
  position,
}: {
  children: React.ReactNode;
  position?: "prefix" | "suffix";
}) {
  const classes = useClassNames();

  if (typeof children === "string") {
    return (
      <text className={classes.staticText} accessibility-elements-hidden={true}>
        {children}
      </text>
    );
  }

  return (
    <view
      className={clsx(
        classes.staticContent,
        position === "prefix" && classes.staticPrefix,
        position === "suffix" && classes.staticSuffix,
      )}
      accessibility-elements-hidden={true}
    >
      {children}
    </view>
  );
}

const SegmentedTextInputStaticSegment = React.forwardRef<
  NodesRef,
  SegmentedTextInputStaticSegmentProps
>(({ staticText, sizing = "fit", align = "start", className, ...nativeProps }, ref) => {
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(getSegmentClassName(classes, sizing, align), className)}
    >
      <StaticContent>{staticText}</StaticContent>
    </view>
  );
});
SegmentedTextInputStaticSegment.displayName = "SegmentedTextInputStaticSegment";

const SegmentedTextInputInputSegment = React.forwardRef<
  NodesRef,
  SegmentedTextInputInputSegmentProps
>((props, ref) => {
  const { segmentKey, textField } = useSegmentedTextInputSegment({ length: props.length });

  return (
    <TextFieldProvider value={textField}>
      <SegmentedTextInputSegmentControl {...props} segmentKey={segmentKey} ref={ref} />
    </TextFieldProvider>
  );
});
SegmentedTextInputInputSegment.displayName = "SegmentedTextInputInputSegment";

const SegmentedTextInputSegmentControl = React.forwardRef<
  NodesRef,
  SegmentedTextInputInputSegmentProps & { segmentKey: object }
>(
  (
    {
      length,
      masked = false,
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
    const classes = useClassNames();
    const api = useSegmentedTextInputSegmentInput(
      {
        ...otherProps,
        length,
        masked,
        placeholder: !masked && typeof placeholder === "string" ? placeholder : undefined,
      },
      ref,
    );
    const { value, focused } = api;

    const isPlaceholder = value === "";
    const showPlaceholderOverlay =
      !masked && isPlaceholder && placeholder != null && typeof placeholder !== "string";

    return (
      <view className={getSegmentClassName(classes, sizing, align)}>
        {staticPrefix ? <StaticContent position="prefix">{staticPrefix}</StaticContent> : null}
        <view
          className={clsx(
            classes.valueContainer,
            sizing === "fill" && align === "start" && !staticSuffix && classes.valueContainerFill,
          )}
        >
          {masked ? (
            // 입력 글자 대신 자리 수만큼 점을 그린다. 채운 자리는 진하게, caret은 마지막 글자 뒤에 둔다.
            <view
              className={clsx(classes.dots, classes.maskedDots)}
              accessibility-elements-hidden={true}
            >
              {Array.from({ length }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 점은 자리 순서 외에 구분할 값이 없다.
                <React.Fragment key={i}>
                  {focused && !api.readOnly && i === value.length ? (
                    <view className={classes.caret} />
                  ) : null}
                  <view
                    className={clsx(
                      classes.dot,
                      i < value.length ? classes.filledDot : classes.maskedDot,
                    )}
                  />
                </React.Fragment>
              ))}
              {focused && !api.readOnly && value.length >= length ? (
                <view className={classes.caret} />
              ) : null}
            </view>
          ) : (
            // 입력 너비를 자리 수만큼의 숫자 글자 너비로 맞춘다.
            <text className={classes.valueSizer} accessibility-elements-hidden={true}>
              {"0".repeat(length)}
            </text>
          )}
          {showPlaceholderOverlay ? (
            <view
              className={clsx(
                classes.placeholder,
                staticSuffix ? classes.placeholderBeforeSuffix : undefined,
              )}
              accessibility-elements-hidden={true}
            >
              <DotsToneContext.Provider value="placeholder">{placeholder}</DotsToneContext.Provider>
            </view>
          ) : null}
          {api.readOnly ? (
            masked ? (
              <text
                {...api.readOnlyTextProps}
                className={clsx(classes.maskedReadOnlyText, className)}
              />
            ) : (
              <view className={classes.readOnlyValue}>
                <text
                  {...api.readOnlyTextProps}
                  className={clsx(
                    classes.readOnlyText,
                    isPlaceholder && classes.readOnlyPlaceholder,
                    className,
                  )}
                >
                  {isPlaceholder ? (typeof placeholder === "string" ? placeholder : "") : value}
                </text>
              </view>
            )
          ) : (
            <input
              {...api.inputProps}
              className={clsx(classes.value, masked && classes.maskedValue, className)}
            />
          )}
        </view>
        {staticSuffix ? <StaticContent position="suffix">{staticSuffix}</StaticContent> : null}
      </view>
    );
  },
);
SegmentedTextInputSegmentControl.displayName = "SegmentedTextInputSegmentControl";

export const SegmentedTextInputSegment = React.forwardRef<NodesRef, SegmentedTextInputSegmentProps>(
  (props, ref) => {
    if (props.staticText !== undefined) {
      return (
        <SegmentedTextInputStaticSegment
          ref={ref}
          {...(props as SegmentedTextInputStaticSegmentProps)}
        />
      );
    }

    return (
      <SegmentedTextInputInputSegment
        ref={ref}
        {...(props as SegmentedTextInputInputSegmentProps)}
      />
    );
  },
);
SegmentedTextInputSegment.displayName = "SegmentedTextInputSegment";

////////////////////////////////////////////////////////////////////////////////////

export interface SegmentedTextInputDotsProps extends Omit<LynxHostProps<"view">, "children"> {
  /**
   * 점 개수.
   */
  count: number;
}

/**
 * 주민등록번호 뒷자리처럼 가린 자리를 점으로 표시한다. `staticText`·`staticPrefix`·`staticSuffix`·`placeholder`에 넣는다.
 * 보조기기에서 읽지 않는다.
 */
export const SegmentedTextInputDots = React.forwardRef<NodesRef, SegmentedTextInputDotsProps>(
  ({ count, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    const tone = React.useContext(DotsToneContext);

    return (
      <view
        {...mergeProps(
          { ...(ref ? { ref } : {}), "accessibility-elements-hidden": true },
          nativeProps,
        )}
        className={clsx(classes.dots, className)}
      >
        {Array.from({ length: count }, (_, i) => (
          <view
            // biome-ignore lint/suspicious/noArrayIndexKey: 점은 자리 순서 외에 구분할 값이 없다.
            key={i}
            className={clsx(classes.dot, tone === "placeholder" && classes.placeholderDot)}
          />
        ))}
      </view>
    );
  },
);
SegmentedTextInputDots.displayName = "SegmentedTextInputDots";

export interface SegmentedTextInputSeparatorProps extends LynxHostProps<"text"> {}

/**
 * Segment 사이의 장식용 구분자. 보조기기에서 읽지 않는다.
 */
export const SegmentedTextInputSeparator = React.forwardRef<
  NodesRef,
  SegmentedTextInputSeparatorProps
>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...mergeProps(
        { ...(ref ? { ref } : {}), "accessibility-elements-hidden": true },
        nativeProps,
      )}
      className={clsx(classes.separator, className)}
    >
      {children}
    </text>
  );
});
SegmentedTextInputSeparator.displayName = "SegmentedTextInputSeparator";

export interface SegmentedTextInputSuffixProps extends LynxHostProps<"view"> {}

/**
 * 카드사 로고처럼 입력 끝에 붙는 부가 요소. 세로 가운데에 두고 오른쪽 끝에 붙인다. 크기는 내용이 정한다.
 */
export const SegmentedTextInputSuffix = React.forwardRef<NodesRef, SegmentedTextInputSuffixProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { children, className, ...nativeProps } = props;

    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.suffix, className)}
      >
        {children}
      </view>
    );
  },
);
SegmentedTextInputSuffix.displayName = "SegmentedTextInputSuffix";

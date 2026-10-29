import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  segmentedTextInput,
  type SegmentedTextInputVariantProps,
} from "@seed-design/lynx-css/recipes/segmented-text-input";
import { useFieldContext } from "@seed-design/lynx-react-field";
import {
  TextFieldProvider,
  useTextFieldInput,
  type TextFieldInputEvent,
  type TextFieldSelectionEvent,
  type UseTextFieldReturn,
} from "@seed-design/lynx-react-text-field";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import clsx from "clsx";

import type { LynxHostProps } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(segmentedTextInput);

const digitsOnly = (value: string) => value.replace(/\D/g, "");
const identity = (value: string) => value;

const SEPARATED_DATE = /^\s*(\d{4})\D+(\d{1,2})\D+(\d{1,2})\D*$/;
const COMPACT_DATE = /^\s*(\d{4})(\d{2})(\d{2})\s*$/;

/**
 * 붙여넣은 날짜(`yyyy-MM-dd`, `yyyy. MM. dd.`, `yyyyMMdd` 등)를 Segment 길이에 맞춘다.
 * length 6 → `yyMMdd`, 8 → `yyyyMMdd`. 날짜 형태가 아니면 null을 반환한다.
 */
function normalizeBirthDate(value: string, length: number) {
  if (length !== 6 && length !== 8) return null;

  const match = SEPARATED_DATE.exec(value) ?? COMPACT_DATE.exec(value);
  if (!match) return null;

  const [, year, month, day] = match as unknown as [string, string, string, string];
  const date = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;

  return length === 6 ? date.slice(2) : date;
}

////////////////////////////////////////////////////////////////////////////////////

interface SegmentEntry {
  length: number;
  masked: boolean;
  readOnly: boolean;
  focus: () => void;
}

interface SegmentedTextInputContextValue {
  rootRef: React.RefObject<NodesRef | null>;
  values: string[];
  focused: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  /** 입력 Segment의 값 위치를 정한다. 처음 렌더링한 순서대로 자리를 받는다. */
  claimSegment: (key: object) => number;
  releaseSegment: (key: object) => void;
  getSegmentIndex: (key: object) => number;
  updateSegment: (key: object, entry: SegmentEntry) => void;
  /** 여러 Segment의 값을 한 번에 바꾼다. key는 입력 Segment의 순서다. */
  setSegmentValues: (updates: Record<number, string>) => void;
  /** `startIndex` Segment부터 `text`를 차례로 채우고, 다 채운 Segment 다음으로 focus를 옮긴다. */
  distribute: (startIndex: number, text: string) => void;
  focusSegment: (index: number) => void;
  setSegmentFocused: (key: object, focused: boolean) => void;
}

const SegmentedTextInputContext = React.createContext<SegmentedTextInputContextValue | null>(null);

function useSegmentedTextInputContext() {
  const context = React.useContext(SegmentedTextInputContext);
  if (!context) {
    throw new Error("SegmentedTextInput parts must be used within SegmentedTextInputRoot.");
  }
  return context;
}

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

export const SegmentedTextInputRoot = React.forwardRef<NodesRef, SegmentedTextInputRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = segmentedTextInput.splitVariantProps(props);
    const {
      children,
      className,
      value,
      defaultValue,
      onValueChange,
      required: requiredProp,
      ...nativeProps
    } = otherProps;
    const fieldContext = useFieldContext({ strict: false });
    const required = requiredProp ?? fieldContext?.required ?? false;
    const disabled = variantProps.disabled ?? fieldContext?.disabled ?? false;
    const readOnly = variantProps.readOnly ?? fieldContext?.readOnly ?? false;
    const invalid = variantProps.invalid ?? fieldContext?.invalid ?? false;

    const [values, setValues] = useControllableState<string[]>({
      value,
      defaultValue: defaultValue ?? [],
      onChange: onValueChange,
    });
    const valuesRef = React.useRef(values);
    valuesRef.current = values;

    const rootRef = React.useRef<NodesRef | null>(null);
    const mergedRef = React.useMemo(
      () => mergeProps({ ref: rootRef }, { ref: forwardedRef }).ref,
      [forwardedRef],
    );

    const orderRef = React.useRef<object[]>([]);
    const entriesRef = React.useRef(new Map<object, SegmentEntry>());
    const [, invalidateOrder] = React.useReducer((version: number) => version + 1, 0);

    const claimSegment = React.useCallback((key: object) => {
      const order = orderRef.current;
      if (!order.includes(key)) order.push(key);
      return order.indexOf(key);
    }, []);

    const releaseSegment = React.useCallback((key: object) => {
      orderRef.current = orderRef.current.filter((segmentKey) => segmentKey !== key);
      entriesRef.current.delete(key);
      invalidateOrder();
    }, []);

    const getSegmentIndex = React.useCallback((key: object) => orderRef.current.indexOf(key), []);

    const updateSegment = React.useCallback((key: object, entry: SegmentEntry) => {
      entriesRef.current.set(key, entry);
    }, []);

    const setSegmentValues = React.useCallback(
      (updates: Record<number, string>) => {
        "background only";

        const current = valuesRef.current;
        const count = Math.max(orderRef.current.length, current.length);
        const next = Array.from({ length: count }, (_, i) => updates[i] ?? current[i] ?? "");
        if (next.every((segmentValue, i) => segmentValue === current[i])) return;

        valuesRef.current = next;
        setValues(next);
      },
      [setValues],
    );

    const focusSegment = React.useCallback((index: number) => {
      "background only";

      const key = orderRef.current[index];
      if (key) entriesRef.current.get(key)?.focus();
    }, []);

    const distribute = React.useCallback(
      (startIndex: number, text: string) => {
        "background only";

        const order = orderRef.current;
        const updates: Record<number, string> = {};
        let rest = text;
        let focusIndex = startIndex;

        for (let i = startIndex; i < order.length; i++) {
          const entry = entriesRef.current.get(order[i] as object);
          if (!entry) break;

          const chunk = rest.slice(0, entry.length);
          rest = rest.slice(entry.length);
          updates[i] = chunk;

          const next = entriesRef.current.get(order[i + 1] as object);
          const isFull = chunk.length === entry.length;
          focusIndex = isFull && next ? i + 1 : i;

          // masked·readOnly Segment는 붙여넣기로 채우지 않는다.
          if (!isFull || rest === "" || !next || next.masked || next.readOnly) break;
        }

        setSegmentValues(updates);
        if (focusIndex !== startIndex) focusSegment(focusIndex);
      },
      [focusSegment, setSegmentValues],
    );

    // Segment 사이로 focus가 옮겨 갈 때 blur와 focus가 따로 와도 focus 상태가 깜빡이지 않게 한다.
    const focusedKeysRef = React.useRef(new Set<object>());
    const [focused, setFocused] = React.useState(false);
    const fieldSetFocusedRef = React.useRef(fieldContext?.setFocused);
    fieldSetFocusedRef.current = fieldContext?.setFocused;
    const setSegmentFocused = React.useCallback((key: object, segmentFocused: boolean) => {
      "background only";

      if (segmentFocused) {
        focusedKeysRef.current.add(key);
        setFocused(true);
        fieldSetFocusedRef.current?.(true);
        return;
      }

      focusedKeysRef.current.delete(key);
      setTimeout(() => {
        "background only";
        if (focusedKeysRef.current.size > 0) return;
        setFocused(false);
        fieldSetFocusedRef.current?.(false);
      }, 0);
    }, []);

    const classes = segmentedTextInput({
      size: variantProps.size ?? "large",
      disabled,
      readOnly,
      invalid,
      focused: focused && !readOnly,
    });

    const context = React.useMemo<SegmentedTextInputContextValue>(
      () => ({
        rootRef,
        values,
        focused,
        required,
        disabled,
        readOnly,
        invalid,
        claimSegment,
        releaseSegment,
        getSegmentIndex,
        updateSegment,
        setSegmentValues,
        distribute,
        focusSegment,
        setSegmentFocused,
      }),
      [
        values,
        focused,
        required,
        disabled,
        readOnly,
        invalid,
        claimSegment,
        releaseSegment,
        getSegmentIndex,
        updateSegment,
        setSegmentValues,
        distribute,
        focusSegment,
        setSegmentFocused,
      ],
    );

    return (
      <SegmentedTextInputContext.Provider value={context}>
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
      </SegmentedTextInputContext.Provider>
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

const noop = () => {};

// `useTextFieldInput`이 무제한 `maxlength`로 쓰는 32비트 센티널과 같은 값.
const NATIVE_TEXT_MAX_LENGTH_UNLIMITED = 2_147_483_647;

const SegmentedTextInputInputSegment = React.forwardRef<
  NodesRef,
  SegmentedTextInputInputSegmentProps
>((props, ref) => {
  const ctx = useSegmentedTextInputContext();
  const [key] = React.useState(() => ({}));
  const index = ctx.claimSegment(key);
  const value = ctx.values[index] ?? "";

  const { releaseSegment, setSegmentFocused } = ctx;
  React.useEffect(() => () => releaseSegment(key), [releaseSegment, key]);

  const setFocused = React.useCallback(
    (segmentFocused: boolean) => setSegmentFocused(key, segmentFocused),
    [setSegmentFocused, key],
  );

  // 값·focus는 Root가 소유한다. Segment는 항상 controlled로 두어,
  // Root가 반영하지 않은 입력(자리 수 초과·숫자 외 문자)을 native 입력에서 되돌린다.
  // 다 채운 Segment는 native `maxlength`로 추가 입력을 막아 글자가 잠깐 보였다 사라지지 않게 한다.
  // 범위 선택 교체·조합 중에는 TextField가 제한을 풀어, 붙여넣기는 그대로 bindinput으로 받는다.
  const nativeInsertionMaxLength =
    value.length >= props.length ? value.length : NATIVE_TEXT_MAX_LENGTH_UNLIMITED;
  const textFieldContext = React.useMemo<UseTextFieldReturn>(
    () => ({
      rootRef: ctx.rootRef,
      value,
      controlled: true,
      nativeInsertionMaxLength,
      required: ctx.required,
      disabled: ctx.disabled,
      readOnly: ctx.readOnly,
      invalid: ctx.invalid,
      focused: ctx.focused,
      setValue: noop,
      setFocused,
    }),
    [
      ctx.rootRef,
      value,
      nativeInsertionMaxLength,
      ctx.required,
      ctx.disabled,
      ctx.readOnly,
      ctx.invalid,
      ctx.focused,
      setFocused,
    ],
  );

  return (
    <TextFieldProvider value={textFieldContext}>
      <SegmentedTextInputSegmentControl {...props} segmentKey={key} ref={ref} />
    </TextFieldProvider>
  );
});
SegmentedTextInputInputSegment.displayName = "SegmentedTextInputInputSegment";

interface InputSnapshot {
  start: number;
  end: number;
}

interface InputState extends InputSnapshot {
  value: string;
}

const SegmentedTextInputSegmentControl = React.forwardRef<
  NodesRef,
  SegmentedTextInputInputSegmentProps & { segmentKey: object }
>(
  (
    {
      segmentKey,
      length,
      masked = false,
      type = "number",
      autoComplete,
      normalize: normalizeProp,
      sizing = "fit",
      align = "start",
      placeholder,
      staticPrefix,
      staticSuffix,
      readOnly,
      className,
      bindinput,
      bindselection,
      bindfocus,
      bindblur,
      ...otherProps
    },
    ref,
  ) => {
    const ctx = useSegmentedTextInputContext();
    const classes = useClassNames();
    const index = ctx.getSegmentIndex(segmentKey);
    const value = ctx.values[index] ?? "";
    const normalize =
      normalizeProp ?? (type === "text" || type === "email" ? identity : digitsOnly);
    const isBirthDate = autoComplete?.split(/\s+/).includes("bday") ?? false;

    const latest = React.useRef({ index, value, length, normalize, isBirthDate, masked });
    latest.current = { index, value, length, normalize, isBirthDate, masked };
    const nativeRef = React.useRef<NodesRef | null>(null);
    const mergedRef = React.useMemo(
      () => mergeProps({ ref: nativeRef }, ref ? { ref } : {}).ref,
      [ref],
    );
    // native 입력에 남을 값의 길이. masked Segment의 caret을 끝에 고정할 때 쓴다.
    const nativeLengthRef = React.useRef(value.length);
    nativeLengthRef.current = value.length;
    const [focused, setFocused] = React.useState(false);
    const selectionRef = React.useRef<InputSnapshot | null>(null);
    // 조합을 시작하기 전의 값과 선택 영역. 조합이 끝난 입력을 이 상태에서 바꾼 것으로 판단한다.
    const compositionRef = React.useRef<InputState | null>(null);

    const handleInput = React.useCallback(
      (event: TextFieldInputEvent) => {
        "background only";

        const { value: raw, selectionStart, selectionEnd, isComposing } = event.detail;
        const { index, value, length, normalize, isBirthDate } = latest.current;
        // iOS는 입력 뒤의 선택 변경을 bindinput보다 먼저 보낸다. 값 끝을 넘는 선택은 입력 전 끝으로 본다.
        const last = selectionRef.current;
        const selection = {
          start: Math.min(last?.start ?? value.length, value.length),
          end: Math.min(last?.end ?? value.length, value.length),
        };
        selectionRef.current = { start: selectionStart, end: selectionEnd };

        if (isComposing) {
          // 조합 중에는 값만 반영하고, 정규화와 자동 이동은 조합이 끝난 입력에서 판단한다.
          compositionRef.current ??= { ...selection, value };
          ctx.setSegmentValues({ [index]: raw });
        } else {
          const composed = compositionRef.current !== null;
          const before = compositionRef.current ?? { ...selection, value };
          compositionRef.current = null;

          // 입력은 이전 선택 영역을 바꾼 것으로 본다. 앞뒤 값이 그대로면 바뀐 부분만 정규화한다.
          const prefix = before.value.slice(0, before.start);
          const suffix = before.value.slice(before.end);
          const keepsSurroundings =
            raw.length >= prefix.length + suffix.length &&
            raw.startsWith(prefix) &&
            raw.endsWith(suffix);
          const inserted = keepsSurroundings
            ? raw.slice(prefix.length, raw.length - suffix.length)
            : null;
          // 자리 수를 넘는 값은 반영하지 않고 이전 값으로 되돌린다. native 값은 TextField 동기화가 맞춘다.
          const revert = () => {
            nativeLengthRef.current = before.value.length;
            ctx.setSegmentValues({ [index]: before.value });
          };

          // paste 이벤트가 없으므로 조합이 아닌 입력으로 여러 글자가 들어오면 붙여넣기·자동완성으로 본다.
          const insertedLength =
            inserted?.length ?? raw.length - (before.value.length - (before.end - before.start));
          const isPaste = !composed && insertedLength > 1;
          const commit = (next: string) => {
            nativeLengthRef.current = next.length;
            ctx.setSegmentValues({ [index]: next });
          };

          if (isPaste) {
            const date = isBirthDate ? normalizeBirthDate(inserted ?? raw, length) : null;

            if (date) {
              ctx.distribute(index, date);
            } else if (suffix !== "") {
              // 뒤에 선택하지 않은 값이 남아 있으면 현재 Segment 안에서만 반영한다.
              const next =
                inserted === null ? normalize(raw) : prefix + normalize(inserted) + suffix;
              if (next.length > length) revert();
              else commit(next);
            } else {
              // 앞 값까지 바뀐 입력(자동완성 교체 등)은 Segment 전체를 바꾼다.
              ctx.distribute(
                index,
                inserted === null ? normalize(raw) : prefix + normalize(inserted),
              );
            }
          } else {
            const next = inserted === null ? normalize(raw) : prefix + normalize(inserted) + suffix;

            if (next.length > length) {
              revert();
            } else {
              commit(next);

              const typedAtEnd =
                before.start === before.end &&
                before.end === before.value.length &&
                next.length > before.value.length;
              if (typedAtEnd && next.length === length) ctx.focusSegment(index + 1);
            }
          }
        }

        bindinput?.(event as Parameters<NonNullable<NativeInputProps["bindinput"]>>[0]);
      },
      [ctx.setSegmentValues, ctx.distribute, ctx.focusSegment, bindinput],
    );

    const handleSelection = React.useCallback(
      (event: TextFieldSelectionEvent) => {
        "background only";

        const { selectionStart: start, selectionEnd: end } = event.detail;
        const nativeLength = nativeLengthRef.current;
        // 가린 값은 보이지 않으므로 가운데를 고칠 수 없게 caret을 끝에 둔다.
        // 입력보다 먼저 온 선택 변경(입력 직후 caret)은 끝보다 뒤에 있으므로 건드리지 않는다.
        if (latest.current.masked && (start !== end || start < nativeLength)) {
          selectionRef.current = { start: nativeLength, end: nativeLength };
          try {
            nativeRef.current
              ?.invoke({
                method: "setSelectionRange",
                params: { selectionStart: nativeLength, selectionEnd: nativeLength },
              })
              .exec();
          } catch {
            // native 입력이 아직 commit되지 않았으면 선택 영역도 없다.
          }
        } else {
          selectionRef.current = { start, end };
        }
        bindselection?.(event as Parameters<NonNullable<NativeInputProps["bindselection"]>>[0]);
      },
      [bindselection],
    );

    const handleFocus = React.useCallback(
      (event: Parameters<NonNullable<NativeInputProps["bindfocus"]>>[0]) => {
        "background only";
        setFocused(true);
        bindfocus?.(event);
      },
      [bindfocus],
    );

    const handleBlur = React.useCallback(
      (event: Parameters<NonNullable<NativeInputProps["bindblur"]>>[0]) => {
        "background only";
        setFocused(false);
        bindblur?.(event);
      },
      [bindblur],
    );

    const api = useTextFieldInput(
      {
        ...otherProps,
        placeholder: !masked && typeof placeholder === "string" ? placeholder : undefined,
        readonly: readOnly,
        type,
        bindinput: handleInput,
        bindselection: handleSelection,
        bindfocus: handleFocus,
        bindblur: handleBlur,
      },
      mergedRef,
    );

    ctx.updateSegment(segmentKey, { length, masked, readOnly: api.readOnly, focus: api.focus });

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (!otherProps["accessibility-label"]) {
        console.warn(
          "SegmentedTextInputSegment: Please provide `accessibility-label` for each input segment so that assistive technologies can tell the segments apart.",
        );
      }
    }, []);

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

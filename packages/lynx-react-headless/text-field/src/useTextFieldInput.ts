import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type Ref,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useFieldContext } from "@seed-design/lynx-react-field";
import { useKeyboardAvoidingScrollViewContext } from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";
import { useTextFieldContext } from "./useTextFieldContext.js";

/** iOS와 Android의 32비트 `maxlength` setter에서 사용하는 무제한 센티널. */
export const NATIVE_TEXT_MAX_LENGTH_UNLIMITED = 2_147_483_647;

type NativeInputProps = IntrinsicElements["input"];
type NativeTextareaProps = IntrinsicElements["textarea"];

export type TextFieldInputEvent =
  | Parameters<NonNullable<NativeInputProps["bindinput"]>>[0]
  | Parameters<NonNullable<NativeTextareaProps["bindinput"]>>[0];
export type TextFieldSelectionEvent =
  | Parameters<NonNullable<NativeInputProps["bindselection"]>>[0]
  | Parameters<NonNullable<NativeTextareaProps["bindselection"]>>[0];
export type TextFieldFocusEvent =
  | Parameters<NonNullable<NativeInputProps["bindfocus"]>>[0]
  | Parameters<NonNullable<NativeTextareaProps["bindfocus"]>>[0];
export type TextFieldBlurEvent =
  | Parameters<NonNullable<NativeInputProps["bindblur"]>>[0]
  | Parameters<NonNullable<NativeTextareaProps["bindblur"]>>[0];

export type AndroidSetSoftInputMode = "unspecified" | "nothing" | "pan" | "resize";

export interface UseTextFieldInputProps {
  /** 생략하면 Root의 `disabled`를 따릅니다. */
  disabled?: boolean;
  /** 생략하면 Root의 `readOnly`를 따릅니다. `true`이면 native 입력 대신 `<text>`를 렌더링합니다. */
  readonly?: boolean;
  /** 생략하면 Root의 `name`을 따릅니다. */
  name?: string;
  /** native UTF-16 `maxlength`입니다. Root의 `nativeInsertionMaxLength`와 함께 주면 더 작은 값을 씁니다. */
  maxlength?: number;
  /**
   * 포커스할 때 시스템 키보드를 표시합니다.
   * `undefined`가 native attribute로 전달되지 않도록 `true`를 명시적으로 적용합니다.
   * @default true
   */
  "show-soft-input-on-focus"?: boolean;
  /**
   * Android host window의 soft input mode를 지정합니다.
   * `undefined`가 native attribute로 전달되지 않도록 `"unspecified"`를 명시적으로 적용합니다.
   * @default "unspecified"
   */
  "android-set-soft-input-mode"?: AndroidSetSoftInputMode;
  /** disabled·readOnly가 아닐 때 값 갱신 뒤 호출됩니다. */
  bindinput?: (event: TextFieldInputEvent) => void;
  bindselection?: (event: TextFieldSelectionEvent) => void;
  bindfocus?: (event: TextFieldFocusEvent) => void;
  bindblur?: (event: TextFieldBlurEvent) => void;
  bindlayoutchange?: NativeInputProps["bindlayoutchange"];
  "main-thread:bindlayoutchange"?: NativeInputProps["main-thread:bindlayoutchange"];
  id?: string;
  className?: string;
  style?: NativeInputProps["style"];
  hidden?: boolean;
  flatten?: boolean;
  focusable?: boolean;
  "accessibility-label"?: string;
  "accessibility-traits"?: NativeInputProps["accessibility-traits"];
  "accessibility-element"?: boolean;
  "accessibility-value"?: string;
  "accessibility-role-description"?: string;
  "accessibility-elements-hidden"?: boolean;
  "accessibility-heading"?: boolean;
  "accessibility-actions"?: NativeInputProps["accessibility-actions"];
  "accessibility-exclusive-focus"?: boolean;
  "ios-platform-accessibility-id"?: string;
}

type ManagedInputKey =
  | "disabled"
  | "readonly"
  | "name"
  | "maxlength"
  | "show-soft-input-on-focus"
  | "android-set-soft-input-mode"
  | "bindinput"
  | "bindselection"
  | "bindfocus"
  | "bindblur";

export interface TextFieldManagedInputProps {
  ref: Ref<NodesRef>;
  "default-value": string;
  maxlength?: number;
  disabled: boolean;
  readonly: boolean;
  name?: string;
  "show-soft-input-on-focus": boolean;
  "android-set-soft-input-mode": AndroidSetSoftInputMode;
  bindinput: (event: TextFieldInputEvent) => void;
  bindselection: (event: TextFieldSelectionEvent) => void;
  bindfocus: (event: TextFieldFocusEvent) => void;
  bindblur: (event: TextFieldBlurEvent) => void;
}

/** readOnly `<text>`로 옮겨도 의미가 같은 props만 담습니다. input 전용 이벤트·UI method는 없습니다. */
export interface TextFieldReadOnlyTextProps {
  ref: Ref<NodesRef>;
  id?: string;
  className?: string;
  style?: NativeInputProps["style"];
  hidden?: boolean;
  flatten?: boolean;
  focusable?: boolean;
  bindlayoutchange?: NativeInputProps["bindlayoutchange"];
  "main-thread:bindlayoutchange"?: NativeInputProps["main-thread:bindlayoutchange"];
  "accessibility-label"?: string;
  "accessibility-traits"?: NativeInputProps["accessibility-traits"];
  "accessibility-element"?: boolean;
  "accessibility-value"?: string;
  "accessibility-role-description"?: string;
  "accessibility-elements-hidden"?: boolean;
  "accessibility-heading"?: boolean;
  "accessibility-actions"?: NativeInputProps["accessibility-actions"];
  "accessibility-exclusive-focus"?: boolean;
  "ios-platform-accessibility-id"?: string;
}

export interface UseTextFieldInputReturn<P extends UseTextFieldInputProps> {
  /** Root의 현재 값입니다. readOnly `<text>`에 표시합니다. */
  value: string;
  disabled: boolean;
  readOnly: boolean;
  /** `readOnly`가 `false`일 때 native `<input>`·`<textarea>`에 펼칩니다. */
  inputProps: Omit<P, ManagedInputKey> & TextFieldManagedInputProps;
  /** `readOnly`가 `true`일 때 `<text>`에 펼칩니다. 전달한 ref가 `<text>`를 가리킵니다. */
  readOnlyTextProps: TextFieldReadOnlyTextProps;
  /** native 입력의 `focus` UI method를 호출합니다. 입력을 감싼 영역의 tap에서 사용합니다. */
  focus: () => void;
  /** autoresize처럼 focus된 입력의 크기가 바뀌면 호출해 키보드 회피 위치를 다시 계산합니다. */
  notifyLayoutChanged: () => void;
}

function useWasDefined(value: unknown): boolean {
  const isDefined = value !== undefined;
  const [wasDefined, setWasDefined] = useState(isDefined);

  useEffect(() => {
    if (isDefined) setWasDefined(true);
  }, [isDefined]);

  return wasDefined || isDefined;
}

function resolveNativeMaxLength(
  explicitMaxLength: number | undefined,
  insertionMaxLength: number | undefined,
): number | undefined {
  if (explicitMaxLength === undefined) return insertionMaxLength;
  if (insertionMaxLength === undefined) return explicitMaxLength;

  return Math.min(explicitMaxLength, insertionMaxLength);
}

function useMergedRef(
  internalRef: { current: NodesRef | null },
  forwardedRef: ForwardedRef<NodesRef> | undefined,
): Ref<NodesRef> {
  return useMemo<Ref<NodesRef>>(() => {
    if (!forwardedRef) return internalRef;
    return (node: NodesRef | null) => {
      "background only";
      internalRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
  }, [forwardedRef, internalRef]);
}

/**
 * @platform Lynx
 *
 * `TextFieldRoot` 안의 native `<input>`·`<textarea>` 하나를 Root 값·Field·키보드 회피에 연결합니다.
 *
 * - controlled 입력은 native 이벤트 뒤 부모가 commit한 값을 `setValue` UI method로 되돌립니다.
 *   늦게 도착한 blur나 이전 입력의 microtask는 최신 commit을 덮어쓰지 않습니다.
 * - disabled·readOnly이면 값 변경을 무시하고 native 값을 되돌리며, 키보드 회피에 등록하지 않습니다.
 * - Root의 `nativeInsertionMaxLength`는 범위 선택 교체·composition 중에는 해제합니다.
 * - focus·blur를 Root와 Field에 알리고, 가장 가까운 KeyboardAvoidingScrollView에 Root·Field 영역을 등록합니다.
 *
 * 스타일 props는 그대로 통과시키므로 무스타일 파트와 SEED 스타일 파트가 같은 동작을 씁니다.
 */
export function useTextFieldInput<P extends UseTextFieldInputProps>(
  props: P,
  forwardedRef?: ForwardedRef<NodesRef>,
): UseTextFieldInputReturn<P> {
  const {
    disabled: disabledProp,
    readonly: readOnlyProp,
    name,
    maxlength,
    "show-soft-input-on-focus": showSoftInputOnFocus,
    "android-set-soft-input-mode": androidSetSoftInputMode,
    bindinput,
    bindselection,
    bindfocus,
    bindblur,
    ...nativeProps
  } = props;
  const textFieldContext = useTextFieldContext();
  const fieldContext = useFieldContext({ strict: false });
  const keyboardAvoidance = useKeyboardAvoidingScrollViewContext({ strict: false });
  const disabled = disabledProp ?? textFieldContext.disabled;
  const readOnly = readOnlyProp ?? textFieldContext.readOnly;
  const nativeRef = useRef<NodesRef | null>(null);
  const initialNativeValueRef = useRef(textFieldContext.value);
  const ownerRef = useRef<object>({});
  const lastNativeValueRef = useRef<string | null>(initialNativeValueRef.current);
  const committedValueRef = useRef(textFieldContext.value);
  const controlledRef = useRef(textFieldContext.controlled);
  const readOnlyRef = useRef(readOnly);
  const isComposingRef = useRef(false);
  const canApplyInsertionMaxLengthRef = useRef(true);
  const reconciliationRevisionRef = useRef(0);
  const focusedRef = useRef(false);
  const [canApplyInsertionMaxLength, setCanApplyInsertionMaxLength] = useState(true);
  const wasInsertionMaxLengthManaged = useWasDefined(textFieldContext.nativeInsertionMaxLength);

  committedValueRef.current = textFieldContext.value;
  controlledRef.current = textFieldContext.controlled;
  readOnlyRef.current = readOnly;

  const mergedRef = useMergedRef(nativeRef, forwardedRef);

  const syncNativeValue = useCallback((node: NodesRef, value: string) => {
    "background only";

    if (lastNativeValueRef.current === value || typeof node.invoke !== "function") return;

    lastNativeValueRef.current = value;

    try {
      node
        .invoke({
          method: "setValue",
          params: { value },
          fail() {
            "background only";
            if (lastNativeValueRef.current === value) {
              lastNativeValueRef.current = null;
            }
          },
        })
        .exec();
    } catch {
      // Native node가 아직 commit되지 않았거나 UI method를 지원하지 않으면
      // 다음 value commit에서 다시 동기화한다.
      lastNativeValueRef.current = null;
    }
  }, []);

  const updateEditingState = useCallback(
    (selectionStart: number, selectionEnd: number, isComposing = isComposingRef.current) => {
      "background only";

      isComposingRef.current = isComposing;
      const nextCanApplyInsertionMaxLength =
        !isComposing && selectionStart >= 0 && selectionStart === selectionEnd;
      if (canApplyInsertionMaxLengthRef.current === nextCanApplyInsertionMaxLength) return;

      canApplyInsertionMaxLengthRef.current = nextCanApplyInsertionMaxLength;
      setCanApplyInsertionMaxLength(nextCanApplyInsertionMaxLength);
    },
    [],
  );

  const reconcileControlledValue = useCallback(
    (nativeValue: string) => {
      "background only";

      if (!controlledRef.current) return;

      reconciliationRevisionRef.current += 1;
      const revision = reconciliationRevisionRef.current;
      const nodeAtInput = nativeRef.current;

      void Promise.resolve()
        .then(() => {
          "background only";
          // onValueChange가 microtask에서 부모 state를 갱신해도 그 commit을 먼저 처리한다.
        })
        .then(() => {
          "background only";

          if (
            revision !== reconciliationRevisionRef.current ||
            !controlledRef.current ||
            readOnlyRef.current ||
            nativeRef.current !== nodeAtInput
          ) {
            return;
          }

          const committedValue = committedValueRef.current;
          if (committedValue === nativeValue) return;

          const node = nativeRef.current;
          if (node) {
            syncNativeValue(node, committedValue);
          }
        });
    },
    [syncNativeValue],
  );

  useEffect(() => {
    if (readOnly) return;
    if (lastNativeValueRef.current === textFieldContext.value) return;

    const node = nativeRef.current;
    if (node) {
      syncNativeValue(node, textFieldContext.value);
    }
  }, [readOnly, syncNativeValue, textFieldContext.value]);

  // `default-value`는 Lynx 4.0(3.9.1)부터 지원한다. 이전 엔진은 초기 값을 표시하지 않으므로
  // mount 뒤 native 값을 읽어 초기 값과 다를 때만 `setValue`로 맞춘다. 지원하는 엔진에서는 읽기만 한다.
  useEffect(() => {
    if (readOnly) return;

    const node = nativeRef.current;
    const expectedValue = lastNativeValueRef.current;
    if (!node || !expectedValue || typeof node.invoke !== "function") return;

    const restoreMissingValue = (nativeValue: string) => {
      "background only";

      // 그 사이 입력·동기화로 native 값이 바뀌었으면 그 결과를 유지한다.
      if (nativeRef.current !== node || lastNativeValueRef.current !== expectedValue) return;
      if (nativeValue === expectedValue) return;

      lastNativeValueRef.current = nativeValue;
      syncNativeValue(node, committedValueRef.current);
    };

    try {
      node
        .invoke({
          method: "getValue",
          success(result: { value?: unknown } | undefined) {
            "background only";
            restoreMissingValue(typeof result?.value === "string" ? result.value : "");
          },
          fail() {
            "background only";
            restoreMissingValue("");
          },
        })
        .exec();
    } catch {
      // Native node가 아직 commit되지 않았으면 다음 value commit의 동기화에 맡긴다.
    }
  }, [readOnly, syncNativeValue]);

  useEffect(
    () => () => {
      keyboardAvoidance?.unregister(ownerRef.current);
      reconciliationRevisionRef.current += 1;
    },
    [keyboardAvoidance],
  );

  const setFocused = textFieldContext.setFocused;
  useEffect(
    () => () => {
      // A removed control is not guaranteed to receive blur; release the focus it reported.
      if (focusedRef.current) setFocused(false);
    },
    [setFocused],
  );

  const setValue = textFieldContext.setValue;
  const handleInput = useCallback(
    (event: TextFieldInputEvent) => {
      "background only";

      const { value: nextValue, selectionStart, selectionEnd, isComposing } = event.detail;
      if (disabled || readOnly) {
        lastNativeValueRef.current = nextValue;

        if (nextValue !== committedValueRef.current) {
          const node = nativeRef.current;
          if (node) {
            syncNativeValue(node, committedValueRef.current);
          }
        }
        return;
      }

      updateEditingState(selectionStart, selectionEnd, isComposing === true);
      lastNativeValueRef.current = nextValue;
      setValue(nextValue);
      bindinput?.(event);
      reconcileControlledValue(nextValue);
    },
    [
      bindinput,
      disabled,
      readOnly,
      reconcileControlledValue,
      setValue,
      syncNativeValue,
      updateEditingState,
    ],
  );

  const handleSelection = useCallback(
    (event: TextFieldSelectionEvent) => {
      "background only";

      updateEditingState(event.detail.selectionStart, event.detail.selectionEnd);
      bindselection?.(event);
    },
    [bindselection, updateEditingState],
  );

  const rootRef = textFieldContext.rootRef;
  const fieldRef = fieldContext?.rootRef;
  const handleFocus = useCallback(
    (event: TextFieldFocusEvent) => {
      "background only";

      focusedRef.current = true;
      setFocused(true);
      keyboardAvoidance?.focus({
        owner: ownerRef.current,
        nativeRef,
        controlRef: rootRef,
        fieldRef,
        enabled: !disabled && !readOnly,
      });
      bindfocus?.(event);
    },
    [bindfocus, disabled, fieldRef, keyboardAvoidance, readOnly, rootRef, setFocused],
  );

  const handleBlur = useCallback(
    (event: TextFieldBlurEvent) => {
      "background only";

      const nativeValue = event.detail?.value;
      if (typeof nativeValue === "string") {
        lastNativeValueRef.current = nativeValue;
      }
      focusedRef.current = false;
      setFocused(false);
      keyboardAvoidance?.blur(ownerRef.current);
      bindblur?.(event);
      if (typeof nativeValue === "string") {
        reconcileControlledValue(nativeValue);
      }
    },
    [bindblur, keyboardAvoidance, reconcileControlledValue, setFocused],
  );

  const notifyLayoutChanged = useCallback(() => {
    "background only";

    keyboardAvoidance?.layoutChanged(ownerRef.current);
  }, [keyboardAvoidance]);

  const focus = useCallback(() => {
    "background only";

    const node = nativeRef.current;
    if (!node || typeof node.invoke !== "function") return;

    try {
      node.invoke({ method: "focus" }).exec();
    } catch {
      // Native node가 아직 commit되지 않았으면 실제 입력 탭이 focus를 처리한다.
    }
  }, []);

  const insertionMaxLength =
    wasInsertionMaxLengthManaged &&
    canApplyInsertionMaxLength &&
    textFieldContext.nativeInsertionMaxLength !== undefined
      ? textFieldContext.nativeInsertionMaxLength
      : wasInsertionMaxLengthManaged
        ? NATIVE_TEXT_MAX_LENGTH_UNLIMITED
        : undefined;
  // 한 번 관리한 maxlength는 제한이 사라져도 무제한 값으로 남겨 native 입력을 교체하지 않는다.
  const wasMaxLengthManaged = useWasDefined(
    maxlength !== undefined || insertionMaxLength !== undefined ? true : undefined,
  );
  const resolvedMaxLength = wasMaxLengthManaged
    ? resolveNativeMaxLength(maxlength, insertionMaxLength ?? NATIVE_TEXT_MAX_LENGTH_UNLIMITED)
    : undefined;

  return {
    value: textFieldContext.value,
    disabled,
    readOnly,
    inputProps: {
      ...nativeProps,
      ref: mergedRef,
      "default-value": initialNativeValueRef.current,
      ...(resolvedMaxLength === undefined ? {} : { maxlength: resolvedMaxLength }),
      disabled,
      readonly: readOnly,
      name: name ?? textFieldContext.name,
      "show-soft-input-on-focus": showSoftInputOnFocus ?? true,
      "android-set-soft-input-mode": androidSetSoftInputMode ?? "unspecified",
      bindinput: handleInput,
      bindselection: handleSelection,
      bindfocus: handleFocus,
      bindblur: handleBlur,
    },
    readOnlyTextProps: {
      ref: mergedRef,
      id: props.id,
      className: props.className,
      style: props.style,
      hidden: props.hidden,
      flatten: props.flatten,
      focusable: props.focusable,
      bindlayoutchange: props.bindlayoutchange,
      "main-thread:bindlayoutchange": props["main-thread:bindlayoutchange"],
      "accessibility-label": props["accessibility-label"],
      "accessibility-traits": props["accessibility-traits"],
      "accessibility-element": props["accessibility-element"],
      "accessibility-value": props["accessibility-value"],
      "accessibility-role-description": props["accessibility-role-description"],
      "accessibility-elements-hidden": props["accessibility-elements-hidden"],
      "accessibility-heading": props["accessibility-heading"],
      "accessibility-actions": props["accessibility-actions"],
      "accessibility-exclusive-focus": props["accessibility-exclusive-focus"],
      "ios-platform-accessibility-id": props["ios-platform-accessibility-id"],
    },
    focus,
    notifyLayoutChanged,
  };
}

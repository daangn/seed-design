import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { textInput, type TextInputVariantProps } from "@seed-design/lynx-css/recipes/text-input";
import { textInput as textInputVars } from "@seed-design/lynx-css/vars/component";
import clsx from "clsx";

import type { LynxAccessibilityProps, LynxStyledElementProps, LynxTextRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useKeyboardAvoidanceActions } from "../KeyboardAvoidingScrollView/context";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";
import { useFieldContext } from "../Field/context";
import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED, TextFieldContext } from "./context";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

const ANDROID_TEXTAREA_DEFAULT_LINE_SPACING = "3.2px" as const;

function getRuntimePlatform(): string | undefined {
  const globalSystemInfo = (globalThis as typeof globalThis & { SystemInfo?: LynxSystemInfo })
    .SystemInfo;
  const systemInfo =
    globalSystemInfo ?? (typeof SystemInfo === "undefined" ? undefined : SystemInfo);

  return systemInfo?.platform;
}

function isAndroidRuntime(): boolean {
  return getRuntimePlatform() === "Android";
}

function isIOSRuntime(): boolean {
  return getRuntimePlatform() === "iOS";
}

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(textInput);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * native `<input>`과 `<textarea>`의 값 상태를 소유한다.
 * Lynx native 입력은 value attribute를 제공하지 않으므로 하위 입력 슬롯이
 * `setValue` UI method로 controlled value를 동기화한다.
 */
export interface TextFieldRootProps
  extends Omit<TextInputVariantProps, "focused">,
    LynxStyledElementProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @internal `useTextFieldWithGraphemes`가 전달하는 네이티브 입력 사전 제한 값. */
  nativeInsertionMaxLength?: number;
  required?: boolean;
  name?: string;
}

export const TextFieldRoot = React.forwardRef<NodesRef, TextFieldRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = textInput.splitVariantProps(props);
    const {
      children,
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      nativeInsertionMaxLength,
      required: requiredProp,
      name,
      ...nativeProps
    } = otherProps;
    const fieldContext = useFieldContext({ strict: false });
    const rootRef = React.useRef<NodesRef | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const [localFocused, setLocalFocused] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const disabled = variantProps.disabled ?? fieldContext?.disabled ?? false;
    const invalid = variantProps.invalid ?? fieldContext?.invalid ?? false;
    const readOnly = variantProps.readOnly ?? fieldContext?.readOnly ?? false;
    const required = requiredProp ?? fieldContext?.required ?? false;
    const focused = fieldContext?.focused ?? localFocused;
    const variant = variantProps.variant ?? "outline";
    const size = variantProps.size ?? "large";
    const valueRef = React.useRef(value);
    const controlledRef = React.useRef(isControlled);
    const onValueChangeRef = React.useRef(onValueChange);
    const fieldContextRef = React.useRef(fieldContext);
    valueRef.current = value;
    controlledRef.current = isControlled;
    onValueChangeRef.current = onValueChange;
    fieldContextRef.current = fieldContext;
    const classes = textInput({
      ...variantProps,
      variant,
      size,
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

    const setFocused = React.useCallback((nextFocused: boolean) => {
      "background only";

      setLocalFocused(nextFocused);
      fieldContextRef.current?.setFocused(nextFocused);
    }, []);

    const setValue = React.useCallback((nextValue: string) => {
      "background only";

      if (!controlledRef.current) {
        setUncontrolledValue(nextValue);
      }
      if (nextValue !== valueRef.current) {
        onValueChangeRef.current?.(nextValue);
      }
    }, []);

    const contextValue = React.useMemo(
      () => ({
        rootRef,
        value,
        controlled: isControlled,
        nativeInsertionMaxLength,
        disabled,
        invalid,
        readOnly,
        required,
        name,
        focused,
        setValue,
        setFocused,
      }),
      [
        disabled,
        focused,
        invalid,
        name,
        nativeInsertionMaxLength,
        readOnly,
        required,
        setFocused,
        setValue,
        value,
        isControlled,
      ],
    );

    return (
      <TextFieldContext.Provider value={contextValue}>
        <ClassNamesProvider value={classes}>
          <view ref={mergedRef} className={clsx(classes.root, className)} {...nativeProps}>
            <view className={classes.baseStroke} accessibility-elements-hidden={true} />
            <view className={classes.stroke} accessibility-elements-hidden={true} />
            {children}
          </view>
        </ClassNamesProvider>
      </TextFieldContext.Provider>
    );
  },
);
TextFieldRoot.displayName = "TextFieldRoot";

////////////////////////////////////////////////////////////////////////////////////

type NativeInputProps = IntrinsicElements["input"];
type NativeTextareaProps = IntrinsicElements["textarea"];
type NativeInputEvent = Parameters<NonNullable<NativeInputProps["bindinput"]>>[0];
type NativeTextareaEvent = Parameters<NonNullable<NativeTextareaProps["bindinput"]>>[0];

interface NativeSelectionDetail {
  selectionStart: number;
  selectionEnd: number;
}

function resolveNativeMaxLength(
  explicitMaxLength: number | undefined,
  insertionMaxLength: number | undefined,
): number | undefined {
  if (explicitMaxLength === undefined) return insertionMaxLength;
  if (insertionMaxLength === undefined) return explicitMaxLength;

  return Math.min(explicitMaxLength, insertionMaxLength);
}

function useWasDefined(value: unknown): boolean {
  const isDefined = value !== undefined;
  const [wasDefined, setWasDefined] = React.useState(isDefined);

  React.useEffect(() => {
    if (isDefined) setWasDefined(true);
  }, [isDefined]);

  return wasDefined || isDefined;
}

function useResolvedNativeMaxLength(
  explicitMaxLength: number | undefined,
  insertionMaxLength: number | undefined,
): number | undefined {
  const wasManaged = useWasDefined(
    explicitMaxLength !== undefined || insertionMaxLength !== undefined ? true : undefined,
  );

  if (!wasManaged) return undefined;

  return resolveNativeMaxLength(
    explicitMaxLength,
    insertionMaxLength ?? NATIVE_TEXT_MAX_LENGTH_UNLIMITED,
  );
}

interface UseNativeTextControlOptions {
  forwardedRef: React.Ref<NodesRef>;
  disabled?: boolean;
  readOnly?: boolean;
  bindinput?: (event: NativeInputEvent | NativeTextareaEvent) => void;
  bindfocus?: NativeInputProps["bindfocus"] | NativeTextareaProps["bindfocus"];
  bindblur?: NativeInputProps["bindblur"] | NativeTextareaProps["bindblur"];
}

function useNativeTextControl({
  forwardedRef,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  bindinput,
  bindfocus,
  bindblur,
}: UseNativeTextControlOptions) {
  const textFieldContext = React.useContext(TextFieldContext);
  if (!textFieldContext) {
    throw new Error("TextField input components must be rendered inside <TextField.Root>.");
  }

  const fieldContext = useFieldContext({ strict: false });
  const keyboardAvoidance = useKeyboardAvoidanceActions();
  const disabled = disabledProp ?? textFieldContext.disabled;
  const readOnly = readOnlyProp ?? textFieldContext.readOnly;
  const nativeRef = React.useRef<NodesRef | null>(null);
  const initialNativeValueRef = React.useRef(textFieldContext.value);
  const ownerRef = React.useRef<object>({});
  const lastNativeValueRef = React.useRef<string | null>(initialNativeValueRef.current);
  const committedValueRef = React.useRef(textFieldContext.value);
  const controlledRef = React.useRef(textFieldContext.controlled);
  const readOnlyRef = React.useRef(readOnly);
  const isComposingRef = React.useRef(false);
  const canApplyInsertionMaxLengthRef = React.useRef(true);
  const reconciliationRevisionRef = React.useRef(0);
  const [canApplyInsertionMaxLength, setCanApplyInsertionMaxLength] = React.useState(true);
  const wasInsertionMaxLengthManaged = useWasDefined(textFieldContext.nativeInsertionMaxLength);

  committedValueRef.current = textFieldContext.value;
  controlledRef.current = textFieldContext.controlled;
  readOnlyRef.current = readOnly;

  const syncNativeValue = React.useCallback((node: NodesRef, value: string) => {
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

  const mergedRef = React.useCallback(
    (node: NodesRef | null) => {
      "background only";

      nativeRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const updateEditingState = React.useCallback(
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

  const reconcileControlledValue = React.useCallback(
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

  React.useEffect(() => {
    if (readOnly) return;
    if (lastNativeValueRef.current === textFieldContext.value) return;

    const node = nativeRef.current;
    if (node) {
      syncNativeValue(node, textFieldContext.value);
    }
  }, [readOnly, syncNativeValue, textFieldContext.value]);

  React.useEffect(
    () => () => {
      keyboardAvoidance?.unregister(ownerRef.current);
      reconciliationRevisionRef.current += 1;
    },
    [keyboardAvoidance],
  );

  const handleInput = React.useCallback(
    (event: NativeInputEvent | NativeTextareaEvent) => {
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
      textFieldContext.setValue(nextValue);
      bindinput?.(event);
      reconcileControlledValue(nextValue);
    },
    [
      bindinput,
      disabled,
      readOnly,
      reconcileControlledValue,
      syncNativeValue,
      textFieldContext.setValue,
      updateEditingState,
    ],
  );

  const handleSelectionChange = React.useCallback(
    (detail: NativeSelectionDetail) => {
      "background only";

      updateEditingState(detail.selectionStart, detail.selectionEnd);
    },
    [updateEditingState],
  );

  const handleFocus = React.useCallback(
    (event: Parameters<NonNullable<NativeInputProps["bindfocus"]>>[0]) => {
      "background only";

      textFieldContext.setFocused(true);
      keyboardAvoidance?.focus({
        owner: ownerRef.current,
        nativeRef,
        controlRef: textFieldContext.rootRef,
        fieldRef: fieldContext?.rootRef,
        enabled: !disabled && !readOnly,
      });
      bindfocus?.(event);
    },
    [
      bindfocus,
      disabled,
      fieldContext?.rootRef,
      keyboardAvoidance,
      readOnly,
      textFieldContext.rootRef,
      textFieldContext.setFocused,
    ],
  );

  const handleBlur = React.useCallback(
    (event: Parameters<NonNullable<NativeInputProps["bindblur"]>>[0]) => {
      "background only";

      const nativeValue = event.detail?.value;
      if (typeof nativeValue === "string") {
        lastNativeValueRef.current = nativeValue;
      }
      textFieldContext.setFocused(false);
      keyboardAvoidance?.blur(ownerRef.current);
      bindblur?.(event);
      if (typeof nativeValue === "string") {
        reconcileControlledValue(nativeValue);
      }
    },
    [bindblur, keyboardAvoidance, reconcileControlledValue, textFieldContext.setFocused],
  );

  const notifyLayoutChanged = React.useCallback(() => {
    "background only";

    keyboardAvoidance?.layoutChanged(ownerRef.current);
  }, [keyboardAvoidance]);

  const focusNativeControl = React.useCallback(() => {
    "background only";

    const node = nativeRef.current;
    if (!node || typeof node.invoke !== "function") return;

    try {
      node.invoke({ method: "focus" }).exec();
    } catch {
      // Native node가 아직 commit되지 않았으면 실제 textarea 탭이 focus를 처리한다.
    }
  }, []);

  return {
    context: textFieldContext,
    disabled,
    readOnly,
    defaultValueProps: { "default-value": initialNativeValueRef.current },
    mergedRef,
    handleInput,
    handleFocus,
    handleBlur,
    notifyLayoutChanged,
    focusNativeControl,
    handleSelectionChange,
    nativeInsertionMaxLength:
      wasInsertionMaxLengthManaged &&
      canApplyInsertionMaxLength &&
      textFieldContext.nativeInsertionMaxLength !== undefined
        ? textFieldContext.nativeInsertionMaxLength
        : wasInsertionMaxLengthManaged
          ? NATIVE_TEXT_MAX_LENGTH_UNLIMITED
          : undefined,
  };
}

interface NativeTextControlProps
  extends Omit<LynxStyledElementProps, "children">,
    LynxAccessibilityProps {
  id?: NativeInputProps["id"];
  name?: NativeInputProps["name"];
  hidden?: NativeInputProps["hidden"];
  flatten?: NativeInputProps["flatten"];
  focusable?: NativeInputProps["focusable"];
  bindlayoutchange?: NativeInputProps["bindlayoutchange"];
  "main-thread:bindlayoutchange"?: NativeInputProps["main-thread:bindlayoutchange"];
}

type AndroidSetSoftInputMode = "unspecified" | "nothing" | "pan" | "resize";

function getAccessibilityProps(props: LynxAccessibilityProps): LynxAccessibilityProps {
  return {
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
  };
}

function getReadOnlyTextStyle({
  style,
  disabled,
  placeholder,
  multiline,
}: {
  style: LynxStyledElementProps["style"];
  disabled: boolean;
  placeholder: boolean;
  multiline: boolean;
}): LynxStyledElementProps["style"] {
  return {
    ...style,
    ...(multiline ? { whiteSpace: "normal", wordBreak: "break-all" } : { alignSelf: "center" }),
    ...(placeholder
      ? {
          color: disabled
            ? textInputVars.base.disabled.placeholder.color
            : textInputVars.base.enabled.placeholder.color,
        }
      : {}),
  };
}

/**
 * @platform Lynx
 *
 * `readOnly` 상태에서는 native focus·selection·편집 메뉴를 제거하기 위해 `<text>`로 렌더링한다.
 * 이때 ref는 `<text>`를 가리키며 input 전용 UI method와 이벤트는 사용할 수 없다.
 */
export interface TextFieldInputProps extends NativeTextControlProps {
  placeholder?: NativeInputProps["placeholder"];
  "confirm-type"?: NativeInputProps["confirm-type"];
  maxlength?: NativeInputProps["maxlength"];
  readonly?: NativeInputProps["readonly"];
  disabled?: NativeInputProps["disabled"];
  /**
   * 포커스할 때 시스템 키보드를 표시한다.
   * `undefined`가 native attribute로 전달되지 않도록 `true`를 명시적으로 적용한다.
   * @defaultValue true
   */
  "show-soft-input-on-focus"?: NativeInputProps["show-soft-input-on-focus"];
  "input-filter"?: NativeInputProps["input-filter"];
  type?: NativeInputProps["type"];
  "ios-auto-correct"?: NativeInputProps["ios-auto-correct"];
  "ios-spell-check"?: NativeInputProps["ios-spell-check"];
  "android-fullscreen-mode"?: NativeInputProps["android-fullscreen-mode"];
  /**
   * Android host window의 soft input mode를 지정한다.
   * `undefined`가 native attribute로 전달되지 않도록 `"unspecified"`를 명시적으로 적용한다.
   * @defaultValue "unspecified"
   */
  "android-set-soft-input-mode"?: AndroidSetSoftInputMode;
  bindfocus?: NativeInputProps["bindfocus"];
  bindblur?: NativeInputProps["bindblur"];
  bindconfirm?: NativeInputProps["bindconfirm"];
  bindinput?: NativeInputProps["bindinput"];
  bindselection?: NativeInputProps["bindselection"];
}

export const TextFieldInput = React.forwardRef<NodesRef, TextFieldInputProps>((props, ref) => {
  const classes = useClassNames();
  const {
    className,
    disabled,
    readonly,
    name,
    maxlength,
    bindinput,
    bindselection,
    bindfocus,
    bindblur,
    "show-soft-input-on-focus": showSoftInputOnFocus,
    "android-set-soft-input-mode": androidSetSoftInputMode,
    ...nativeProps
  } = props;
  const control = useNativeTextControl({
    forwardedRef: ref,
    disabled,
    readOnly: readonly,
    bindinput,
    bindfocus,
    bindblur,
  });
  const resolvedMaxLength = useResolvedNativeMaxLength(maxlength, control.nativeInsertionMaxLength);
  const handleSelection = React.useCallback<NonNullable<NativeInputProps["bindselection"]>>(
    (event) => {
      "background only";

      control.handleSelectionChange(event.detail);
      bindselection?.(event);
    },
    [bindselection, control.handleSelectionChange],
  );

  if (control.readOnly) {
    const value = control.context.value;
    const isPlaceholder = value === "";
    const displayValue = isPlaceholder
      ? props.placeholder
      : props.type === "password"
        ? Array.from(value, () => "•").join("")
        : value;

    return (
      <text
        ref={control.mergedRef}
        id={props.id}
        hidden={props.hidden}
        flatten={props.flatten}
        focusable={props.focusable}
        bindlayoutchange={props.bindlayoutchange}
        main-thread:bindlayoutchange={props["main-thread:bindlayoutchange"]}
        className={clsx(classes.value, className)}
        style={getReadOnlyTextStyle({
          style: props.style,
          disabled: control.disabled,
          placeholder: isPlaceholder,
          multiline: false,
        })}
        {...getAccessibilityProps(props)}
      >
        {displayValue}
      </text>
    );
  }

  return (
    <input
      {...control.defaultValueProps}
      ref={control.mergedRef}
      className={clsx(classes.value, className)}
      disabled={control.disabled}
      readonly={control.readOnly}
      show-soft-input-on-focus={showSoftInputOnFocus ?? true}
      android-set-soft-input-mode={androidSetSoftInputMode ?? "unspecified"}
      name={name ?? control.context.name}
      {...(resolvedMaxLength === undefined ? {} : { maxlength: resolvedMaxLength })}
      bindinput={control.handleInput}
      bindselection={handleSelection}
      bindfocus={control.handleFocus}
      bindblur={control.handleBlur}
      {...nativeProps}
    />
  );
});
TextFieldInput.displayName = "TextFieldInput";

/**
 * @platform Lynx
 *
 * `readOnly` 상태에서는 native focus·selection·편집 메뉴를 제거하기 위해 `<text>`로 렌더링한다.
 * 이때 ref는 `<text>`를 가리키며 textarea 전용 UI method와 이벤트는 사용할 수 없다.
 */
export interface TextFieldTextareaProps extends NativeTextControlProps {
  /** 내용에 맞춰 높이를 자동으로 조절한다. @defaultValue true */
  autoresize?: boolean;
  placeholder?: NativeTextareaProps["placeholder"];
  "confirm-type"?: NativeTextareaProps["confirm-type"];
  maxlength?: NativeTextareaProps["maxlength"];
  maxlines?: NativeTextareaProps["maxlines"];
  bounces?: NativeTextareaProps["bounces"];
  /**
   * native 줄 간격을 지정한다. 생략하면 Android에서 SEED 기본 typography를 맞추기 위해
   * `3.2px`를 적용하고 iOS에는 전달하지 않는다. Android 기본 보정은 `0`으로 해제할 수 있다.
   */
  "line-spacing"?: NativeTextareaProps["line-spacing"];
  readonly?: NativeTextareaProps["readonly"];
  disabled?: NativeTextareaProps["disabled"];
  /**
   * 포커스할 때 시스템 키보드를 표시한다.
   * `undefined`가 native attribute로 전달되지 않도록 `true`를 명시적으로 적용한다.
   * @defaultValue true
   */
  "show-soft-input-on-focus"?: NativeTextareaProps["show-soft-input-on-focus"];
  "input-filter"?: NativeTextareaProps["input-filter"];
  "enable-scroll-bar"?: NativeTextareaProps["enable-scroll-bar"];
  type?: NativeTextareaProps["type"];
  "ios-auto-correct"?: NativeTextareaProps["ios-auto-correct"];
  "ios-spell-check"?: NativeTextareaProps["ios-spell-check"];
  /** Android의 fullscreen extract input을 활성화한다. @defaultValue false */
  "android-fullscreen-mode"?: NativeTextareaProps["android-fullscreen-mode"];
  /**
   * Android host window의 soft input mode를 지정한다.
   * `undefined`가 native attribute로 전달되지 않도록 `"unspecified"`를 명시적으로 적용한다.
   * @defaultValue "unspecified"
   */
  "android-set-soft-input-mode"?: AndroidSetSoftInputMode;
  bindfocus?: NativeTextareaProps["bindfocus"];
  bindblur?: NativeTextareaProps["bindblur"];
  bindconfirm?: NativeTextareaProps["bindconfirm"];
  bindinput?: NativeTextareaProps["bindinput"];
  bindselection?: NativeTextareaProps["bindselection"];
}

export const TextFieldTextarea = React.forwardRef<NodesRef, TextFieldTextareaProps>(
  (props, ref) => {
    const classes = useClassNames();
    const {
      className,
      disabled,
      readonly,
      name,
      maxlength,
      bindinput,
      bindselection,
      bindfocus,
      bindblur,
      bindlayoutchange,
      "show-soft-input-on-focus": showSoftInputOnFocus,
      bounces,
      "line-spacing": lineSpacing,
      "android-fullscreen-mode": androidFullscreenMode,
      "android-set-soft-input-mode": androidSetSoftInputMode,
      autoresize = true,
      ...nativeProps
    } = props;
    const control = useNativeTextControl({
      forwardedRef: ref,
      disabled,
      readOnly: readonly,
      bindinput,
      bindfocus,
      bindblur,
    });
    const resolvedMaxLength = useResolvedNativeMaxLength(
      maxlength,
      control.nativeInsertionMaxLength,
    );
    const isAndroid = isAndroidRuntime();
    const usesIOSAutoresizeWrapper = autoresize && isIOSRuntime();
    // Android native textarea는 CSS line-height를 무시한다. 실기기에서 관측한
    // native font metrics와 SEED line box의 차이를 line-spacing으로 보정한다.
    // 명시적인 값(0 포함)은 내부 기본값보다 우선한다.
    const resolvedLineSpacing =
      lineSpacing !== undefined
        ? lineSpacing
        : isAndroid
          ? ANDROID_TEXTAREA_DEFAULT_LINE_SPACING
          : undefined;
    const handleSelection = React.useCallback<NonNullable<NativeTextareaProps["bindselection"]>>(
      (event) => {
        "background only";

        control.handleSelectionChange(event.detail);
        bindselection?.(event);
      },
      [bindselection, control.handleSelectionChange],
    );
    const handleLayoutChange = React.useCallback<
      NonNullable<NativeTextareaProps["bindlayoutchange"]>
    >(
      (event) => {
        "background only";

        if (autoresize) {
          control.notifyLayoutChanged();
        }
        bindlayoutchange?.(event);
      },
      [autoresize, bindlayoutchange, control.notifyLayoutChanged],
    );
    const handleTextareaRootTap = React.useCallback<
      NonNullable<IntrinsicElements["view"]["bindtap"]>
    >(
      (event) => {
        "background only";

        if (control.disabled || event.target.uid !== event.currentTarget.uid) return;
        control.focusNativeControl();
      },
      [control.disabled, control.focusNativeControl],
    );

    if (control.readOnly) {
      const value = control.context.value;
      const isPlaceholder = value === "";

      return (
        <text
          ref={control.mergedRef}
          id={props.id}
          hidden={props.hidden}
          flatten={props.flatten}
          focusable={props.focusable}
          bindlayoutchange={props.bindlayoutchange}
          main-thread:bindlayoutchange={props["main-thread:bindlayoutchange"]}
          className={clsx(classes.value, classes.textareaValue, classes.textareaFixed, className)}
          style={getReadOnlyTextStyle({
            style: props.style,
            disabled: control.disabled,
            placeholder: isPlaceholder,
            multiline: true,
          })}
          {...getAccessibilityProps(props)}
        >
          {isPlaceholder ? props.placeholder : value}
        </text>
      );
    }

    // iOS textarea는 첫 편집에서 native contentSize를 높이에 반영한다.
    // 디자인 padding을 wrapper로 분리해 이때 padding만큼 높이가 중복되지 않게 한다.
    const textarea = (
      <textarea
        {...control.defaultValueProps}
        ref={control.mergedRef}
        className={clsx(
          classes.value,
          classes.textareaValue,
          !autoresize && classes.textareaFixed,
          usesIOSAutoresizeWrapper && classes.textareaNativeAutoresize,
          autoresize && !usesIOSAutoresizeWrapper && classes.textareaAndroidAutoresize,
          className,
        )}
        disabled={control.disabled}
        readonly={control.readOnly}
        show-soft-input-on-focus={showSoftInputOnFocus ?? true}
        bounces={bounces ?? (autoresize ? false : undefined)}
        line-spacing={resolvedLineSpacing}
        android-fullscreen-mode={androidFullscreenMode ?? false}
        android-set-soft-input-mode={androidSetSoftInputMode ?? "unspecified"}
        name={name ?? control.context.name}
        {...(resolvedMaxLength === undefined ? {} : { maxlength: resolvedMaxLength })}
        bindinput={control.handleInput}
        bindselection={handleSelection}
        bindfocus={control.handleFocus}
        bindblur={control.handleBlur}
        bindlayoutchange={usesIOSAutoresizeWrapper ? bindlayoutchange : handleLayoutChange}
        {...nativeProps}
      />
    );

    if (!usesIOSAutoresizeWrapper) return textarea;

    return (
      <view
        ignore-focus={true}
        className={clsx(classes.textareaRoot, classes.textareaAutoresizeRoot)}
        bindtap={handleTextareaRootTap}
        bindlayoutchange={control.notifyLayoutChanged}
      >
        {textarea}
      </view>
    );
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

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

import * as React from "@lynx-js/react";
import { useMainThreadRef } from "@lynx-js/react";
import type { IntrinsicElements, MainThread, NodesRef } from "@lynx-js/types";
import { textInput, type TextInputVariantProps } from "@seed-design/lynx-css/recipes/text-input";
import clsx from "clsx";

import type { LynxAccessibilityProps, LynxStyledElementProps, LynxTextRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useKeyboardAvoidanceActions } from "../KeyboardAvoidingScrollView/context";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";
import { useFieldContext } from "../Field/context";
import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED, TextFieldContext } from "./context";

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
    const [valueRevision, setValueRevision] = React.useState(0);
    const [localFocused, setLocalFocused] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
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

    const setValue = React.useCallback(
      (nextValue: string) => {
        "background only";

        if (!isControlled) {
          setUncontrolledValue(nextValue);
        } else {
          setValueRevision((revision) => revision + 1);
        }
        if (nextValue !== value) {
          onValueChange?.(nextValue);
        }
      },
      [isControlled, onValueChange, value],
    );

    const contextValue = React.useMemo(
      () => ({
        rootRef,
        value,
        valueRevision,
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
        valueRevision,
      ],
    );

    return (
      <TextFieldContext.Provider value={contextValue}>
        <ClassNamesProvider value={classes}>
          <view ref={mergedRef} className={clsx(classes.root, className)} {...nativeProps}>
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

interface NativeEditingState extends NativeSelectionDetail {
  isComposing: boolean;
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
  bindinput?: (event: NativeInputEvent | NativeTextareaEvent) => void;
  bindfocus?: NativeInputProps["bindfocus"] | NativeTextareaProps["bindfocus"];
  bindblur?: NativeInputProps["bindblur"] | NativeTextareaProps["bindblur"];
  mainThreadBindLayoutChange?: NativeInputProps["main-thread:bindlayoutchange"];
}

function useNativeTextControl({
  forwardedRef,
  bindinput,
  bindfocus,
  bindblur,
  mainThreadBindLayoutChange,
}: UseNativeTextControlOptions) {
  const textFieldContext = React.useContext(TextFieldContext);
  if (!textFieldContext) {
    throw new Error("TextField input components must be rendered inside <TextField.Root>.");
  }

  const fieldContext = useFieldContext({ strict: false });
  const keyboardAvoidance = useKeyboardAvoidanceActions();
  const nativeRef = React.useRef<NodesRef | null>(null);
  const didSyncInitialNativeValueRef = useMainThreadRef(false);
  const ownerRef = React.useRef<object>({});
  const lastNativeValueRef = React.useRef<string | null>(null);
  const didSkipInitialValueEffectRef = React.useRef(false);
  const [editingState, setEditingState] = React.useState<NativeEditingState>(() => ({
    selectionStart: textFieldContext.value.length,
    selectionEnd: textFieldContext.value.length,
    isComposing: false,
  }));
  const wasInsertionMaxLengthManaged = useWasDefined(textFieldContext.nativeInsertionMaxLength);

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

  React.useEffect(() => {
    if (!didSkipInitialValueEffectRef.current) {
      didSkipInitialValueEffectRef.current = true;
      return;
    }
    if (lastNativeValueRef.current === textFieldContext.value) return;

    const node = nativeRef.current;
    if (node) {
      syncNativeValue(node, textFieldContext.value);
    }
  }, [syncNativeValue, textFieldContext.value, textFieldContext.valueRevision]);

  React.useEffect(
    () => () => {
      keyboardAvoidance?.unregister(ownerRef.current);
    },
    [keyboardAvoidance],
  );

  const handleInput = React.useCallback(
    (event: NativeInputEvent | NativeTextareaEvent) => {
      "background only";

      const { value: nextValue, selectionStart, selectionEnd, isComposing } = event.detail;
      setEditingState({
        selectionStart,
        selectionEnd,
        isComposing: isComposing === true,
      });
      lastNativeValueRef.current = nextValue;
      textFieldContext.setValue(nextValue);
      bindinput?.(event);
    },
    [bindinput, textFieldContext],
  );

  const handleSelectionChange = React.useCallback((detail: NativeSelectionDetail) => {
    "background only";

    setEditingState((current) => ({
      ...current,
      selectionStart: detail.selectionStart,
      selectionEnd: detail.selectionEnd,
    }));
  }, []);

  const handleFocus = React.useCallback(
    (event: Parameters<NonNullable<NativeInputProps["bindfocus"]>>[0]) => {
      "background only";

      textFieldContext.setFocused(true);
      keyboardAvoidance?.focus({
        owner: ownerRef.current,
        nativeRef,
        controlRef: textFieldContext.rootRef,
        fieldRef: fieldContext?.rootRef,
        enabled: !textFieldContext.disabled && !textFieldContext.readOnly,
      });
      bindfocus?.(event);
    },
    [bindfocus, fieldContext, keyboardAvoidance, textFieldContext],
  );

  const handleBlur = React.useCallback(
    (event: Parameters<NonNullable<NativeInputProps["bindblur"]>>[0]) => {
      "background only";

      textFieldContext.setFocused(false);
      keyboardAvoidance?.blur(ownerRef.current);
      bindblur?.(event);
    },
    [bindblur, keyboardAvoidance, textFieldContext],
  );

  const notifyLayoutChanged = React.useCallback(() => {
    "background only";

    keyboardAvoidance?.layoutChanged(ownerRef.current);
  }, [keyboardAvoidance]);

  const initialNativeValue = textFieldContext.value;

  function handleMainThreadLayoutChange(event: MainThread.LayoutChangeEvent) {
    "main thread";

    if (!didSyncInitialNativeValueRef.current) {
      didSyncInitialNativeValueRef.current = true;
      if (initialNativeValue !== "") {
        void event.currentTarget.invoke("setValue", { value: initialNativeValue });
      }
    }

    if (typeof mainThreadBindLayoutChange === "function") {
      mainThreadBindLayoutChange(event);
    }
  }

  return {
    context: textFieldContext,
    mergedRef,
    handleMainThreadLayoutChange,
    handleInput,
    handleFocus,
    handleBlur,
    notifyLayoutChanged,
    handleSelectionChange,
    nativeInsertionMaxLength:
      wasInsertionMaxLengthManaged &&
      !editingState.isComposing &&
      editingState.selectionStart >= 0 &&
      editingState.selectionStart === editingState.selectionEnd &&
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

export interface TextFieldInputProps extends NativeTextControlProps {
  placeholder?: NativeInputProps["placeholder"];
  "confirm-type"?: NativeInputProps["confirm-type"];
  maxlength?: NativeInputProps["maxlength"];
  readonly?: NativeInputProps["readonly"];
  disabled?: NativeInputProps["disabled"];
  "show-soft-input-on-focus"?: NativeInputProps["show-soft-input-on-focus"];
  "input-filter"?: NativeInputProps["input-filter"];
  type?: NativeInputProps["type"];
  "ios-auto-correct"?: NativeInputProps["ios-auto-correct"];
  "ios-spell-check"?: NativeInputProps["ios-spell-check"];
  "android-fullscreen-mode"?: NativeInputProps["android-fullscreen-mode"];
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
    "main-thread:bindlayoutchange": mainThreadBindLayoutChange,
    ...nativeProps
  } = props;
  const control = useNativeTextControl({
    forwardedRef: ref,
    bindinput,
    bindfocus,
    bindblur,
    mainThreadBindLayoutChange,
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

  return (
    <input
      ref={control.mergedRef}
      main-thread:bindlayoutchange={control.handleMainThreadLayoutChange}
      className={clsx(classes.value, className)}
      disabled={disabled ?? control.context.disabled}
      readonly={readonly ?? control.context.readOnly}
      name={name ?? control.context.name}
      maxlength={resolvedMaxLength}
      bindinput={control.handleInput}
      bindselection={handleSelection}
      bindfocus={control.handleFocus}
      bindblur={control.handleBlur}
      {...nativeProps}
    />
  );
});
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps extends NativeTextControlProps {
  /** 내용에 맞춰 높이를 자동으로 조절한다. @defaultValue true */
  autoresize?: boolean;
  placeholder?: NativeTextareaProps["placeholder"];
  "confirm-type"?: NativeTextareaProps["confirm-type"];
  maxlength?: NativeTextareaProps["maxlength"];
  maxlines?: NativeTextareaProps["maxlines"];
  bounces?: NativeTextareaProps["bounces"];
  "line-spacing"?: NativeTextareaProps["line-spacing"];
  readonly?: NativeTextareaProps["readonly"];
  disabled?: NativeTextareaProps["disabled"];
  "show-soft-input-on-focus"?: NativeTextareaProps["show-soft-input-on-focus"];
  "input-filter"?: NativeTextareaProps["input-filter"];
  "enable-scroll-bar"?: NativeTextareaProps["enable-scroll-bar"];
  type?: NativeTextareaProps["type"];
  "ios-auto-correct"?: NativeTextareaProps["ios-auto-correct"];
  "ios-spell-check"?: NativeTextareaProps["ios-spell-check"];
  "android-fullscreen-mode"?: NativeTextareaProps["android-fullscreen-mode"];
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
      "main-thread:bindlayoutchange": mainThreadBindLayoutChange,
      autoresize = true,
      ...nativeProps
    } = props;
    const control = useNativeTextControl({
      forwardedRef: ref,
      bindinput,
      bindfocus,
      bindblur,
      mainThreadBindLayoutChange,
    });
    const resolvedMaxLength = useResolvedNativeMaxLength(
      maxlength,
      control.nativeInsertionMaxLength,
    );
    const handleSelection = React.useCallback<NonNullable<NativeTextareaProps["bindselection"]>>(
      (event) => {
        "background only";

        control.handleSelectionChange(event.detail);
        bindselection?.(event);
      },
      [bindselection, control.handleSelectionChange],
    );

    const textarea = (
      <textarea
        ref={control.mergedRef}
        main-thread:bindlayoutchange={control.handleMainThreadLayoutChange}
        className={clsx(
          classes.value,
          classes.textareaValue,
          autoresize && classes.textareaControl,
          className,
        )}
        disabled={disabled ?? control.context.disabled}
        readonly={readonly ?? control.context.readOnly}
        name={name ?? control.context.name}
        maxlength={resolvedMaxLength}
        bindinput={control.handleInput}
        bindselection={handleSelection}
        bindfocus={control.handleFocus}
        bindblur={control.handleBlur}
        {...nativeProps}
      />
    );

    if (!autoresize) return textarea;

    const mirrorValue = control.context.value.endsWith("\n")
      ? `${control.context.value}\u200b`
      : control.context.value || "\u200b";

    return (
      <view className={classes.textareaRoot}>
        <text
          className={clsx(classes.value, classes.textareaValue, classes.textareaMirror)}
          accessibility-elements-hidden={true}
          bindlayout={control.notifyLayoutChanged}
        >
          {mirrorValue}
        </text>
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

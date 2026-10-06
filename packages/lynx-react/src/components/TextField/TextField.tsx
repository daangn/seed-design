import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { textInput, type TextInputVariantProps } from "@seed-design/lynx-css/recipes/text-input";
import { textInput as textInputVars } from "@seed-design/lynx-css/vars/component";
import {
  TextFieldProvider,
  useTextField,
  useTextFieldInput,
  type AndroidSetSoftInputMode,
  type UseTextFieldProps,
} from "@seed-design/lynx-react-text-field";
import clsx from "clsx";

import type { LynxAccessibilityProps, LynxStyledElementProps, LynxTextRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

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
 * `@seed-design/lynx-react-text-field`의 값·Field 상태 위에 SEED recipe와 stroke를 조립한다.
 * Lynx native 입력은 value attribute를 제공하지 않으므로 하위 입력 슬롯이
 * `setValue` UI method로 controlled value를 동기화한다.
 */
export interface TextFieldRootProps
  extends Omit<TextInputVariantProps, "focused">,
    UseTextFieldProps,
    LynxStyledElementProps {}

export const TextFieldRoot = React.forwardRef<NodesRef, TextFieldRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = textInput.splitVariantProps(props);
    const {
      children,
      className,
      value,
      defaultValue,
      onValueChange,
      nativeInsertionMaxLength,
      required,
      name,
      ...nativeProps
    } = otherProps;
    const api = useTextField({
      value,
      defaultValue,
      onValueChange,
      nativeInsertionMaxLength,
      required,
      name,
      disabled: variantProps.disabled,
      invalid: variantProps.invalid,
      readOnly: variantProps.readOnly,
    });
    const classes = textInput({
      ...variantProps,
      variant: variantProps.variant ?? "outline",
      size: variantProps.size ?? "large",
      disabled: api.disabled,
      focused: api.focused && !api.readOnly,
      invalid: api.invalid,
      readOnly: api.readOnly,
    });
    const rootRef = api.rootRef;
    const mergedRef = React.useMemo(
      () => mergeProps({ ref: rootRef }, { ref: forwardedRef }).ref,
      [rootRef, forwardedRef],
    );

    return (
      <TextFieldProvider value={api}>
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
      </TextFieldProvider>
    );
  },
);
TextFieldRoot.displayName = "TextFieldRoot";

////////////////////////////////////////////////////////////////////////////////////

type NativeInputProps = IntrinsicElements["input"];
type NativeTextareaProps = IntrinsicElements["textarea"];

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
  const { className, ...otherProps } = props;
  const api = useTextFieldInput(otherProps, ref);

  if (api.readOnly) {
    const isPlaceholder = api.value === "";
    const displayValue = isPlaceholder
      ? props.placeholder
      : props.type === "password"
        ? Array.from(api.value, () => "•").join("")
        : api.value;

    return (
      <text
        {...api.readOnlyTextProps}
        className={clsx(classes.value, className)}
        style={getReadOnlyTextStyle({
          style: props.style,
          disabled: api.disabled,
          placeholder: isPlaceholder,
          multiline: false,
        })}
      >
        {displayValue}
      </text>
    );
  }

  return <input {...api.inputProps} className={clsx(classes.value, className)} />;
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
      bindlayoutchange,
      bounces,
      "line-spacing": lineSpacing,
      "android-fullscreen-mode": androidFullscreenMode,
      autoresize = true,
      ...otherProps
    } = props;
    const api = useTextFieldInput({ ...otherProps, bindlayoutchange }, ref);
    const { disabled, focus, notifyLayoutChanged } = api;
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
    const handleLayoutChange = React.useCallback<
      NonNullable<NativeTextareaProps["bindlayoutchange"]>
    >(
      (event) => {
        "background only";

        if (autoresize) {
          notifyLayoutChanged();
        }
        bindlayoutchange?.(event);
      },
      [autoresize, bindlayoutchange, notifyLayoutChanged],
    );
    const handleTextareaRootTap = React.useCallback<
      NonNullable<IntrinsicElements["view"]["bindtap"]>
    >(
      (event) => {
        "background only";

        if (disabled || event.target.uid !== event.currentTarget.uid) return;
        focus();
      },
      [disabled, focus],
    );

    if (api.readOnly) {
      const isPlaceholder = api.value === "";

      return (
        <text
          {...api.readOnlyTextProps}
          className={clsx(classes.value, classes.textareaValue, classes.textareaFixed, className)}
          style={getReadOnlyTextStyle({
            style: props.style,
            disabled,
            placeholder: isPlaceholder,
            multiline: true,
          })}
        >
          {isPlaceholder ? props.placeholder : api.value}
        </text>
      );
    }

    // iOS textarea는 첫 편집에서 native contentSize를 높이에 반영한다.
    // 디자인 padding을 wrapper로 분리해 이때 padding만큼 높이가 중복되지 않게 한다.
    const textarea = (
      <textarea
        {...api.inputProps}
        bindlayoutchange={usesIOSAutoresizeWrapper ? bindlayoutchange : handleLayoutChange}
        className={clsx(
          classes.value,
          classes.textareaValue,
          !autoresize && classes.textareaFixed,
          usesIOSAutoresizeWrapper && classes.textareaNativeAutoresize,
          autoresize && !usesIOSAutoresizeWrapper && classes.textareaAndroidAutoresize,
          className,
        )}
        bounces={bounces ?? (autoresize ? false : undefined)}
        line-spacing={resolvedLineSpacing}
        android-fullscreen-mode={androidFullscreenMode ?? false}
      />
    );

    if (!usesIOSAutoresizeWrapper) return textarea;

    return (
      <view
        ignore-focus={true}
        className={clsx(classes.textareaRoot, classes.textareaAutoresizeRoot)}
        bindtap={handleTextareaRootTap}
        bindlayoutchange={notifyLayoutChanged}
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
      <InternalIcon
        {...mergeProps({ ref, "accessibility-elements-hidden": true }, otherProps)}
        className={clsx(classes.prefixIcon, className)}
      />
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
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classes.prefixText, className)}
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
      <InternalIcon
        {...mergeProps({ ref, "accessibility-elements-hidden": true }, otherProps)}
        className={clsx(classes.suffixIcon, className)}
      />
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
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classes.suffixText, className)}
      >
        {children}
      </text>
    );
  },
);
TextFieldSuffixText.displayName = "TextFieldSuffixText";

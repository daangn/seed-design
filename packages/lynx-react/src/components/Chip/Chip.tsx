import * as React from "@lynx-js/react";
import clsx from "clsx";

import { chip, type ChipVariantProps } from "@seed-design/lynx-css/recipes/chip";
import { useCheckbox, type UseCheckboxProps } from "@seed-design/lynx-react-checkbox";
import {
  RadioGroupRoot as HeadlessRadioGroupRoot,
  useRadioGroupItem,
  type UseRadioGroupProps,
} from "@seed-design/lynx-react-radio-group";

import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
import {
  AccessibilityElementScope,
  getAccessibleText,
  useInsideAccessibilityElement,
  useLabelTextAccessibilityProps,
} from "../../utils/accessibility";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import {
  IconRequired,
  IconSlotProvider,
  PrefixIcon,
  SuffixIcon,
  type PrefixIconProps,
  type SuffixIconProps,
} from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(chip);

type ChipPublicVariantProps = Omit<ChipVariantProps, "selected" | "pressed">;

interface ChipRootViewProps
  extends ChipVariantProps,
    Omit<LynxHostProps<"view">, keyof ChipVariantProps> {}

const ChipRootView = React.forwardRef<unknown, ChipRootViewProps>((props, ref) => {
  const [variantProps, otherProps] = chip.splitVariantProps(props);
  const classes = chip(variantProps);
  const { children, className, ...nativeProps } = otherProps;
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        icon: classes.icon,
        prefixIcon: classes.prefixIcon,
        suffixIcon: classes.suffixIcon,
      },
      deps: [
        variantProps.variant,
        variantProps.size,
        variantProps.layout,
        variantProps.selected,
        variantProps.pressed,
        variantProps.disabled,
      ],
    }),
    [
      classes.icon,
      classes.prefixIcon,
      classes.suffixIcon,
      variantProps.variant,
      variantProps.size,
      variantProps.layout,
      variantProps.selected,
      variantProps.pressed,
      variantProps.disabled,
    ],
  );

  return (
    <ClassNamesProvider value={classes}>
      <IconSlotProvider value={iconSlotContextValue}>
        <IconRequired enabled={variantProps.layout === "iconOnly"}>
          <view
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </IconRequired>
      </IconSlotProvider>
    </ClassNamesProvider>
  );
});
ChipRootView.displayName = "ChipRootView";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HTML button 속성 및 native form 제출
 * - 키보드 focus / focusVisible
 * - `asChild`
 */
export interface ChipButtonProps
  extends ChipPublicVariantProps,
    Omit<LynxHostProps<"view">, keyof ChipPublicVariantProps> {
  disabled?: boolean;
}

export const ChipButton = React.forwardRef<unknown, ChipButtonProps>((props, ref) => {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    disabled = false,
    "accessibility-element": accessibilityElementProp,
    "accessibility-label": accessibilityLabelProp,
    children,
    ...restProps
  } = props;
  const insideAccessibilityElement = useInsideAccessibilityElement();
  const accessibilityElement = accessibilityElementProp ?? !insideAccessibilityElement;
  const accessibilityLabel =
    accessibilityLabelProp ??
    (insideAccessibilityElement ? undefined : getAccessibleText(children));
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  if (
    process.env.NODE_ENV !== "production" &&
    !insideAccessibilityElement &&
    accessibilityElement &&
    !accessibilityLabel
  ) {
    console.warn("ChipButton: `accessibility-label` is required when children have no text.");
  }

  return (
    <ChipRootView
      {...mergeProps(
        {
          disabled,
          selected: false,
          pressed,
          flatten: false,
          "accessibility-element": accessibilityElement,
          "accessibility-label": accessibilityLabel || undefined,
          "accessibility-role-description": "button",
          "accessibility-traits": disabled ? ("disabled" as const) : undefined,
        },
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        pressHandlers,
        restProps,
        ref ? { ref } : {},
      )}
    >
      {accessibilityElement ? (
        <AccessibilityElementScope>{children}</AccessibilityElementScope>
      ) : (
        children
      )}
    </ChipRootView>
  );
});
ChipButton.displayName = "ChipButton";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-checkbox`의 선택 상태·press·접근성 위에 chip recipe를 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / inputProps / name / value: Lynx에 HTML form 제출 모델이 없음
 * - raw DOM `onChange`: `onCheckedChange`로 대체
 * - `indeterminate`: chip recipe에 일부 선택 외형이 없음
 */
export interface ChipToggleProps
  extends ChipButtonProps,
    Pick<UseCheckboxProps, "checked" | "defaultChecked" | "onCheckedChange"> {}

export const ChipToggle = React.forwardRef<unknown, ChipToggleProps>((props, ref) => {
  const {
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabelProp,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    children,
    ...restProps
  } = props;
  const insideAccessibilityElement = useInsideAccessibilityElement();
  const accessibilityLabel =
    accessibilityLabelProp ??
    (insideAccessibilityElement ? undefined : getAccessibleText(children));
  const api = useCheckbox({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement ?? !insideAccessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  if (
    process.env.NODE_ENV !== "production" &&
    !insideAccessibilityElement &&
    rootProps["accessibility-element"] &&
    !accessibilityLabel
  ) {
    console.warn("ChipToggle: `accessibility-label` is required when children have no text.");
  }

  return (
    <ChipRootView
      {...mergeProps(
        {
          disabled,
          selected: api.checked,
          pressed: api.pressed,
          flatten: false,
          "accessibility-label": accessibilityLabel || undefined,
        },
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        rootProps,
        restProps,
        ref ? { ref } : {},
      )}
    >
      {rootProps["accessibility-element"] ? (
        <AccessibilityElementScope>{children}</AccessibilityElementScope>
      ) : (
        children
      )}
    </ChipRootView>
  );
});
ChipToggle.displayName = "ChipToggle";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-radio-group`의 Root입니다. 단일 선택 값과 `radiogroup` 접근성 의미를
 * 제공하고 스타일은 갖지 않습니다.
 *
 * 웹 대비 미지원 기능:
 * - name / form / required: Lynx에 HTML form 제출 모델이 없음
 * - `invalid`: chip recipe에 오류 외형이 없음
 */
export interface ChipRadioRootProps
  extends Omit<UseRadioGroupProps, "invalid">,
    Omit<LynxHostProps<"view">, keyof UseRadioGroupProps> {}

export const ChipRadioRoot = React.forwardRef<unknown, ChipRadioRootProps>((props, ref) => {
  const { children, ...otherProps } = props;

  return (
    <HeadlessRadioGroupRoot
      {...(ref ? { ref } : {})}
      {...mergeProps({ "accessibility-element": false }, otherProps)}
    >
      {children}
    </HeadlessRadioGroupRoot>
  );
});
ChipRadioRoot.displayName = "ChipRadioRoot";

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-radio-group`의 Item 선택·press·접근성 위에 chip recipe를 조립한다.
 * `Chip.RadioRoot` 안에서만 렌더링합니다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / inputProps: Lynx에 HTML form 제출 모델이 없음
 * - raw DOM `onChange`: `Chip.RadioRoot`의 `onValueChange`로 대체
 */
export interface ChipRadioItemProps extends ChipButtonProps {
  value: string;
}

export const ChipRadioItem = React.forwardRef<unknown, ChipRadioItemProps>((props, ref) => {
  const {
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabelProp,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    children,
    ...restProps
  } = props;
  const insideAccessibilityElement = useInsideAccessibilityElement();
  const accessibilityLabel =
    accessibilityLabelProp ??
    (insideAccessibilityElement ? undefined : getAccessibleText(children));
  const api = useRadioGroupItem({
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement ?? !insideAccessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...itemProps } = api.itemProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  if (
    process.env.NODE_ENV !== "production" &&
    !insideAccessibilityElement &&
    itemProps["accessibility-element"] &&
    !accessibilityLabel
  ) {
    console.warn("ChipRadioItem: `accessibility-label` is required when children have no text.");
  }

  return (
    <ChipRootView
      {...mergeProps(
        {
          disabled: api.disabled,
          selected: api.checked,
          pressed: api.pressed,
          flatten: false,
          "accessibility-label": accessibilityLabel || undefined,
        },
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        itemProps,
        restProps,
        ref ? { ref } : {},
      )}
    >
      {itemProps["accessibility-element"] ? (
        <AccessibilityElementScope>{children}</AccessibilityElementScope>
      ) : (
        children
      )}
    </ChipRootView>
  );
});
ChipRadioItem.displayName = "ChipRadioItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipLabelProps extends LynxHostProps<"text"> {}

export const ChipLabel = React.forwardRef<unknown, ChipLabelProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  const labelAccessibilityProps = useLabelTextAccessibilityProps();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, labelAccessibilityProps, nativeProps)}
      className={clsx(classes.label, className)}
    >
      {children}
    </text>
  );
});
ChipLabel.displayName = "ChipLabel";

export interface ChipPrefixIconProps extends PrefixIconProps {}

export const ChipPrefixIcon = React.forwardRef<unknown, ChipPrefixIconProps>((props, ref) => (
  <PrefixIcon {...mergeProps(props, ref ? { ref } : {})} />
));
ChipPrefixIcon.displayName = "ChipPrefixIcon";

export interface ChipPrefixAvatarProps extends LynxHostProps<"view"> {}

export const ChipPrefixAvatar = React.forwardRef<unknown, ChipPrefixAvatarProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.prefixAvatar, className)}
    >
      {children}
    </view>
  );
});
ChipPrefixAvatar.displayName = "ChipPrefixAvatar";

export interface ChipSuffixIconProps extends SuffixIconProps {}

export const ChipSuffixIcon = React.forwardRef<unknown, ChipSuffixIconProps>((props, ref) => (
  <SuffixIcon {...mergeProps(props, ref ? { ref } : {})} />
));
ChipSuffixIcon.displayName = "ChipSuffixIcon";

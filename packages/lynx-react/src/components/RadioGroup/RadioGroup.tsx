import * as React from "@lynx-js/react";
import { isValidElement, type ReactElement } from "@lynx-js/react";
import clsx from "clsx";

import { radio } from "@seed-design/lynx-css/recipes/radio";
import type { RadioVariantProps } from "@seed-design/lynx-css/recipes/radio";
import { radiomark } from "@seed-design/lynx-css/recipes/radiomark";
import type { RadiomarkVariantProps } from "@seed-design/lynx-css/recipes/radiomark";
import { radioGroup } from "@seed-design/lynx-css/recipes/radio-group";
import {
  RadioGroupItemControl as HeadlessRadioGroupItemControl,
  RadioGroupItemProvider,
  useRadioGroupItem,
  useRadioGroupItemContext,
  type UseRadioGroupItemContext,
  type UseRadioGroupItemProps,
} from "@seed-design/lynx-react-radio-group";

import { ScaleFeedbackContentContext } from "../../contexts";
import { useScaleFeedback, type ScaleFeedbackTargetProps } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { InternalIcon } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-radio-group`의 선택·press·접근성 위에 SEED recipe, Scale Feedback,
 * Indicator·Label 표현을 조립한다. 선택 상태는 `RadioGroupField.Root`나
 * `@seed-design/lynx-react-radio-group`의 `RadioGroup.Root`가 제공한다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / form: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 선택 이벤트는 onValueChange로만 노출
 *
 * Indicator 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를
 * 받는다. 내부에서 `<image tint-color=...>` 로 렌더되므로 `useIconColor` 훅이
 * recipe 의 `color` 토큰을 `tint-color` 로 동기화한다.
 */

type RadioItemVariantProps = Pick<RadioVariantProps, "weight" | "size">;
type RadiomarkItemVariantProps = Pick<RadiomarkVariantProps, "tone" | "size">;

interface StyledRadioGroupItemContextValue extends UseRadioGroupItemContext {
  radioVariantProps: RadioItemVariantProps;
  radiomarkVariantProps: RadiomarkItemVariantProps;
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
}

function isStyledRadioGroupItemContext(
  context: UseRadioGroupItemContext,
): context is StyledRadioGroupItemContextValue {
  return "radiomarkVariantProps" in context;
}

export function useStyledRadioGroupItemContext(consumer: string): StyledRadioGroupItemContextValue {
  const context = useRadioGroupItemContext();
  if (!isStyledRadioGroupItemContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <RadioGroupItem/>.`);
  }
  return context;
}

interface RadiomarkControlContextValue {
  iconClassName: string;
  radiomarkVariantProps: RadiomarkVariantProps;
}

const RadiomarkControlContext = React.createContext<RadiomarkControlContextValue | null>(null);

function useRadiomarkControlContext(consumer: string): RadiomarkControlContextValue {
  const ctx = React.useContext(RadiomarkControlContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupItemControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupRootProps extends LynxStyledElementProps, LynxAccessibilityProps {}

/**
 * Item을 배치하는 `radioGroup` recipe view입니다. 선택 상태를 소유하지 않으므로
 * `RadioGroupField.Root`나 headless `RadioGroup.Root` 안에서 사용합니다.
 */
export const RadioGroupRoot = React.forwardRef<unknown, RadioGroupRootProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(radioGroup().root, className)}
    >
      {children}
    </view>
  );
});
RadioGroupRoot.displayName = "RadioGroupRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemProps
  extends RadioItemVariantProps,
    RadiomarkItemVariantProps,
    Pick<UseRadioGroupItemProps, "value" | "disabled">,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {}

export const RadioGroupItem = React.forwardRef<unknown, RadioGroupItemProps>((props, ref) => {
  const {
    value,
    disabled,
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...restProps
  } = props;
  const [{ radio: radioVariantProps, radiomark: radiomarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { radio, radiomark });
  const api = useRadioGroupItem({
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  // Press state follows the Scale Feedback touch handlers, as before the split.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...itemProps } = api.itemProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  const rootClassName = radio({ ...radioVariantProps, disabled: api.disabled }).root;

  const contextValue = React.useMemo<StyledRadioGroupItemContextValue>(
    () => ({ ...api, radioVariantProps, radiomarkVariantProps, scaleFeedbackTargetProps }),
    [api, radioVariantProps, radiomarkVariantProps, scaleFeedbackTargetProps],
  );

  return (
    <RadioGroupItemProvider value={contextValue}>
      <view
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          scaleFeedbackTriggerProps,
          nativeProps,
          itemProps,
        )}
        className={clsx(rootClassName, className)}
      >
        {children}
      </view>
    </RadioGroupItemProvider>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemControlProps
  extends RadiomarkItemVariantProps,
    LynxStyledElementProps {}

export const RadioGroupItemControl = React.forwardRef<unknown, RadioGroupItemControlProps>(
  (props, ref) => {
    const [variantProps, restProps] = radiomark.splitVariantProps(props);
    const { children, className, ...nativeProps } = restProps;
    // Headless Item(예: List.RadioItem) 아래에서도 상태를 표시한다. styled Item의 variant
    // 기본값과 scale target은 있을 때만 쓴다.
    const itemContext = useRadioGroupItemContext();
    const styledContext = isStyledRadioGroupItemContext(itemContext) ? itemContext : null;
    const hasScaledContent = React.useContext(ScaleFeedbackContentContext);
    const radiomarkVariantProps: RadiomarkVariantProps = {
      ...styledContext?.radiomarkVariantProps,
      ...variantProps,
      checked: itemContext.checked,
      disabled: itemContext.disabled,
      pressed: itemContext.pressed,
    };
    const classes = radiomark(radiomarkVariantProps);
    const controlClassName = styledContext
      ? radio({ ...styledContext.radioVariantProps }).control
      : undefined;

    return (
      <RadiomarkControlContext.Provider
        value={{ iconClassName: classes.icon, radiomarkVariantProps }}
      >
        <HeadlessRadioGroupItemControl
          {...mergeProps(
            ref ? { ref: ref as LynxViewRef } : {},
            !hasScaledContent ? (styledContext?.scaleFeedbackTargetProps ?? {}) : {},
            nativeProps,
          )}
          className={clsx(classes.root, controlClassName, className)}
          {...(!hasScaledContent ? { flatten: false } : {})}
        >
          {children}
        </HeadlessRadioGroupItemControl>
      </RadiomarkControlContext.Provider>
    );
  },
);
RadioGroupItemControl.displayName = "RadioGroupItemControl";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemIndicatorProps
  extends Pick<LynxStyledElementProps, "className" | "style"> {
  /** Icon rendered when not checked. Optional — falls back to default `<view>` dot when omitted. */
  unchecked?: ReactElement<LynxIconElementProps>;
  /** Icon rendered when the item is checked. Optional — falls back to default `<view>` dot when omitted. */
  checked?: ReactElement<LynxIconElementProps>;
}

export function RadioGroupItemIndicator(props: RadioGroupItemIndicatorProps) {
  const { unchecked, checked: checkedIcon, className, style } = props;
  const itemContext = useRadioGroupItemContext();
  const { iconClassName, radiomarkVariantProps } =
    useRadiomarkControlContext("RadioGroupItemIndicator");

  const icon = itemContext.checked ? checkedIcon : unchecked;

  // 사용자가 custom icon 을 주지 않으면 default `<view>` 로 동그란 점을 그린다.
  // radiomark.icon recipe 가 borderRadius/backgroundColor/width/height 를 적용해
  // 라디오의 inner dot 모양을 재현. 웹 RadioGroup 의 default `<svg><circle/></svg>` 동작과 일치.
  if (!icon || !isValidElement<LynxIconElementProps>(icon)) {
    return <view className={clsx(iconClassName, className)} style={style} />;
  }

  return (
    <InternalIcon
      icon={icon}
      className={clsx(iconClassName, className)}
      style={style}
      deps={[
        itemContext.checked,
        itemContext.disabled,
        itemContext.pressed,
        radiomarkVariantProps.tone,
        radiomarkVariantProps.size,
      ]}
    />
  );
}
RadioGroupItemIndicator.displayName = "RadioGroupItemIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemLabelProps extends LynxStyledElementProps {}

export const RadioGroupItemLabel = React.forwardRef<unknown, RadioGroupItemLabelProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const itemContext = useStyledRadioGroupItemContext("RadioGroupItemLabel");
    const labelClassName = radio({
      ...itemContext.radioVariantProps,
      disabled: itemContext.disabled,
    }).label;

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(labelClassName, className)}
      >
        {children}
      </text>
    );
  },
);
RadioGroupItemLabel.displayName = "RadioGroupItemLabel";

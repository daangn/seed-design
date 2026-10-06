import * as React from "@lynx-js/react";
import { isValidElement, type ReactElement } from "@lynx-js/react";
import clsx from "clsx";

import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import type { CheckboxVariantProps } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import type { CheckmarkVariantProps } from "@seed-design/lynx-css/recipes/checkmark";
import { checkboxGroup } from "@seed-design/lynx-css/recipes/checkbox-group";
import {
  CheckboxProvider,
  CheckboxControl as HeadlessCheckboxControl,
  useCheckbox,
  useCheckboxContext,
  type UseCheckboxProps,
  type UseCheckboxReturn,
} from "@seed-design/lynx-react-checkbox";

import { ScaleFeedbackContentContext } from "../../contexts";
import { useScaleFeedback, type ScaleFeedbackTargetProps } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
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
 * `@seed-design/lynx-react-checkbox`의 상태·press·접근성 위에 SEED recipe, scale feedback,
 * 아이콘과 Label 표현을 조립한다. 눌림 색은 recipe의 `:active` selector가 Main Thread에서 적용한다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / value / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 토글 이벤트는 onCheckedChange로만 노출
 * - weight="default" | "stronger" 호환 매핑: Lynx 신규 컴포넌트이므로 처음부터 "regular" | "bold" 만 노출
 * - Indicator ref: `<image>` 아이콘을 렌더링하는 함수 컴포넌트라 ref를 받지 않음
 *
 * Indicator 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를
 * 받는다. 내부에서 `<image tint-color=...>` 로 렌더되므로 `useIconColor` 훅이
 * recipe 의 `color` 토큰을 `tint-color` 로 동기화한다. raw SVG 주입은 Lynx 범위 밖.
 */

interface StyledCheckboxContextValue extends UseCheckboxReturn {
  checkboxVariantProps: CheckboxVariantProps;
  checkmarkVariantProps: CheckmarkVariantProps;
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
}

function isStyledCheckboxContext(
  context: UseCheckboxReturn | null,
): context is StyledCheckboxContextValue {
  return context !== null && "checkmarkVariantProps" in context;
}

export function useStyledCheckboxContext(consumer: string): StyledCheckboxContextValue {
  const context = useCheckboxContext({ strict: false });
  if (!isStyledCheckboxContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <CheckboxRoot/>.`);
  }
  return context;
}

interface CheckmarkControlContextValue {
  iconClassName: string;
  checkmarkVariantProps: CheckmarkVariantProps;
}

const CheckmarkControlContext = React.createContext<CheckmarkControlContextValue | null>(null);

function useCheckmarkControlContext(consumer: string): CheckmarkControlContextValue {
  const ctx = React.useContext(CheckmarkControlContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <CheckboxControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxRootProps
  extends CheckboxVariantProps,
    Omit<CheckmarkVariantProps, "size" | "checked" | "disabled" | "indeterminate">,
    Pick<
      UseCheckboxProps,
      "checked" | "defaultChecked" | "indeterminate" | "disabled" | "onCheckedChange"
    >,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const CheckboxRoot = React.forwardRef<unknown, CheckboxRootProps>((props, ref) => {
  const {
    children,
    className,
    checked,
    defaultChecked,
    indeterminate,
    disabled = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, restNativeProps] =
    splitMultipleVariantsProps(restProps, { checkbox, checkmark });
  const {
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = restNativeProps;

  const api = useCheckbox({
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    "accessibility-element": accessibilityElement,
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

  const rootClassName = checkbox({ ...checkboxVariantProps, disabled }).root;

  const contextValue = React.useMemo<StyledCheckboxContextValue>(
    () => ({ ...api, checkboxVariantProps, checkmarkVariantProps, scaleFeedbackTargetProps }),
    [api, checkboxVariantProps, checkmarkVariantProps, scaleFeedbackTargetProps],
  );

  return (
    <CheckboxProvider value={contextValue}>
      <view
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          scaleFeedbackTriggerProps,
          rootProps,
          nativeProps,
        )}
        className={clsx(rootClassName, className)}
      >
        {children}
      </view>
    </CheckboxProvider>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxControlProps
  extends Pick<CheckmarkVariantProps, "tone" | "variant" | "size">,
    LynxStyledElementProps {}

export const CheckboxControl = React.forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const [variantProps, restProps] = checkmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  // Headless Root(예: List.CheckboxItem) 아래에서도 상태를 표시한다. styled Root의 variant
  // 기본값과 scale target은 있을 때만 쓴다.
  const context = useCheckboxContext();
  const styledContext = isStyledCheckboxContext(context) ? context : null;
  const hasScaledContent = React.useContext(ScaleFeedbackContentContext);
  const checkmarkVariantProps: CheckmarkVariantProps = {
    ...styledContext?.checkmarkVariantProps,
    ...variantProps,
    checked: context.checked,
    disabled: context.disabled,
    indeterminate: context.indeterminate,
  };
  const classes = checkmark(checkmarkVariantProps);
  const checkboxControlClassName = checkbox({
    ...styledContext?.checkboxVariantProps,
    disabled: context.disabled,
  }).control;
  // Lynx는 opaque color와 transparent black 사이의 background-color를 보간할 때
  // 중간 RGB가 검게 탁해진다. ghost는 선택 전·후 눌림 색을 고정한 두 overlay의
  // opacity만 전환한다(`:active` selector는 checkbox recipe에 있다).
  const isGhost = checkmarkVariantProps.variant === "ghost";

  return (
    <CheckmarkControlContext.Provider
      value={{ iconClassName: classes.icon, checkmarkVariantProps }}
    >
      <HeadlessCheckboxControl
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          !hasScaledContent ? (styledContext?.scaleFeedbackTargetProps ?? {}) : {},
          nativeProps,
        )}
        className={clsx(checkboxControlClassName, classes.root, className)}
      >
        {isGhost ? <view className={classes.background} /> : null}
        {isGhost ? <view className={classes.selectedBackground} /> : null}
        {children}
      </HeadlessCheckboxControl>
    </CheckmarkControlContext.Provider>
  );
});
CheckboxControl.displayName = "CheckboxControl";

////////////////////////////////////////////////////////////////////////////////////

/**
 * 선택 상태에 맞는 아이콘을 렌더링한다. indeterminate 아이콘이 checked 아이콘보다 우선한다.
 * React `Checkbox.Indicator`와 달리 ref를 받지 않는다.
 */
export interface CheckboxIndicatorProps
  extends Pick<LynxStyledElementProps, "className" | "style"> {
  /** Icon rendered when neither checked nor indeterminate. Optional. */
  unchecked?: ReactElement<LynxIconElementProps>;
  /** Icon rendered when `checked=true` and `indeterminate=false`. */
  checked: ReactElement<LynxIconElementProps>;
  /** Icon rendered when `indeterminate=true`. */
  indeterminate?: ReactElement<LynxIconElementProps>;
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const {
    unchecked,
    checked: checkedIcon,
    indeterminate: indeterminateIcon,
    className,
    style,
  } = props;
  const context = useCheckboxContext();
  const { iconClassName, checkmarkVariantProps } = useCheckmarkControlContext("CheckboxIndicator");

  if (process.env.NODE_ENV !== "production" && context.indeterminate && !indeterminateIcon) {
    console.warn(
      "[seed-design] CheckboxIndicator: `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
    );
  }

  const icon = context.indeterminate
    ? indeterminateIcon
    : context.checked
      ? checkedIcon
      : unchecked;
  if (!icon || !isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <InternalIcon
      icon={icon}
      className={clsx(iconClassName, className)}
      style={style}
      deps={[
        context.checked,
        context.indeterminate,
        context.disabled,
        checkmarkVariantProps.tone,
        checkmarkVariantProps.variant,
        checkmarkVariantProps.size,
      ]}
    />
  );
}
CheckboxIndicator.displayName = "CheckboxIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxLabelProps extends LynxStyledElementProps {}

export const CheckboxLabel = React.forwardRef<unknown, CheckboxLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledCheckboxContext("CheckboxLabel");
  const labelClassName = checkbox({
    ...context.checkboxVariantProps,
    disabled: context.disabled,
  }).label;

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(labelClassName, className)}
    >
      {children}
    </text>
  );
});
CheckboxLabel.displayName = "CheckboxLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxGroupProps extends LynxStyledElementProps {}

export const CheckboxGroup = React.forwardRef<unknown, CheckboxGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = checkboxGroup();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.root, className)}
    >
      {children}
    </view>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

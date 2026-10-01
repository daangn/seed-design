import * as React from "@lynx-js/react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";
import {
  SwitchControl as HeadlessSwitchControl,
  SwitchProvider,
  SwitchThumb as HeadlessSwitchThumb,
  useSwitch,
  useSwitchContext,
  type UseSwitchContext,
  type UseSwitchProps,
} from "@seed-design/lynx-react-switch";

import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { useScaleFeedback, type ScaleFeedbackTargetProps } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import { ScaleFeedbackContentContext } from "../../contexts";

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-switch`의 상태·press·접근성 위에 SEED recipe, Scale Feedback과
 * Label 표현을 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / value / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 토글 이벤트는 onCheckedChange로만 노출
 *
 * 추후 rootage 토큰 확장 시 추가 예정:
 * - pressed boolean variant: switchmark rootage spec 에 pressed 상태가 추가되면
 *   switchmark recipe 와 Switch 컴포넌트에 boolean variant 로 노출.
 */

interface StyledSwitchContextValue extends UseSwitchContext {
  switchVariantProps: SwitchVariantProps;
  switchmarkVariantProps: SwitchmarkVariantProps;
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
}

function isStyledSwitchContext(context: UseSwitchContext): context is StyledSwitchContextValue {
  return "switchmarkVariantProps" in context;
}

export function useStyledSwitchContext(consumer: string): StyledSwitchContextValue {
  const context = useSwitchContext();
  if (!isStyledSwitchContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <SwitchRoot/>.`);
  }
  return context;
}

interface SwitchmarkControlContextValue {
  thumbClassName: string;
  switchmarkVariantProps: SwitchmarkVariantProps;
}

const SwitchmarkControlContext = React.createContext<SwitchmarkControlContextValue | null>(null);

function useSwitchmarkControlContext(consumer: string): SwitchmarkControlContextValue {
  const ctx = React.useContext(SwitchmarkControlContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <SwitchControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchRootProps
  extends Omit<SwitchVariantProps, "disabled">,
    Omit<SwitchmarkVariantProps, "size" | "checked" | "disabled">,
    Pick<UseSwitchProps, "checked" | "defaultChecked" | "disabled" | "onCheckedChange">,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const SwitchRoot = React.forwardRef<unknown, SwitchRootProps>((props, ref) => {
  const {
    children,
    className,
    checked,
    defaultChecked,
    disabled = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { switch: switchStyle, switchmark });

  const api = useSwitch({ checked, defaultChecked, onCheckedChange, disabled });
  // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  const rootClassName = switchStyle({ ...switchVariantProps, disabled }).root;

  const contextValue = React.useMemo<StyledSwitchContextValue>(
    () => ({ ...api, switchVariantProps, switchmarkVariantProps, scaleFeedbackTargetProps }),
    [api, switchVariantProps, switchmarkVariantProps, scaleFeedbackTargetProps],
  );

  return (
    <SwitchProvider value={contextValue}>
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
    </SwitchProvider>
  );
});
SwitchRoot.displayName = "SwitchRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchControlProps
  extends Pick<SwitchmarkVariantProps, "tone" | "size">,
    // Keep the scale target's Android View even if shared props later expose flatten.
    Omit<LynxStyledElementProps, "flatten"> {}

export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const [variantProps, restProps] = switchmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const context = useStyledSwitchContext("SwitchControl");
  const hasScaledContent = React.useContext(ScaleFeedbackContentContext);
  const switchmarkVariantProps: SwitchmarkVariantProps = {
    ...context.switchmarkVariantProps,
    ...variantProps,
    checked: context.checked,
    disabled: context.disabled,
  };
  const classes = switchmark(switchmarkVariantProps);

  return (
    <SwitchmarkControlContext.Provider
      value={{ thumbClassName: classes.thumb, switchmarkVariantProps }}
    >
      <HeadlessSwitchControl
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          !hasScaledContent ? context.scaleFeedbackTargetProps : {},
          nativeProps,
        )}
        className={clsx(classes.root, className)}
        flatten={false}
      >
        {children}
      </HeadlessSwitchControl>
    </SwitchmarkControlContext.Provider>
  );
});
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps extends Pick<LynxStyledElementProps, "className" | "style"> {}

export const SwitchThumb = React.forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const { thumbClassName } = useSwitchmarkControlContext("SwitchThumb");

  return (
    <HeadlessSwitchThumb
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(thumbClassName, className)}
    />
  );
});
SwitchThumb.displayName = "SwitchThumb";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchLabelProps extends LynxStyledElementProps {}

export const SwitchLabel = React.forwardRef<unknown, SwitchLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledSwitchContext("SwitchLabel");
  const labelClassName = switchStyle({
    ...context.switchVariantProps,
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
SwitchLabel.displayName = "SwitchLabel";

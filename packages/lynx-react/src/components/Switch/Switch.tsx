import * as React from "@lynx-js/react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";

import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import type { LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";

/**
 * @platform Lynx
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

interface SwitchContextValue {
  checked: boolean;
  disabled: boolean;
  switchVariantProps: SwitchVariantProps;
  switchmarkVariantProps: SwitchmarkVariantProps;
  toggle: () => void;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext(consumer: string): SwitchContextValue {
  const ctx = React.useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <SwitchRoot/>.`);
  }
  return ctx;
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
  extends SwitchVariantProps,
    Omit<SwitchmarkVariantProps, "size">,
    LynxStyledElementProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const SwitchRoot = React.forwardRef<unknown, SwitchRootProps>((props, ref) => {
  const {
    children,
    className,
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { switch: switchStyle, switchmark });

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const toggle = React.useCallback(() => setChecked(!checked), [checked, setChecked]);

  const { pressed: _pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: toggle,
  });

  const rootClassName = switchStyle({ ...switchVariantProps, disabled }).root;

  const contextValue = React.useMemo<SwitchContextValue>(
    () => ({
      checked,
      disabled,
      switchVariantProps,
      switchmarkVariantProps,
      toggle,
    }),
    [checked, disabled, switchVariantProps, switchmarkVariantProps, toggle],
  );

  return (
    <SwitchContext.Provider value={contextValue}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(rootClassName, className)}
        {...pressHandlers}
        {...nativeProps}
      >
        {children}
      </view>
    </SwitchContext.Provider>
  );
});
SwitchRoot.displayName = "SwitchRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchControlProps
  extends Pick<SwitchmarkVariantProps, "tone" | "size">,
    LynxStyledElementProps {}

export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const [variantProps, restProps] = switchmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const context = useSwitchContext("SwitchControl");
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
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
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
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(thumbClassName, className)}
      {...nativeProps}
    />
  );
});
SwitchThumb.displayName = "SwitchThumb";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchLabelProps extends LynxStyledElementProps {}

export const SwitchLabel = React.forwardRef<unknown, SwitchLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSwitchContext("SwitchLabel");
  const labelClassName = switchStyle({
    ...context.switchVariantProps,
    disabled: context.disabled,
  }).label;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(labelClassName, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SwitchLabel.displayName = "SwitchLabel";

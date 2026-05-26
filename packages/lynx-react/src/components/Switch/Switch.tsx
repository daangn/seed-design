import * as React from "react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";
import {
  SwitchRoot as HeadlessSwitchRoot,
  useSwitchContext as useHeadlessSwitchContext,
} from "@seed-design/lynx-switch";

import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import type { LynxStyledElementProps } from "../../types";

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

interface SwitchApi {
  switchVariantProps: SwitchVariantProps;
  switchmarkVariantProps: SwitchmarkVariantProps;
}

const SwitchRecipeContext = React.createContext<SwitchApi | null>(null);

function useSwitchRecipeContext(consumer: string): SwitchApi {
  const ctx = React.useContext(SwitchRecipeContext);
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
    style,
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { switch: switchStyle, switchmark });

  const rootClassName = switchStyle({ ...switchVariantProps, disabled }).root;

  const api = React.useMemo<SwitchApi>(
    () => ({
      switchVariantProps,
      switchmarkVariantProps,
    }),
    [switchVariantProps, switchmarkVariantProps],
  );

  return (
    <HeadlessSwitchRoot
      {...nativeProps}
      ref={ref}
      checked={checkedProp}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      className={clsx(rootClassName, className)}
      style={style}
    >
      <SwitchRecipeContext.Provider value={api}>{children}</SwitchRecipeContext.Provider>
    </HeadlessSwitchRoot>
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
  const api = useSwitchRecipeContext("SwitchControl");
  const state = useHeadlessSwitchContext("SwitchControl");
  const switchmarkVariantProps: SwitchmarkVariantProps = {
    ...api.switchmarkVariantProps,
    ...variantProps,
    checked: state.checked,
    disabled: state.disabled,
  };
  const classes = switchmark(switchmarkVariantProps);

  return (
    <SwitchmarkControlContext.Provider
      value={{ thumbClassName: classes.thumb, switchmarkVariantProps }}
    >
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
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
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
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
  const api = useSwitchRecipeContext("SwitchLabel");
  const state = useHeadlessSwitchContext("SwitchLabel");
  const labelClassName = switchStyle({
    ...api.switchVariantProps,
    disabled: state.disabled,
  }).label;

  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      className={clsx(labelClassName, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SwitchLabel.displayName = "SwitchLabel";

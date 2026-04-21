import * as React from "react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";

import { createCompoundContext } from "../../utils/create-compound-context";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { useControllableState } from "../../utils/use-controllable-state";
import { usePressTap } from "../../utils/use-press-tap";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / value / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 토글 이벤트는 onCheckedChange로만 노출
 *
 * 추후 CSS 지원 시 추가 예정:
 * - active (pressed) 모디파이어: switchmark recipe CSS에 pressed 상태가 정의되면 활성화
 */

type SwitchSize = NonNullable<SwitchVariantProps["size"]>;
type SwitchTone = NonNullable<SwitchmarkVariantProps["tone"]>;

// recipe .d.ts는 CSS variant만 선언하지만 런타임은 state modifier도 지원 (postcss-lynx-compat이
// pseudo selector를 class modifier로 변환). local alias로 타입 갭 우회.
type SwitchStyleRuntimeProps = SwitchVariantProps & { disabled?: boolean };
type SwitchmarkRuntimeProps = SwitchmarkVariantProps & { checked?: boolean; disabled?: boolean };

interface SwitchContextValue {
  checked: boolean;
  disabled: boolean;
  size: SwitchSize;
  tone: SwitchTone;
}

const [SwitchContext, useSwitchContext] = createCompoundContext<SwitchContextValue>("SwitchRoot");

const [SwitchmarkThumbClassContext, useSwitchmarkThumbClass] =
  createCompoundContext<string>("SwitchControl");

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchRootProps extends SwitchVariantProps, Omit<SwitchmarkVariantProps, "size"> {
  children?: React.ReactNode;
  className?: string;
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
  const size: SwitchSize = switchVariantProps.size ?? "32";
  const tone: SwitchTone = switchmarkVariantProps.tone ?? "brand";

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const { pressed: _pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: () => setChecked(!checked),
  });

  const rootClassName = switchStyle({ size }).root;

  const ctx = React.useMemo<SwitchContextValue>(
    () => ({ checked, disabled, size, tone }),
    [checked, disabled, size, tone],
  );

  return (
    <SwitchContext.Provider value={ctx}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
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

export interface SwitchControlProps extends Pick<SwitchmarkVariantProps, "tone" | "size"> {
  children?: React.ReactNode;
  className?: string;
}

export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const [variantProps, restProps] = switchmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const { checked, disabled, tone: ctxTone, size: ctxSize } = useSwitchContext("SwitchControl");

  const tone: SwitchTone = variantProps.tone ?? ctxTone;
  const size: SwitchSize = variantProps.size ?? ctxSize;

  const classes = React.useMemo(
    () =>
      switchmark({
        tone,
        size,
        checked: checked ? true : undefined,
        disabled: disabled ? true : undefined,
      } as SwitchmarkRuntimeProps),
    [tone, size, checked, disabled],
  );

  return (
    <SwitchmarkThumbClassContext.Provider value={classes.thumb}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </SwitchmarkThumbClassContext.Provider>
  );
});
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps {
  className?: string;
}

export const SwitchThumb = React.forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const thumbClassName = useSwitchmarkThumbClass("SwitchThumb");

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

export interface SwitchLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const SwitchLabel = React.forwardRef<unknown, SwitchLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { disabled, size } = useSwitchContext("SwitchLabel");
  const labelClassName = (switchStyle as (p?: SwitchStyleRuntimeProps) => Record<string, string>)({
    size,
    disabled: disabled ? true : undefined,
  })["label"];

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

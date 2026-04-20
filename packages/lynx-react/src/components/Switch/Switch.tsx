import * as React from "react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";

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
type SwitchmarkClasses = ReturnType<typeof switchmark>;

// switchmark/switch recipe의 `.d.ts`는 variant(tone, size)만 선언하지만, 런타임 recipe 함수는
// 전달된 키를 그대로 모디파이어 클래스로 변환한다. CSS(.seed-switchmark__root--checked_true 등)는
// 이 클래스를 소비하므로, 여기서 local alias로 타입 갭을 우회한다.
type SwitchmarkRuntimeProps = SwitchmarkVariantProps & {
  checked?: boolean;
  disabled?: boolean;
};

interface SwitchContextValue {
  checked: boolean;
  disabled: boolean;
  pressed: boolean;
  // SwitchLabel이 그대로 쓰는 className (disabled 모디파이어 포함)
  labelClassName: string;
  // SwitchControl의 기본값. Control에서 자체 props로 override 가능
  tone: SwitchTone;
  size: SwitchSize;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext(component: string): SwitchContextValue {
  const ctx = React.useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`<${component}/> must be rendered inside <SwitchRoot/>.`);
  }
  return ctx;
}

// SwitchControl이 계산한 switchmark 클래스 번들을 SwitchThumb에 전달
const SwitchmarkClassesContext = React.createContext<SwitchmarkClasses | null>(null);

function useSwitchmarkClassesContext(component: string): SwitchmarkClasses {
  const ctx = React.useContext(SwitchmarkClassesContext);
  if (!ctx) {
    throw new Error(`<${component}/> must be rendered inside <SwitchControl/>.`);
  }
  return ctx;
}

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
  const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, restProps] =
    splitMultipleVariantsProps(props, { switch: switchStyle, switchmark });
  const {
    children,
    className,
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    ...nativeProps
  } = restProps;
  const size: SwitchSize = switchVariantProps.size ?? "32";
  const tone: SwitchTone = switchmarkVariantProps.tone ?? "brand";

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: () => setChecked(!checked),
  });

  const classes = switchStyle({ size });
  const labelClassName = clsx(classes.label, disabled && "seed-switch__label--disabled_true");

  const ctx = React.useMemo<SwitchContextValue>(
    () => ({ checked, disabled, pressed, labelClassName, tone, size }),
    [checked, disabled, pressed, labelClassName, tone, size],
  );

  return (
    <SwitchContext.Provider value={ctx}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
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

export interface SwitchControlProps extends SwitchmarkVariantProps {
  children?: React.ReactNode;
  className?: string;
}

export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const [variantProps, restProps] = switchmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const { checked, disabled, tone: ctxTone, size: ctxSize } = useSwitchContext("SwitchControl");

  const tone: SwitchTone = variantProps.tone ?? ctxTone;
  const size: SwitchSize = variantProps.size ?? ctxSize;

  const classes = switchmark({
    tone,
    size,
    checked: checked ? true : undefined,
    disabled: disabled ? true : undefined,
  } as SwitchmarkRuntimeProps);

  return (
    <SwitchmarkClassesContext.Provider value={classes}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </SwitchmarkClassesContext.Provider>
  );
});
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps {
  className?: string;
}

export const SwitchThumb = React.forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const classes = useSwitchmarkClassesContext("SwitchThumb");

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      className={clsx(classes.thumb, className)}
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
  const { labelClassName } = useSwitchContext("SwitchLabel");

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

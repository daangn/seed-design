import * as React from "react";
import clsx from "clsx";

import { switchStyle } from "@seed-design/lynx-css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/lynx-css/recipes/switch";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import type { SwitchmarkVariantProps } from "@seed-design/lynx-css/recipes/switchmark";

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

// switchmark recipe의 `.d.ts`는 tone/size만 선언하지만, 런타임 recipe 함수(createClassName)는
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
  size: SwitchSize;
  tone: SwitchTone;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext(component: string): SwitchContextValue {
  const ctx = React.useContext(SwitchContext);
  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SEED Design] <${component}/> must be rendered inside <SwitchRoot/>.`);
    }
    return { checked: false, disabled: false, pressed: false, size: "32", tone: "brand" };
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
  const [variantProps, restProps] = switchStyle.splitVariantProps(props);
  const {
    children,
    className,
    tone = "brand",
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    ...nativeProps
  } = restProps as Omit<typeof restProps, "tone"> & { tone?: SwitchTone };
  const size: SwitchSize = variantProps.size ?? "32";

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

  const ctx = React.useMemo<SwitchContextValue>(
    () => ({ checked, disabled, pressed, size, tone }),
    [checked, disabled, pressed, size, tone],
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

export interface SwitchControlProps {
  children?: React.ReactNode;
  className?: string;
}

export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { checked, disabled, size, tone } = useSwitchContext("SwitchControl");

  const classes = switchmark({
    tone,
    size,
    checked: checked ? true : undefined,
    disabled: disabled ? true : undefined,
  } as SwitchmarkRuntimeProps);

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      className={clsx(classes.root, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps {
  className?: string;
}

export const SwitchThumb = React.forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const { checked, disabled, size, tone } = useSwitchContext("SwitchThumb");

  const classes = switchmark({
    tone,
    size,
    checked: checked ? true : undefined,
    disabled: disabled ? true : undefined,
  } as SwitchmarkRuntimeProps);

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
  const { disabled, size } = useSwitchContext("SwitchLabel");
  const classes = switchStyle({ size });

  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      className={clsx(classes.label, disabled && "seed-switch__label--disabled_true", className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SwitchLabel.displayName = "SwitchLabel";

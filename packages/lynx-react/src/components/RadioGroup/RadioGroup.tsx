import * as React from "react";
import { cloneElement, isValidElement, type CSSProperties, type ReactElement } from "react";
import clsx from "clsx";
import type { MainThread } from "@lynx-js/types";

import { radio } from "@seed-design/lynx-css/recipes/radio";
import type { RadioVariantProps } from "@seed-design/lynx-css/recipes/radio";
import { radiomark } from "@seed-design/lynx-css/recipes/radiomark";
import type { RadiomarkVariantProps } from "@seed-design/lynx-css/recipes/radiomark";
import { radioGroup } from "@seed-design/lynx-css/recipes/radio-group";
import { vars as radiomarkVars } from "@seed-design/lynx-css/vars/component/radiomark";

import { useControllableState } from "../../hooks/use-controllable-state";
import { useIconColor } from "../../hooks/use-icon-color";
import { usePressTap } from "../../hooks/use-press-tap";
import { capitalize, resolveRecipeToken } from "../../utils/resolve-recipe-token";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 선택 이벤트는 onValueChange로만 노출
 *
 * Indicator 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를
 * 받는다. 내부에서 `<image tint-color=...>` 로 렌더되므로 `useIconColor` 훅이
 * recipe 의 `color` 토큰을 `tint-color` 로 동기화한다.
 */

type RadioSize = NonNullable<RadioVariantProps["size"]>;
type RadioWeight = NonNullable<RadioVariantProps["weight"]>;
type RadiomarkTone = NonNullable<RadiomarkVariantProps["tone"]>;

interface RadioGroupContextValue {
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
  size: RadioSize;
  weight: RadioWeight;
  tone: RadiomarkTone;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(consumer: string): RadioGroupContextValue {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupRoot/>.`);
  }
  return ctx;
}

interface RadioGroupItemContextValue {
  value: string;
  checked: boolean;
  disabled: boolean;
  pressed: boolean;
  tone: RadiomarkTone;
  size: RadioSize;
}

const RadioGroupItemContext = React.createContext<RadioGroupItemContextValue | null>(null);

function useRadioGroupItemContext(consumer: string): RadioGroupItemContextValue {
  const ctx = React.useContext(RadioGroupItemContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupItem/>.`);
  }
  return ctx;
}

const RadiomarkIconClassContext = React.createContext<string | null>(null);

function useRadiomarkIconClass(consumer: string): string {
  const ctx = React.useContext(RadiomarkIconClassContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupItemControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupRootProps
  extends RadioVariantProps,
    Omit<RadiomarkVariantProps, "size" | "checked" | "disabled"> {
  children?: React.ReactNode;
  className?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export const RadioGroupRoot = React.forwardRef<unknown, RadioGroupRootProps>((props, ref) => {
  const {
    children,
    className,
    value: valueProp,
    defaultValue,
    disabled = false,
    onValueChange,
    ...restProps
  } = props;
  const [{ radio: radioVariantProps, radiomark: radiomarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { radio, radiomark });
  const weight: RadioWeight = radioVariantProps.weight ?? "regular";
  const size: RadioSize = radioVariantProps.size ?? "medium";
  const tone: RadiomarkTone = radiomarkVariantProps.tone ?? "brand";

  const handleChange = React.useCallback(
    (next: string | null) => {
      if (next !== null) onValueChange?.(next);
    },
    [onValueChange],
  );

  const [value, setValueInternal] = useControllableState<string | null>({
    value: valueProp !== undefined ? valueProp : undefined,
    defaultValue: defaultValue ?? null,
    onChange: handleChange,
  });

  const setValue = React.useCallback(
    (next: string) => {
      setValueInternal(next);
    },
    [setValueInternal],
  );

  const rootClassName = radioGroup();

  const ctx = React.useMemo<RadioGroupContextValue>(
    () => ({ value, setValue, disabled, size, weight, tone }),
    [value, setValue, disabled, size, weight, tone],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(rootClassName, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </RadioGroupContext.Provider>
  );
});
RadioGroupRoot.displayName = "RadioGroupRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const RadioGroupItem = React.forwardRef<unknown, RadioGroupItemProps>((props, ref) => {
  const {
    value: itemValue,
    disabled: itemDisabled = false,
    children,
    className,
    ...nativeProps
  } = props;
  const {
    value: groupValue,
    setValue,
    disabled: groupDisabled,
    size,
    weight,
    tone,
  } = useRadioGroupContext("RadioGroupItem");

  const disabled = groupDisabled || itemDisabled;
  const checked = groupValue === itemValue;

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: () => {
      if (checked) return;
      setValue(itemValue);
    },
  });

  const rootClassName = radio({ weight, size, disabled }).root;

  const itemCtx = React.useMemo<RadioGroupItemContextValue>(
    () => ({
      value: itemValue,
      checked,
      disabled,
      pressed,
      tone,
      size,
    }),
    [itemValue, checked, disabled, pressed, tone, size],
  );

  return (
    <RadioGroupItemContext.Provider value={itemCtx}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(rootClassName, className)}
        {...pressHandlers}
        {...nativeProps}
      >
        {children}
      </view>
    </RadioGroupItemContext.Provider>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemControlProps extends Pick<RadiomarkVariantProps, "tone"> {
  children?: React.ReactNode;
  className?: string;
}

export const RadioGroupItemControl = React.forwardRef<unknown, RadioGroupItemControlProps>(
  (props, ref) => {
    const [variantProps, restProps] = radiomark.splitVariantProps(props);
    const { children, className, ...nativeProps } = restProps;
    const {
      checked,
      disabled,
      pressed,
      tone: ctxTone,
      size,
    } = useRadioGroupItemContext("RadioGroupItemControl");

    const tone: RadiomarkTone = variantProps.tone ?? ctxTone;

    const classes = React.useMemo(
      () => radiomark({ tone, size, checked, disabled, pressed }),
      [tone, size, checked, disabled, pressed],
    );

    return (
      <RadiomarkIconClassContext.Provider value={classes.icon}>
        <view
          {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
          className={clsx(classes.root, className)}
          {...nativeProps}
        >
          {children}
        </view>
      </RadiomarkIconClassContext.Provider>
    );
  },
);
RadioGroupItemControl.displayName = "RadioGroupItemControl";

////////////////////////////////////////////////////////////////////////////////////

type IconElementProps = {
  className?: string;
  style?: CSSProperties;
  ref?: React.Ref<MainThread.Element>;
};

export interface RadioGroupItemIndicatorProps {
  /** Icon rendered when not checked. Optional — falls back to default `<view>` dot when omitted. */
  unchecked?: ReactElement<IconElementProps>;
  /** Icon rendered when the item is checked. Optional — falls back to default `<view>` dot when omitted. */
  checked?: ReactElement<IconElementProps>;
  className?: string;
  style?: CSSProperties;
}

export function RadioGroupItemIndicator(props: RadioGroupItemIndicatorProps) {
  const { unchecked, checked: checkedIcon, className, style } = props;
  const { checked, disabled, pressed, tone, size } =
    useRadioGroupItemContext("RadioGroupItemIndicator");
  const iconClassName = useRadiomarkIconClass("RadioGroupItemIndicator");
  const { ref: tintRef } = useIconColor([checked, disabled, pressed, tone, size]);

  const icon = checked ? checkedIcon : unchecked;

  // 사용자가 custom icon 을 주지 않으면 default `<view>` 로 동그란 점을 그린다.
  // radiomark.icon recipe 가 borderRadius/backgroundColor/width/height 를 적용해
  // 라디오의 inner dot 모양을 재현. 웹 RadioGroup 의 default `<svg><circle/></svg>` 동작과 일치.
  if (!icon || !isValidElement<IconElementProps>(icon)) {
    return <view className={clsx(iconClassName, className)} style={style} />;
  }

  // lynx-monochrome-icon 이 `<image style={{ width, height, ...style }}>` 로 자체 default size 를 박으므로
  // recipe 토큰에서 꺼낸 사이즈를 inline 으로 주입해 덮는다.
  const iconSize = resolveRecipeToken(radiomarkVars, [
    `size${capitalize(size)}`,
    disabled ? "disabled" : "enabled",
    "icon",
    "size",
  ]);

  return cloneElement(icon, {
    className: clsx(iconClassName, icon.props.className, className),
    style: iconSize
      ? { width: iconSize, height: iconSize, ...icon.props.style, ...style }
      : { ...icon.props.style, ...style },
    ref: tintRef,
  });
}
RadioGroupItemIndicator.displayName = "RadioGroupItemIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const RadioGroupItemLabel = React.forwardRef<unknown, RadioGroupItemLabelProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const { disabled } = useRadioGroupItemContext("RadioGroupItemLabel");
    const { size, weight } = useRadioGroupContext("RadioGroupItemLabel");
    const labelClassName = radio({ weight, size, disabled }).label;

    return (
      <text
        {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
        className={clsx(labelClassName, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
RadioGroupItemLabel.displayName = "RadioGroupItemLabel";

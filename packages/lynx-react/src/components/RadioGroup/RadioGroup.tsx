import * as React from "react";
import { isValidElement, type ReactElement } from "react";
import clsx from "clsx";

import { radio } from "@seed-design/lynx-css/recipes/radio";
import type { RadioVariantProps } from "@seed-design/lynx-css/recipes/radio";
import { radiomark } from "@seed-design/lynx-css/recipes/radiomark";
import type { RadiomarkVariantProps } from "@seed-design/lynx-css/recipes/radiomark";
import { radioGroup } from "@seed-design/lynx-css/recipes/radio-group";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type { LynxIconElementProps, LynxStyledElementProps } from "../../types";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { InternalIcon } from "../Icon/Icon";

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

interface RadioGroupApi {
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
  radioVariantProps: RadioVariantProps;
  radiomarkVariantProps: RadiomarkVariantProps;
}

const RadioGroupContext = React.createContext<RadioGroupApi | null>(null);

function useRadioGroupContext(consumer: string): RadioGroupApi {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupRoot/>.`);
  }
  return ctx;
}

interface RadioGroupItemApi {
  value: string;
  checked: boolean;
  disabled: boolean;
  pressed: boolean;
  select: () => void;
}

const RadioGroupItemContext = React.createContext<RadioGroupItemApi | null>(null);

function useRadioGroupItemContext(consumer: string): RadioGroupItemApi {
  const ctx = React.useContext(RadioGroupItemContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <RadioGroupItem/>.`);
  }
  return ctx;
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

export interface RadioGroupRootProps
  extends RadioVariantProps,
    Omit<RadiomarkVariantProps, "size" | "checked" | "disabled">,
    LynxStyledElementProps {
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

  const rootClassName = radioGroup().root;

  const api = React.useMemo<RadioGroupApi>(
    () => ({
      value,
      setValue,
      disabled,
      radioVariantProps,
      radiomarkVariantProps,
    }),
    [value, setValue, disabled, radioVariantProps, radiomarkVariantProps],
  );

  return (
    <RadioGroupContext.Provider value={api}>
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

export interface RadioGroupItemProps extends LynxStyledElementProps {
  value: string;
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
  const groupApi = useRadioGroupContext("RadioGroupItem");

  const disabled = groupApi.disabled || itemDisabled;
  const checked = groupApi.value === itemValue;
  const select = React.useCallback(() => {
    if (checked) return;
    groupApi.setValue(itemValue);
  }, [checked, groupApi, itemValue]);

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: select,
  });

  const rootClassName = radio({ ...groupApi.radioVariantProps, disabled }).root;

  const itemApi = React.useMemo<RadioGroupItemApi>(
    () => ({
      value: itemValue,
      checked,
      disabled,
      pressed,
      select,
    }),
    [itemValue, checked, disabled, pressed, select],
  );

  return (
    <RadioGroupItemContext.Provider value={itemApi}>
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

export interface RadioGroupItemControlProps
  extends Pick<RadiomarkVariantProps, "tone">,
    LynxStyledElementProps {}

export const RadioGroupItemControl = React.forwardRef<unknown, RadioGroupItemControlProps>(
  (props, ref) => {
    const [variantProps, restProps] = radiomark.splitVariantProps(props);
    const { children, className, ...nativeProps } = restProps;
    const groupApi = useRadioGroupContext("RadioGroupItemControl");
    const itemApi = useRadioGroupItemContext("RadioGroupItemControl");
    const radiomarkVariantProps: RadiomarkVariantProps = {
      ...groupApi.radiomarkVariantProps,
      ...variantProps,
      checked: itemApi.checked,
      disabled: itemApi.disabled,
      pressed: itemApi.pressed,
    };
    const classes = radiomark(radiomarkVariantProps);

    return (
      <RadiomarkControlContext.Provider
        value={{ iconClassName: classes.icon, radiomarkVariantProps }}
      >
        <view
          {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
          className={clsx(classes.root, className)}
          {...nativeProps}
        >
          {children}
        </view>
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
  const itemApi = useRadioGroupItemContext("RadioGroupItemIndicator");
  const { iconClassName, radiomarkVariantProps } =
    useRadiomarkControlContext("RadioGroupItemIndicator");

  const icon = itemApi.checked ? checkedIcon : unchecked;

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
        itemApi.checked,
        itemApi.disabled,
        itemApi.pressed,
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
    const itemApi = useRadioGroupItemContext("RadioGroupItemLabel");
    const groupApi = useRadioGroupContext("RadioGroupItemLabel");
    const labelClassName = radio({
      ...groupApi.radioVariantProps,
      disabled: itemApi.disabled,
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
  },
);
RadioGroupItemLabel.displayName = "RadioGroupItemLabel";

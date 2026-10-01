import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type TapEvent = Parameters<NonNullable<ViewProps["bindtap"]>>[0];

export interface UseSwitchStateProps {
  /** controlled 선택 상태입니다. 지정하면 press는 `onCheckedChange`만 호출합니다. */
  checked?: boolean;

  /**
   * uncontrolled 초기 선택 상태입니다.
   * @default false
   */
  defaultChecked?: boolean;

  onCheckedChange?: (checked: boolean) => void;
}

export interface UseSwitchProps
  extends UseSwitchStateProps,
    Pick<
      ViewProps,
      "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
    > {
  /**
   * `true`이면 press, 사용자 tap handler, `onCheckedChange`가 막히고
   * `accessibility-traits` 기본값이 `"disabled"`가 됩니다.
   * @default false
   */
  disabled?: boolean;

  /** 사용자 tap handler입니다. disabled가 아니면 선택 상태 전이보다 먼저 실행됩니다. */
  bindtap?: ViewProps["bindtap"];

  /** disabled가 아닐 때만 `rootProps`에 포함됩니다. */
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export type SwitchRootNativeProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
> &
  Omit<UsePressTapReturn, "pressed">;

export interface UseSwitchReturn {
  checked: boolean;
  disabled: boolean;
  /** 누르고 있는 동안 `true`입니다. `disabled`이면 항상 `false`입니다. */
  pressed: boolean;
  /** 선택 상태를 바꿉니다. controlled이면 `onCheckedChange`만 호출합니다. */
  setChecked: (checked: boolean) => void;
  /**
   * Root native view에 펼칩니다. 뒤에 펼친 접근성 props가 기본값을 덮어씁니다.
   * 소비자의 `main-thread:bindtouch*`는 눌림 상태 갱신과 합성된 handler로 포함됩니다.
   */
  rootProps: SwitchRootNativeProps;
}

/**
 * @platform Lynx
 *
 * Switch의 선택·disabled 상태, press, 접근성 기본값을 제공하는 headless 훅입니다.
 * 웹 `@seed-design/react-switch`와 달리 form 제출 모델이 없어 hidden input을 만들지 않습니다.
 */
export function useSwitch(props: UseSwitchProps = {}): UseSwitchReturn {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
  } = props;

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: (event: TapEvent) => {
      "background only";
      bindtap?.(event);
      setChecked(!checked);
    },
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  const {
    bindtap: handleTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  } = pressHandlers;

  return useMemo<UseSwitchReturn>(
    () => ({
      checked,
      disabled,
      pressed,
      setChecked,
      rootProps: {
        bindtap: handleTap,
        bindtouchstart,
        bindtouchend,
        bindtouchcancel,
        ...(mainThreadBindtap ? { "main-thread:bindtap": mainThreadBindtap } : {}),
        ...(mainThreadBindtouchstart
          ? { "main-thread:bindtouchstart": mainThreadBindtouchstart }
          : {}),
        ...(mainThreadBindtouchend ? { "main-thread:bindtouchend": mainThreadBindtouchend } : {}),
        ...(mainThreadBindtouchcancel
          ? { "main-thread:bindtouchcancel": mainThreadBindtouchcancel }
          : {}),
        "accessibility-element": true,
        "accessibility-role-description": "switch",
        "accessibility-traits": disabled ? "disabled" : undefined,
        "accessibility-value": checked ? "checked" : "not checked",
      },
    }),
    [
      checked,
      disabled,
      pressed,
      setChecked,
      handleTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      mainThreadBindtap,
      mainThreadBindtouchstart,
      mainThreadBindtouchend,
      mainThreadBindtouchcancel,
    ],
  );
}

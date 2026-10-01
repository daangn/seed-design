import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { useFieldButtonContext } from "./useFieldButtonContext.js";

type ViewProps = IntrinsicElements["view"];
type TapEvent = Parameters<NonNullable<ViewProps["bindtap"]>>[0];
type PressableAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-traits"
>;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseFieldButtonPressableProps
  extends PressableAccessibilityProps,
    MainThreadTouchProps {
  /** 사용자 tap handler입니다. Root가 `disabled`·`readOnly`이면 실행되지 않습니다. */
  bindtap?: ViewProps["bindtap"];
  /** Root가 `disabled`·`readOnly`가 아닐 때만 native props에 포함됩니다. */
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export type FieldButtonPressableNativeProps = Required<PressableAccessibilityProps> &
  MainThreadTouchProps & {
    bindtap: UsePressTapReturn["bindtap"];
    bindtouchstart: UsePressTapReturn["bindtouchstart"];
    bindtouchend: UsePressTapReturn["bindtouchend"];
    bindtouchcancel: UsePressTapReturn["bindtouchcancel"];
    "main-thread:bindtap"?: UsePressTapReturn["main-thread:bindtap"];
  };

export interface UseFieldButtonButtonReturn {
  /** 누르고 있는 동안 `true`입니다. Root가 `disabled`·`readOnly`이면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Button native view에 펼칩니다. 소비자의 `main-thread:bindtouch*`는 view가 아니라 이 훅에 넘겨야
   * 눌림 상태와 합성된 handler로 포함됩니다.
   */
  buttonProps: FieldButtonPressableNativeProps;
}

export interface UseFieldButtonClearButtonReturn {
  /** Clear를 누르고 있는 동안 `true`입니다. Button의 `pressed`와 독립적입니다. */
  pressed: boolean;
  /** `false`이면 Root가 `disabled`·`readOnly`이므로 ClearButton을 렌더링하지 않습니다. */
  rendered: boolean;
  /** ClearButton native view에 펼칩니다. `main-thread:bindtouch*` 합성 방식은 Button과 같습니다. */
  clearButtonProps: FieldButtonPressableNativeProps;
}

function usePressableProps(
  props: UseFieldButtonPressableProps,
  { interactive, onTap }: { interactive: boolean; onTap: (event: TapEvent) => void },
) {
  const {
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraitsProp,
  } = props;
  const accessibilityTraits = accessibilityTraitsProp ?? (interactive ? "button" : "disabled");
  const {
    pressed,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": handleMainThreadTap,
    "main-thread:bindtouchstart": handleMainThreadTouchStart,
    "main-thread:bindtouchend": handleMainThreadTouchEnd,
    "main-thread:bindtouchcancel": handleMainThreadTouchCancel,
  } = usePressTap({
    disabled: !interactive,
    onTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  const nativeProps = useMemo<FieldButtonPressableNativeProps>(
    () => ({
      bindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...(handleMainThreadTap ? { "main-thread:bindtap": handleMainThreadTap } : {}),
      ...(handleMainThreadTouchStart
        ? { "main-thread:bindtouchstart": handleMainThreadTouchStart }
        : {}),
      ...(handleMainThreadTouchEnd ? { "main-thread:bindtouchend": handleMainThreadTouchEnd } : {}),
      ...(handleMainThreadTouchCancel
        ? { "main-thread:bindtouchcancel": handleMainThreadTouchCancel }
        : {}),
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
    }),
    [
      bindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      handleMainThreadTap,
      handleMainThreadTouchStart,
      handleMainThreadTouchEnd,
      handleMainThreadTouchCancel,
      accessibilityElement,
      accessibilityTraits,
    ],
  );

  return { pressed, nativeProps };
}

/**
 * @platform Lynx
 *
 * `FieldButtonRoot` 안에서 값을 고르는 Button의 tap·눌림 상태·접근성을 연결합니다.
 * Root가 `disabled`·`readOnly`이면 tap을 막고 `accessibility-traits` 기본값이 `"disabled"`가 됩니다.
 */
export function useFieldButtonButton(
  props: UseFieldButtonPressableProps = {},
): UseFieldButtonButtonReturn {
  const { interactive } = useFieldButtonContext();
  const { bindtap } = props;
  const { pressed, nativeProps } = usePressableProps(props, {
    interactive,
    onTap: (event) => {
      "background only";
      bindtap?.(event);
    },
  });

  return useMemo(() => ({ pressed, buttonProps: nativeProps }), [pressed, nativeProps]);
}

/**
 * @platform Lynx
 *
 * `FieldButtonRoot` 안에서 ClearButton의 tap·눌림 상태·접근성을 연결합니다.
 * tap하면 사용자 `bindtap` 뒤 Root의 `onValuesChange([])`를 호출합니다.
 */
export function useFieldButtonClearButton(
  props: UseFieldButtonPressableProps = {},
): UseFieldButtonClearButtonReturn {
  const { interactive, setValues } = useFieldButtonContext();
  const { bindtap } = props;
  const { pressed, nativeProps } = usePressableProps(props, {
    interactive,
    onTap: (event) => {
      "background only";
      bindtap?.(event);
      setValues([]);
    },
  });

  return useMemo(
    () => ({ pressed, rendered: interactive, clearButtonProps: nativeProps }),
    [pressed, interactive, nativeProps],
  );
}

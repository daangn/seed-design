import { useCallback, useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

import { useMenuContext } from "./useMenuContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;

export interface UseMenuItemProps
  extends Pick<
    ViewProps,
    | "bindtap"
    | "main-thread:bindtap"
    | "main-thread:bindtouchstart"
    | "main-thread:bindtouchend"
    | "main-thread:bindtouchcancel"
    | "accessibility-element"
    | "accessibility-label"
    | "accessibility-traits"
  > {
  /** `true`이거나 Root가 `disabled`이면 탭해도 `bindtap`을 호출하지 않고 메뉴를 닫지 않습니다. */
  disabled?: boolean;
}

export type MenuItemRootProps = Omit<UsePressTapReturn, "pressed"> &
  Pick<
    ViewProps,
    | "accessibility-element"
    | "accessibility-label"
    | "accessibility-role-description"
    | "accessibility-traits"
  >;

export interface UseMenuItemReturn {
  disabled: boolean;
  pressed: boolean;
  /** 항목 native `<view>`에 펼칠 tap·눌림·접근성 props입니다. */
  rootProps: MenuItemRootProps;
}

/**
 * @platform Lynx
 *
 * 메뉴 항목의 tap·눌림 상태·접근성을 연결합니다. 활성 항목을 탭하면 사용자 `bindtap`을 먼저 실행한 뒤
 * `"itemClick"` reason으로 메뉴를 닫습니다.
 */
export function useMenuItem(props: UseMenuItemProps = {}): UseMenuItemReturn {
  const {
    disabled: disabledProp = false,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  } = props;
  const { disabled: menuDisabled, setOpen } = useMenuContext();
  const disabled = menuDisabled || disabledProp;
  const handleTap = useCallback<TapHandler>(
    (event, instance) => {
      "background only";
      bindtap?.(event, instance);
      setOpen(false, { reason: "itemClick", event });
    },
    [bindtap, setOpen],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });
  const traits = accessibilityTraits ?? (disabled ? "disabled" : "button");
  const {
    bindtap: pressBindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  } = pressHandlers;
  const rootProps = useMemo<MenuItemRootProps>(
    () => ({
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": "button",
      "accessibility-traits": traits,
      bindtap: pressBindtap,
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
    }),
    [
      accessibilityElement,
      accessibilityLabel,
      traits,
      pressBindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      mainThreadBindtap,
      mainThreadBindtouchstart,
      mainThreadBindtouchend,
      mainThreadBindtouchcancel,
    ],
  );

  return useMemo(() => ({ disabled, pressed, rootProps }), [disabled, pressed, rootProps]);
}

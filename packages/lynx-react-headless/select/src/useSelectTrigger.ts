import { useCallback, useEffect, useMemo, type ForwardedRef } from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

import { useSelectContext } from "./useSelectContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;

export interface UseSelectTriggerProps
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
  /** Trigger native node를 함께 받을 ref입니다. */
  ref?: ForwardedRef<unknown>;
}

export type SelectTriggerRootProps = Omit<UsePressTapReturn, "pressed"> &
  Pick<
    ViewProps,
    | "accessibility-element"
    | "accessibility-label"
    | "accessibility-role-description"
    | "accessibility-value"
    | "accessibility-traits"
  >;

export interface UseSelectTriggerReturn {
  /** Root가 `disabled`이거나 `readOnly`이면 `true`입니다. */
  disabled: boolean;
  pressed: boolean;
  /** Trigger native `<view>`의 `ref`에 넘깁니다. 위치 기준 node를 저장하고 `ref` prop에도 전달합니다. */
  rootRef: (node: NodesRef | null) => void;
  /** Trigger native `<view>`에 펼칠 tap·눌림·접근성 props입니다. */
  rootProps: SelectTriggerRootProps;
}

/**
 * @platform Lynx
 *
 * Trigger의 tap·눌림 상태·접근성·ref를 연결합니다. 탭하면 열림 상태를 `"trigger"` reason으로 바꾼 뒤 사용자
 * `bindtap`을 실행합니다. 열림 상태를 `accessibility-value`의 `"expanded"`·`"collapsed"`로 알리고
 * `accessibility-traits="button"`을 기본값으로 둡니다. Root가 `disabled`·`readOnly`이면 열지 않습니다.
 */
export function useSelectTrigger(props: UseSelectTriggerProps = {}): UseSelectTriggerReturn {
  const {
    ref,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  } = props;
  const {
    open,
    disabled: rootDisabled,
    readOnly,
    setOpen,
    triggerRef,
    setTriggerHandlers,
  } = useSelectContext();
  const disabled = rootDisabled || readOnly;
  const handleTap = useCallback<TapHandler>(
    (event, instance) => {
      "background only";
      setOpen(!open, { reason: "trigger", event });
      bindtap?.(event, instance);
    },
    [bindtap, open, setOpen],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });
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
  useEffect(() => {
    "background only";
    setTriggerHandlers(
      mainThreadBindtap
        ? { bindtap: pressBindtap, "main-thread:bindtap": mainThreadBindtap }
        : { bindtap: pressBindtap },
    );
    return () => setTriggerHandlers({});
  }, [setTriggerHandlers, mainThreadBindtap, pressBindtap]);
  const rootRef = useCallback(
    (node: NodesRef | null) => {
      triggerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [triggerRef, ref],
  );
  const traits = accessibilityTraits ?? (disabled ? "disabled" : "button");
  const rootProps = useMemo<SelectTriggerRootProps>(
    () => ({
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": "button",
      "accessibility-value": open ? "expanded" : "collapsed",
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
      open,
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

  return useMemo(
    () => ({ disabled, pressed, rootRef, rootProps }),
    [disabled, pressed, rootRef, rootProps],
  );
}

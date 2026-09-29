import { useRef } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

export interface UseToggleStateProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

type MainThreadTouchProps = Pick<
  IntrinsicElements["view"],
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseToggleProps extends UseToggleStateProps, MainThreadTouchProps {
  disabled?: boolean;
}

export type UseToggleReturn = ReturnType<typeof useToggle>;

/**
 * @platform Lynx
 *
 * Toggle(pressed) 상태 + tap 인터랙션을 묶는 headless 훅.
 *
 * 웹 `@seed-design/react-toggle`은 `onClick` + `data-pressed`/`aria-pressed`로 동작하지만,
 * Lynx는 click/attribute selector가 없으므로 `usePressTap`(bindtap → toggle, 누름 상태)과
 * `useControllableState`(controlled/uncontrolled pressed)를 조합한다. 시각 상태는
 * 소비 측(`lynx-react`)이 `pressed`/`active`를 recipe variant로 전달한다.
 */
export function useToggle(props: UseToggleProps) {
  const {
    pressed,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
  } = props;

  const [isPressed, setPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  // Keep pending uncontrolled updates available to consecutive calls before rerender.
  // Controlled requests continue to use the external value until its owner updates it.
  const pendingPressed = useRef(isPressed);
  pendingPressed.current = isPressed;
  const toggle = useMemoizedFn(() => {
    "background only";
    const nextPressed = !(pressed === undefined ? pendingPressed.current : isPressed);
    pendingPressed.current = nextPressed;
    setPressed(nextPressed);
  });

  const { pressed: active, ...pressHandlers } = usePressTap({
    disabled,
    onTap: toggle,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return {
    /** 토글 on/off 상태 (예: 좋아요 채움) */
    pressed: isPressed,
    /** 상태를 반전한다. (disabled 차단은 rootProps가 담당) */
    toggle,
    disabled,
    /** 손가락으로 누르고 있는 동안 true (눌림 시각 피드백용) */
    active,
    /**
     * Toggle root 요소(`<view>`)에 펼친다. disabled가 아니면 tap 시 toggle.
     * 소비자의 `main-thread:bindtouch*`는 누름 상태와 합성된 handler로 포함된다.
     */
    rootProps: pressHandlers,
  };
}

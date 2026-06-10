import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

export interface UseToggleStateProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export interface UseToggleProps extends UseToggleStateProps {
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
  const { pressed, defaultPressed = false, onPressedChange, disabled = false } = props;

  const [isPressed, setPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  // lynx-use-controllable-state는 함수형 업데이트를 지원하지 않으므로 현재 값을 반전한다.
  const toggle = useMemoizedFn(() => {
    setPressed(!isPressed);
  });

  const pressTap = usePressTap({ disabled, onTap: toggle });

  return {
    /** 토글 on/off 상태 (예: 좋아요 채움) */
    pressed: isPressed,
    /** 상태를 반전한다. (disabled 차단은 rootProps가 담당) */
    toggle,
    disabled,
    /** 손가락으로 누르고 있는 동안 true (눌림 시각 피드백용) */
    active: pressTap.pressed,
    /** Toggle root 요소(`<view>`)에 펼친다. disabled가 아니면 tap 시 toggle. */
    rootProps: {
      bindtap: pressTap.bindtap,
      bindtouchstart: pressTap.bindtouchstart,
      bindtouchend: pressTap.bindtouchend,
      bindtouchcancel: pressTap.bindtouchcancel,
    },
  };
}

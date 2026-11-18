import { useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

export interface UseDismissibleProps {
  /**
   * 처음 렌더링할 때 표시할지 여부입니다. `open`이 없을 때만 사용합니다.
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * 표시 여부입니다. 지정하면 `dismiss`가 값을 바꾸지 않고 `onDismiss`만 호출합니다.
   */
  open?: boolean;

  /**
   * 열린 상태에서 `dismiss`를 호출하면 한 번 실행됩니다. 닫힌 상태에서는 호출하지 않습니다.
   */
  onDismiss?: () => void;
}

export interface UseDismissibleReturn {
  open: boolean;
  /** 열린 상태를 닫고 `onDismiss`를 호출합니다. 이미 닫혔으면 아무것도 하지 않습니다. */
  dismiss: () => void;
}

/**
 * @platform Lynx
 *
 * 닫을 수 있는 요소의 표시 상태와 `dismiss`를 제공하는 headless 훅입니다.
 */
export function useDismissible(props: UseDismissibleProps = {}): UseDismissibleReturn {
  const { defaultOpen = true, open: openProp, onDismiss } = props;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: (open) => {
      if (!open) {
        onDismiss?.();
      }
    },
  });
  const dismiss = useMemoizedFn(() => {
    "background only";
    setOpen(false);
  });

  return useMemo(() => ({ open, dismiss }), [open, dismiss]);
}

import { useRef } from "react";

export interface UseRenderStrategyProps {
  /**
   * If `true`, the component will be mounted lazily.
   * @default false
   */
  lazyMount?: boolean;

  /**
   * If `true`, the component will be unmounted when it's not selected.
   * @default false
   * */
  unmountOnExit?: boolean;

  /**
   * If `true`, the component will be mounted.
   * @default false
   */
  present?: boolean;
}

export type UseRenderStrategyReturn = ReturnType<typeof useRenderStrategy>;

export function useRenderStrategy(props: UseRenderStrategyProps) {
  const wasEverPresent = useRef(false);

  if (props.present) {
    wasEverPresent.current = true;
  }

  return {
    unmounted:
      (!props.present && !wasEverPresent.current && props.lazyMount) ||
      (props.unmountOnExit && !props.present && wasEverPresent.current),
  };
}

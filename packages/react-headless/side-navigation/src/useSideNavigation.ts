import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { elementProps } from "@seed-design/dom-utils";
import { useMemo, useRef, useState } from "react";

export interface UseSideNavigationProps {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export type UseSideNavigationReturn = ReturnType<typeof useSideNavigation>;

export function useSideNavigation(props: UseSideNavigationProps) {
  const [collapsed, setCollapsed] = useControllableState({
    prop: props.collapsed,
    defaultProp: props.defaultCollapsed ?? false,
    onChange: props.onCollapsedChange,
  });

  const [transitioning, setTransitioning] = useState(false);
  const prevCollapsedRef = useRef(collapsed);

  if (prevCollapsedRef.current !== collapsed) {
    prevCollapsedRef.current = collapsed;
    if (!transitioning) setTransitioning(true);
  }

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-side-navigation-state": collapsed ? "collapsed" : "expanded",
      }),
    [collapsed],
  );

  const rootProps = useMemo(
    () =>
      elementProps({
        onTransitionEnd: (event: React.TransitionEvent) => {
          if (event.target !== event.currentTarget) return;
          setTransitioning(false);
        },
      }),
    [],
  );

  return useMemo(
    () => ({
      collapsed,
      setCollapsed,
      transitioning,

      stateProps,
      rootProps,

      triggerProps: elementProps({
        ...stateProps,

        onClick: (event) => {
          if (event.defaultPrevented) return;

          setCollapsed((prev) => !prev);
        },
      }),
    }),
    [collapsed, setCollapsed, transitioning, stateProps, rootProps],
  );
}

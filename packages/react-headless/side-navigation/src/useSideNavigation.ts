import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { elementProps } from "@seed-design/dom-utils";
import { useMemo } from "react";

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

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-side-navigation-state": collapsed ? "collapsed" : "expanded",
      }),
    [collapsed],
  );

  return useMemo(
    () => ({
      collapsed,
      setCollapsed,
      stateProps,

      triggerProps: elementProps({
        ...stateProps,

        onClick: (event) => {
          if (event.defaultPrevented) return;

          setCollapsed((prev) => !prev);
        },
      }),
    }),
    [collapsed, setCollapsed, stateProps],
  );
}

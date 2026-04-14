import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type UseCollapsibleProps, useCollapsible } from "@seed-design/react-collapsible";
import { useEffect, useState } from "react";
import { useSideNavigationContext } from "./useSideNavigationContext";

export type UseSideNavigationCollapsibleProps = UseCollapsibleProps;

export type UseSideNavigationCollapsibleReturn = ReturnType<typeof useSideNavigationCollapsible>;

export function useSideNavigationCollapsible(props: UseSideNavigationCollapsibleProps) {
  const { collapsed, transitioning } = useSideNavigationContext();

  const [userOpen, setUserOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  // On initial mount: ready immediately (no animation needed).
  // On remount after expand (transitioning=true): start closed, then open after paint.
  const [mountReady, setMountReady] = useState(!collapsed && !transitioning);

  useEffect(() => {
    if (!collapsed) {
      setMountReady(true);
    } else {
      setMountReady(false);
    }
  }, [collapsed]);

  const effectiveOpen = collapsed ? false : mountReady ? userOpen : false;

  return useCollapsible({
    open: effectiveOpen,
    onOpenChange: setUserOpen,
    disabled: props.disabled,
  });
}

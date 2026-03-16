import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type UseCollapsibleProps, useCollapsible } from "@seed-design/react-collapsible";
import { useCallback } from "react";
import { useSideNavigationContext } from "./useSideNavigationContext";

export type UseSideNavigationCollapsibleProps = UseCollapsibleProps;

export type UseSideNavigationCollapsibleReturn = ReturnType<typeof useSideNavigationCollapsible>;

export function useSideNavigationCollapsible(props: UseSideNavigationCollapsibleProps) {
  const { collapsed, setCollapsed } = useSideNavigationContext();

  const [userOpen, setUserOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const effectiveOpen = collapsed ? false : userOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (collapsed && newOpen) {
        setCollapsed(false);
      }

      setUserOpen(newOpen);
    },
    [collapsed, setCollapsed, setUserOpen],
  );

  return useCollapsible({
    open: effectiveOpen,
    onOpenChange: handleOpenChange,
    disabled: props.disabled,
  });
}

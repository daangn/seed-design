import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type UseCollapsibleProps, useCollapsible } from "@seed-design/react-collapsible";
import { useCallback } from "react";
import { useSideNavigationContext } from "./useSideNavigationContext";

export type UseSideNavigationCollapsibleProps = UseCollapsibleProps;

export type UseSideNavigationCollapsibleReturn = ReturnType<typeof useSideNavigationCollapsible>;

export function useSideNavigationCollapsible(props: UseSideNavigationCollapsibleProps) {
  const { collapsed } = useSideNavigationContext();

  const [userOpen, setUserOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (collapsed) return;

      setUserOpen(newOpen);
    },
    [collapsed, setUserOpen],
  );

  const effectiveOpen = collapsed ? false : userOpen;

  return useCollapsible({
    open: effectiveOpen,
    onOpenChange: handleOpenChange,
    disabled: props.disabled,
  });
}

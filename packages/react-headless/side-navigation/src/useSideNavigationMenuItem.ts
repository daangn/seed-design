import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";

export interface UseSideNavigationMenuItemProps {
  current?: boolean;
  disabled?: boolean;
}

export type UseSideNavigationMenuItemReturn = ReturnType<typeof useSideNavigationMenuItem>;

export function useSideNavigationMenuItem(props: UseSideNavigationMenuItemProps) {
  const { current, disabled } = props;

  const stateProps = elementProps({
    "data-current": dataAttr(current),
    "data-disabled": dataAttr(disabled),
  });

  const rootProps = buttonProps({
    ...stateProps,

    disabled,

    "aria-current": current ? ("page" as const) : undefined,
  });

  return {
    current,
    disabled,

    stateProps,

    rootProps,
  };
}

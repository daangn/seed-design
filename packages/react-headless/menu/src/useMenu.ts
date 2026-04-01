"use client";

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useTransitionStatus,
  type Placement,
} from "@floating-ui/react";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

interface MenuReasonToDetailMap {
  trigger: { event: MouseEvent | KeyboardEvent };
  escapeKeyDown: { event: KeyboardEvent };
  interactOutside: { event: PointerEvent };
  cascadeDismiss: { dismissedParent: HTMLElement };
  itemClick: { event: MouseEvent };
}

type MenuChangeDetails = {
  [R in keyof MenuReasonToDetailMap]: {
    reason?: R;
  } & MenuReasonToDetailMap[R];
}[keyof MenuReasonToDetailMap];

interface UseMenuStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details?: MenuChangeDetails) => void;
}

export interface UseMenuProps extends UseMenuStateProps {
  disabled?: boolean;

  modal?: boolean;

  /**
   * Floating UI placement. @default "bottom"
   */
  placement?: Placement;

  /**
   * Distance between trigger and floating element.
   * @default 0
   */
  gutter?: number;

  /**
   * Virtual padding around viewport edges.
   * @default 8
   */
  overflowPadding?: number;

  /**
   * Positioning strategy.
   * @default "absolute"
   */
  strategy?: "absolute" | "fixed";
}

export interface UseMenuItemProps {
  disabled?: boolean;
  /**
   * Overrides the text label to use when the item is matched during keyboard text navigation.
   * Falls back to the element's text content if not provided.
   */
  label?: string;

  // intentionally defined here; onClick is omitted in MenuItemProps since it shouldn't be merged as restProps
  /**
   * Called when the item is activated (click or keyboard).
   * Not called when the item is disabled.
   */
  onClick?: React.MouseEventHandler;
}

export interface UseMenuSubmenuTriggerProps {
  disabled?: boolean;
  /**
   * Overrides the text label to use when the item is matched during keyboard text navigation.
   * Falls back to the element's text content if not provided.
   */
  label?: string;
}

export type UseMenuReturn = ReturnType<typeof useMenu>;

export type GetItemPropsReturn = ReturnType<UseMenuReturn["getItemProps"]>;

function useMenuState(props: UseMenuStateProps) {
  const [open = false, setOpenState] = useControllableState<
    boolean,
    Parameters<NonNullable<UseMenuStateProps["onOpenChange"]>>[1]
  >({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const triggerRef = useRef<Element | null>(null);

  const groupIndexCounter = useRef(0);
  groupIndexCounter.current = 0;

  const menuId = useId();

  return {
    open,
    setOpenState,
    activeIndex,
    setActiveIndex,
    elementsRef,
    labelsRef,
    triggerRef,
    groupIndexCounter,
    menuId,
  };
}

export function useMenu(props: UseMenuProps) {
  const {
    open,
    setOpenState,
    activeIndex,
    setActiveIndex,
    elementsRef,
    labelsRef,
    triggerRef,
    groupIndexCounter,
    menuId,
  } = useMenuState(props);

  const {
    disabled = false,
    modal = false,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
  } = props;

  const setOpen = useCallback(
    (nextOpen: boolean, details?: MenuChangeDetails) => {
      if (disabled && nextOpen) return;
      setOpenState(nextOpen, details);
    },
    [disabled, setOpenState],
  );

  const handleFloatingOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: string) => {
      if (reason === "click" && event) {
        // NOTE: floating-ui passes click/mousedown/keydown on "click" reason
        setOpen(nextOpen, { reason: "trigger", event: event as MouseEvent | KeyboardEvent });

        return;
      }

      setOpen(nextOpen);
    },
    [setOpen],
  );

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange: handleFloatingOpenChange,
    strategy,
    placement,
    middleware: [
      offset(gutter),
      flip({ padding: overflowPadding }),
      shift({ padding: overflowPadding }),
    ],
  });

  useEffect(() => {
    if (!open) return;
    if (!floatingRefs.reference.current || !floatingRefs.floating.current) return;

    return autoUpdate(
      floatingRefs.reference.current,
      floatingRefs.floating.current,
      context.update,
    );
  }, [open, floatingRefs.reference, floatingRefs.floating, context]);

  const { status } = useTransitionStatus(context);

  const click = useClick(context, {
    enabled: !disabled,
  });

  const role = useRole(context, {
    role: "menu",
  });

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnHover: false,
    // focusItemOnOpen: false,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps: getFloatingItemProps,
  } = useInteractions([click, role, listNavigation, typeahead]);

  useEffect(() => {
    if (!open || !modal) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, modal]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-hidden": dataAttr(status === "unmounted"),
        "data-open": dataAttr(status === "open" || status === "initial"),
      }),
    [status],
  );

  return {
    open,
    setOpen,
    activeIndex,
    stateProps,

    floatingContext: context,
    elementsRef,
    labelsRef,

    refs: {
      trigger: (node: HTMLElement | null) => {
        floatingRefs.setReference(node);
        triggerRef.current = node;
      },
      positioner: floatingRefs.setFloating,
    },

    triggerProps: buttonProps({
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "data-open": dataAttr(open),
      ...getReferenceProps(),
    }),

    positionerProps: elementProps({
      ...stateProps,
      style: floatingStyles,
    }),

    contentProps: elementProps({
      ...stateProps,
      role: "menu",
      ...getFloatingProps(),
    }),

    getItemProps: (itemProps: UseMenuItemProps, index: number) => {
      const isActive = activeIndex === index;

      const itemStateProps = elementProps({
        // "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      return {
        // isHighlighted: isActive,
        isDisabled: itemProps.disabled,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          ...getFloatingItemProps({
            onClick(event) {
              if (itemProps.disabled) return;
              if (event.defaultPrevented) return;
              itemProps.onClick?.(event);
              setOpen(false, { reason: "itemClick", event: event.nativeEvent });
            },
            onKeyDown(event) {
              if (itemProps.disabled) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                if (!(event.currentTarget instanceof HTMLElement)) return;

                event.currentTarget.click();
              }
            },
          }),
          role: "menuitem",
          tabIndex: isActive ? 0 : -1,
          "aria-disabled": itemProps.disabled ? "true" : undefined,
        }),
      };
    },

    getSubmenuTriggerProps: (itemProps: UseMenuSubmenuTriggerProps, index: number) => {
      const isActive = activeIndex === index;

      const itemStateProps = elementProps({
        // "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      return {
        // isHighlighted: isActive,
        isDisabled: itemProps.disabled,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          ...getFloatingItemProps(),
          role: "menuitem",
          tabIndex: isActive ? 0 : -1,
          "aria-disabled": itemProps.disabled ? "true" : undefined,
        }),
      };
    },

    getGroupProps: () => {
      const groupIndex = groupIndexCounter.current++;
      const labelId = `menu:${menuId}:group-${groupIndex}:label`;
      return {
        labelId,
        rootProps: elementProps({
          role: "group",
          "aria-labelledby": labelId,
        }),
      };
    },

    getGroupLabelProps: (labelId: string) => {
      return elementProps({
        role: "presentation",
        id: labelId,
      });
    },

    getDividerProps: () => {
      return elementProps({
        role: "separator",
      });
    },
  };
}

"use client";

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  useClick,
  useRole,
  useDismiss,
  useListNavigation,
  useTypeahead,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseMenuStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseMenuProps extends UseMenuStateProps {
  disabled?: boolean;
  modal?: boolean;
  /** Floating UI placement. @default "bottom" */
  placement?: Placement;
  /** Distance between trigger and floating element. @default 0 */
  gutter?: number;
  /** Virtual padding around viewport edges. @default 8 */
  overflowPadding?: number;
  /** Positioning strategy. @default "absolute" */
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

// ---------------------------------------------------------------------------
// State Hook (internal)
// ---------------------------------------------------------------------------

function useMenuState(props: UseMenuStateProps) {
  const [open = false, setOpenState] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const triggerRef = useRef<Element | null>(null);
  const prevOpenRef = useRef(false);

  const itemIndexCounter = useRef(0);
  itemIndexCounter.current = 0;

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
    prevOpenRef,
    itemIndexCounter,
    groupIndexCounter,
    menuId,
  };
}

// ---------------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------------

export function useMenu(props: UseMenuProps = {}) {
  const {
    disabled = false,
    modal = false,
    placement: placementProp = "bottom",
    gutter = 0,
    overflowPadding = 8,
    strategy: strategyProp = "absolute",
  } = props;

  const state = useMenuState(props);
  const {
    open,
    setOpenState,
    activeIndex,
    setActiveIndex,
    elementsRef,
    labelsRef,
    triggerRef,
    prevOpenRef,
    itemIndexCounter,
    groupIndexCounter,
    menuId,
  } = state;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      setOpenState(nextOpen);
    },
    [disabled, setOpenState],
  );

  // ---- Floating UI: positioning + context ----

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    strategy: strategyProp,
    placement: placementProp,
    middleware: [
      offset(gutter),
      flip({ padding: overflowPadding }),
      shift({ padding: overflowPadding, limiter: limitShift() }),
    ],
  });

  // ---- Auto-update positioning ----

  useEffect(() => {
    if (!open) return;
    if (!floatingRefs.reference.current || !floatingRefs.floating.current) return;
    return autoUpdate(
      floatingRefs.reference.current,
      floatingRefs.floating.current,
      context.update,
    );
  }, [open, floatingRefs.reference, floatingRefs.floating, context]);

  // ---- Interaction hooks ----

  const click = useClick(context, {
    enabled: !disabled,
    event: "mousedown",
  });

  const role = useRole(context, {
    role: "menu",
  });

  const dismiss = useDismiss(context, {
    bubbles: { escapeKey: false },
  });

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
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
  } = useInteractions([click, role, dismiss, listNavigation, typeahead]);

  // ---- Focus management ----

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      queueMicrotask(() => {
        const firstItem = elementsRef.current.find((el) => el != null);
        firstItem?.focus();
      });
    }

    if (!open && prevOpenRef.current) {
      const trigger = triggerRef.current;
      if (trigger && trigger instanceof HTMLElement) {
        trigger.focus();
      }
    }

    prevOpenRef.current = open;
  }, [open]);

  // ---- Scroll lock for modal ----

  useEffect(() => {
    if (!open || !modal) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, modal]);

  // ---- Reset items when content unmounts ----

  useEffect(() => {
    if (!open) {
      elementsRef.current = [];
      labelsRef.current = [];
      setActiveIndex(null);
    }
  }, [open]);

  // ---- State props ----

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-open": dataAttr(open),
      }),
    [open],
  );

  // ---- Return ----

  return {
    open,
    setOpen,
    activeIndex,
    stateProps,

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
      role: "menu",
      ...getFloatingProps(),
    }),

    getItemProps: (itemProps: UseMenuItemProps) => {
      const index = itemIndexCounter.current++;
      const isActive = activeIndex === index;

      const itemStateProps = elementProps({
        "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      const ref = (node: HTMLElement | null) => {
        elementsRef.current[index] = node;
        labelsRef.current[index] = itemProps.label ?? (node?.textContent || null);
      };

      return {
        isHighlighted: isActive,
        isDisabled: itemProps.disabled,

        refs: { root: ref },
        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          ...getFloatingItemProps({
            onClick(event: React.MouseEvent) {
              if (itemProps.disabled) return;
              if (event.defaultPrevented) return;
              itemProps.onClick?.(event);
              setOpen(false);
            },
            onKeyDown(event: React.KeyboardEvent) {
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

    getSubmenuTriggerProps: (itemProps: UseMenuSubmenuTriggerProps) => {
      const index = itemIndexCounter.current++;
      const isActive = activeIndex === index;

      const itemStateProps = elementProps({
        "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      const ref = (node: HTMLElement | null) => {
        elementsRef.current[index] = node;
        labelsRef.current[index] = itemProps.label ?? (node?.textContent || null);
      };

      return {
        isHighlighted: isActive,
        isDisabled: itemProps.disabled,

        refs: { root: ref },
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

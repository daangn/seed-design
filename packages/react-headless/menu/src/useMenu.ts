"use client";

import {
  useFloatingRootContext,
  useClick,
  useRole,
  useDismiss,
  useListNavigation,
  useTypeahead,
  useInteractions,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  modal?: boolean;
  loopFocus?: boolean;
  closeParentOnEsc?: boolean;
}

export interface UseMenuItemProps {
  id?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
  label?: string;
  onClick?: React.MouseEventHandler;
}

export interface UseMenuGroupProps {
  labelId?: string;
}

export interface UseMenuGroupLabelProps {
  id?: string;
}

export interface UseMenuSubmenuTriggerProps {
  id?: string;
  disabled?: boolean;
  label?: string;
}

export type UseMenuReturn = ReturnType<typeof useMenu>;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMenu(props: UseMenuProps = {}) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange: onOpenChangeProp,
    disabled = false,
    modal = false,
    loopFocus = false,
    closeParentOnEsc = false,
  } = props;

  // ---- State ----

  const [open = false, setOpenState] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  });

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      setOpenState(nextOpen);
    },
    [disabled, setOpenState],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [referenceEl, setReferenceEl] = useState<Element | null>(null);
  const [floatingEl, setFloatingEl] = useState<HTMLElement | null>(null);

  // Refs for list navigation
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);

  // Track the trigger element for focus restoration
  const triggerRef = useRef<Element | null>(null);
  const prevOpenRef = useRef(false);

  // Item index counter — reset each render so items register in order
  const itemIndexCounter = useRef(0);
  itemIndexCounter.current = 0;

  // ---- Floating UI context ----

  const rootContext = useFloatingRootContext({
    open,
    onOpenChange: setOpen,
    elements: {
      reference: referenceEl,
      floating: floatingEl,
    },
  });

  // ---- Interaction hooks ----

  const click = useClick(rootContext, {
    enabled: !disabled,
    event: "mousedown",
  });

  const role = useRole(rootContext, {
    role: "menu",
  });

  const dismiss = useDismiss(rootContext, {
    bubbles: closeParentOnEsc ? { escapeKey: true } : { escapeKey: false },
  });

  const listNavigation = useListNavigation(rootContext, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: loopFocus,
  });

  const typeahead = useTypeahead(rootContext, {
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
        setReferenceEl(node);
        triggerRef.current = node;
      },
      content: setFloatingEl,
    },

    triggerProps: buttonProps({
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "data-open": dataAttr(open),
      ...getReferenceProps(),
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
              itemProps.onClick?.(event);
              if (itemProps.closeOnClick !== false) {
                setOpen(false);
              }
            },
            onKeyDown(event: React.KeyboardEvent) {
              if (itemProps.disabled) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                (event.currentTarget as HTMLElement).click();
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

    getGroupProps: (groupProps?: UseMenuGroupProps) => {
      return elementProps({
        role: "group",
        "aria-labelledby": groupProps?.labelId,
      });
    },

    getGroupLabelProps: (labelProps?: UseMenuGroupLabelProps) => {
      return elementProps({
        role: "presentation",
        id: labelProps?.id,
      });
    },

    getDividerProps: () => {
      return elementProps({
        role: "separator",
      });
    },
  };
}

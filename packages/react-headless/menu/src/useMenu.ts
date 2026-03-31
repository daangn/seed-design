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
import { dataAttr } from "@seed-design/dom-utils";
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

export interface MenuItemProps {
  id?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
  label?: string;
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
}

export interface MenuGroupProps {
  children?: React.ReactNode;
}

export interface MenuGroupLabelProps {
  id?: string;
  children?: React.ReactNode;
}

export interface SubmenuTriggerProps {
  id?: string;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
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

  // ---- Group label tracking ----

  const groupLabelIdMap = useRef<Map<string, string>>(new Map());

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

  // Focus first item when menu opens, return focus to trigger on close
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Menu just opened — focus the first item after a microtask
      // (allowing the floating element to mount)
      queueMicrotask(() => {
        const firstItem = elementsRef.current.find((el) => el != null);
        firstItem?.focus();
      });
    }

    if (!open && prevOpenRef.current) {
      // Menu just closed — return focus to trigger
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

  // ---- Prop getters ----

  const triggerProps = useMemo(
    () => ({
      ...getReferenceProps(),
      ref: (node: HTMLElement | null) => {
        setReferenceEl(node);
        triggerRef.current = node;
      },
      "aria-haspopup": "menu" as const,
      "aria-expanded": open,
      "data-open": dataAttr(open),
    }),
    [getReferenceProps, open],
  );

  const contentProps = useMemo(
    () => ({
      ...getFloatingProps(),
      ref: setFloatingEl,
      role: "menu" as const,
    }),
    [getFloatingProps],
  );

  const getItemProps = useCallback(
    (itemProps: MenuItemProps) => {
      const index = itemIndexCounter.current++;
      const isActive = activeIndex === index;

      return {
        ...getFloatingItemProps({
          onClick(event: React.MouseEvent) {
            if (itemProps.disabled) return;
            itemProps.onClick?.(event);
            if (itemProps.closeOnClick !== false) {
              setOpen(false);
            }
          },
        }),
        ref: (node: HTMLElement | null) => {
          elementsRef.current[index] = node;
          labelsRef.current[index] = itemProps.label ?? (node?.textContent || null);
        },
        role: "menuitem" as const,
        tabIndex: isActive ? 0 : -1,
        "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
        "aria-disabled": itemProps.disabled ? ("true" as const) : undefined,
      };
    },
    [activeIndex, getFloatingItemProps, setOpen],
  );

  const getSubmenuTriggerProps = useCallback(
    (itemProps: SubmenuTriggerProps) => {
      const index = itemIndexCounter.current++;
      const isActive = activeIndex === index;

      return {
        ...getFloatingItemProps(),
        ref: (node: HTMLElement | null) => {
          elementsRef.current[index] = node;
          labelsRef.current[index] = itemProps.label ?? (node?.textContent || null);
        },
        role: "menuitem" as const,
        tabIndex: isActive ? 0 : -1,
        "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
        "aria-disabled": itemProps.disabled ? ("true" as const) : undefined,
      };
    },
    [activeIndex, getFloatingItemProps],
  );

  const getGroupProps = useCallback(
    (groupProps?: MenuGroupProps & { "aria-labelledby"?: string }) => {
      return {
        role: "group" as const,
        "aria-labelledby": groupProps?.["aria-labelledby"],
      };
    },
    [],
  );

  const getGroupLabelProps = useCallback((labelProps?: MenuGroupLabelProps) => {
    return {
      role: "presentation" as const,
      id: labelProps?.id,
    };
  }, []);

  const getDividerProps = useCallback(() => {
    return {
      role: "separator" as const,
    };
  }, []);

  return {
    open,
    setOpen,
    activeIndex,
    triggerProps,
    contentProps,
    getItemProps,
    getSubmenuTriggerProps,
    getGroupProps,
    getGroupLabelProps,
    getDividerProps,
  };
}

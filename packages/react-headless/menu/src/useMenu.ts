"use client";

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
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

const MIN_HEIGHT = 200;

// Re-declare the SEED safe-area tokens on the positioner from env() (the same
// pattern as Snackbar's `useSafeOffset`) so `useMenu` can read them back as
// numbers without relying on the tokens being defined by the global SEED styles.
const SAFE_AREA_STYLE = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
} as React.CSSProperties;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const y = { top: "bottom", bottom: "top", left: "center", right: "center" }[side] ?? "top";
  const x = { start: "left", end: "right" }[align] ?? "center";
  return `${x} ${y}`;
}

interface MenuReasonToDetailMap {
  trigger: { event: MouseEvent | KeyboardEvent };
  escapeKeyDown: { event: KeyboardEvent };
  interactOutside: { event: PointerEvent | TouchEvent };
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

  /**
   * Whether the floating element's width should match the reference(trigger/anchor)'s width.
   * @default false
   */
  matchReferenceWidth?: boolean;
}

export interface UseMenuItemProps {
  disabled?: boolean;
  /**
   * Overrides the text label to use when the item is matched during keyboard text navigation.
   * Falls back to the element's text content if not provided.
   */
  typeaheadLabel?: string;

  // intentionally defined here; onClick is omitted in MenuItemProps since it shouldn't be merged as restProps
  /**
   * Called when the item is activated (click or keyboard).
   * Not called when the item is disabled.
   */
  onClick?: React.MouseEventHandler;
}

// implement when submenu is needed
// export interface UseMenuSubmenuTriggerProps {
//   disabled?: boolean;
//   /**
//    * Overrides the text label to use when the item is matched during keyboard text navigation.
//    * Falls back to the element's text content if not provided.
//    */
//   typeaheadLabel?: string;
// }

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
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
    matchReferenceWidth = false,
  } = props;

  // Safe-area insets as numbers, fed into floating-ui's collision padding below.
  // `flip`/`size` only understand numbers, so the values are read from the
  // positioner in JS (see the effect after `useFloating`). The positioner carries
  // its own `env()` definition via `SAFE_AREA_STYLE`, so this hook stays
  // self-contained instead of relying on the global SEED safe-area tokens.
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  // Inset the viewport collision boundary by the safe area so flip/size/shift keep
  // the menu clear of the notch and home indicator (not just the viewport edge).
  const collisionPadding = {
    top: overflowPadding + safeArea.top,
    right: overflowPadding,
    bottom: overflowPadding + safeArea.bottom,
    left: overflowPadding,
  };

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
      size({
        padding: collisionPadding,
        apply({ availableHeight, rects, elements }) {
          elements.floating.style.setProperty(
            "--seed-menu-available-height",
            `${Math.max(MIN_HEIGHT, availableHeight)}px`,
          );
          if (matchReferenceWidth) {
            elements.floating.style.setProperty(
              "--seed-menu-reference-width",
              `${rects.reference.width}px`,
            );
          }
        },
      }),
      flip({ padding: collisionPadding, fallbackStrategy: "initialPlacement" }),
      shift({ padding: collisionPadding }),
    ],
  });

  const { status } = useTransitionStatus(context);

  // Keep autoUpdate alive during exit animation so the positioner
  // follows the trigger even while the menu is animating out.
  const mounted = status !== "unmounted";

  useEffect(() => {
    if (!mounted) return;
    if (!floatingRefs.reference.current || !floatingRefs.floating.current) return;

    return autoUpdate(
      floatingRefs.reference.current,
      floatingRefs.floating.current,
      context.update,
    );
  }, [mounted, floatingRefs.reference, floatingRefs.floating, context]);

  // Resolve the safe-area insets from the positioner, which defines them via
  // `env()` (SAFE_AREA_STYLE). The positioner is always mounted, so this reads
  // valid numbers before the menu first opens. Re-read on resize for orientation.
  useEffect(() => {
    const read = () => {
      const positioner = floatingRefs.floating.current;
      if (!positioner) return;

      const styles = getComputedStyle(positioner);
      setSafeArea({
        top: Number.parseInt(styles.getPropertyValue("--seed-safe-area-top"), 10) || 0,
        bottom: Number.parseInt(styles.getPropertyValue("--seed-safe-area-bottom"), 10) || 0,
      });
    };

    read();
    window.addEventListener("resize", read);

    return () => window.removeEventListener("resize", read);
  }, [floatingRefs.floating]);

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
    // Hover and focus states should be differentiated; disable focus-on-hover
    // so that hover styling can be handled separately via CSS :hover.
    focusItemOnHover: false,
    // focusItemOnOpen: false,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const triggerInteractions = useInteractions([click, role, listNavigation, typeahead]);
  const anchorInteractions = useInteractions([role, listNavigation, typeahead]);

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
      anchor: (node: HTMLElement | null) => {
        floatingRefs.setReference(node);
      },
      trigger: (node: HTMLElement | null) => {
        floatingRefs.setReference(node);
        triggerRef.current = node;
      },
      positioner: floatingRefs.setFloating,
    },

    anchorProps: elementProps({
      "data-open": dataAttr(open),
      ...anchorInteractions.getReferenceProps(),
    }),

    triggerProps: buttonProps({
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "data-open": dataAttr(open),
      ...triggerInteractions.getReferenceProps(),
    }),

    positionerProps: elementProps({
      ...stateProps,
      style: { ...SAFE_AREA_STYLE, ...floatingStyles },
    }),

    contentProps: elementProps({
      ...stateProps,
      role: "menu",
      style: {
        "--seed-menu-transform-origin": getTransformOrigin(context.placement),
      } as React.CSSProperties,
      ...triggerInteractions.getFloatingProps(),
    }),

    getItemProps: (itemProps: UseMenuItemProps, index: number) => {
      const isActive = activeIndex === index;

      const itemStateProps = elementProps({
        // implement when submenu is needed
        // "data-highlighted": dataAttr(isActive),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      return {
        // implement when submenu is needed
        // isHighlighted: isActive,
        isDisabled: itemProps.disabled,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          ...triggerInteractions.getItemProps({
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

    // implement when submenu is needed
    // getSubmenuTriggerProps: (itemProps: UseMenuSubmenuTriggerProps, index: number) => {
    //   const isActive = activeIndex === index;
    //
    //   const itemStateProps = elementProps({
    //     "data-highlighted": dataAttr(isActive),
    //     "data-disabled": dataAttr(itemProps.disabled),
    //   });
    //
    //   return {
    //     isHighlighted: isActive,
    //     isDisabled: itemProps.disabled,
    //
    //     stateProps: itemStateProps,
    //
    //     rootProps: elementProps({
    //       ...itemStateProps,
    //       ...triggerInteractions.getItemProps(),
    //       role: "menuitem",
    //       tabIndex: isActive ? 0 : -1,
    //       "aria-disabled": itemProps.disabled ? "true" : undefined,
    //     }),
    //   };
    // },

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
  };
}

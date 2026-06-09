"use client";

import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStatus,
  type OpenChangeReason,
  type Placement,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MIN_HEIGHT = 200;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const y = { top: "bottom", bottom: "top", left: "center", right: "center" }[side] ?? "top";
  const x = { start: "left", end: "right" }[align] ?? "center";
  return `${x} ${y}`;
}

export type NavigationMenuOrientation = "horizontal" | "vertical";

interface UseNavigationMenuStateProps {
  /**
   * The value of the currently open item. `null` means nothing is open.
   */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface UseNavigationMenuProps extends UseNavigationMenuStateProps {
  /**
   * Layout orientation of the trigger list. Also decides the default flyout
   * placement (`bottom-start` for horizontal, `right-start` for vertical).
   * @default "horizontal"
   */
  orientation?: NavigationMenuOrientation;

  /**
   * Delay in ms before a hovered trigger opens. Skipped (0ms) while another
   * item is already open, so moving between siblings feels instant.
   * @default 200
   */
  openDelay?: number;

  /**
   * Delay in ms before an item closes after the pointer leaves.
   * @default 150
   */
  closeDelay?: number;

  /**
   * Disable opening on hover. Useful to force click-only behavior.
   * @default false
   */
  disableHoverTrigger?: boolean;

  /**
   * Disable opening on click. Useful to force hover-only behavior.
   * @default false
   */
  disableClickTrigger?: boolean;
}

export type UseNavigationMenuReturn = ReturnType<typeof useNavigationMenu>;

export function useNavigationMenu(props: UseNavigationMenuProps) {
  const {
    orientation = "horizontal",
    openDelay = 200,
    closeDelay = 150,
    disableHoverTrigger = false,
    disableClickTrigger = false,
  } = props;

  const [value = null, setValue] = useControllableState<string | null>({
    prop: props.value,
    defaultProp: props.defaultValue ?? null,
    onChange: props.onValueChange,
  });

  // Latest value, read synchronously inside the hover delay callback so that
  // moving between sibling triggers skips the open delay.
  const valueRef = useRef(value);
  valueRef.current = value;

  return useMemo(
    () => ({
      value,
      setValue,
      valueRef,
      orientation,
      openDelay,
      closeDelay,
      hoverEnabled: !disableHoverTrigger,
      clickEnabled: !disableClickTrigger,
    }),
    [value, setValue, orientation, openDelay, closeDelay, disableHoverTrigger, disableClickTrigger],
  );
}

export interface UseNavigationMenuItemProps {
  /**
   * Identifies this item within the shared open state. Must be unique per Root.
   */
  value: string;
  disabled?: boolean;

  /**
   * Floating UI placement. Defaults to the Root orientation's natural side.
   */
  placement?: Placement;

  /**
   * Distance between trigger and flyout.
   * @default 8
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

export type UseNavigationMenuItemReturn = ReturnType<typeof useNavigationMenuItem>;

export function useNavigationMenuItem(
  root: UseNavigationMenuReturn,
  props: UseNavigationMenuItemProps,
) {
  const {
    value: itemValue,
    disabled = false,
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
  } = props;
  const {
    value: openValue,
    setValue,
    valueRef,
    orientation,
    openDelay,
    closeDelay,
    hoverEnabled,
    clickEnabled,
  } = root;

  const open = openValue === itemValue;

  // Whether the flyout should manage focus (move it into the content, keep Tab
  // order coherent across the portal, and return focus to the trigger on close).
  // Enabled only for keyboard activation — mouse hover/click never steals focus.
  const [focusManaged, setFocusManaged] = useState(false);

  // Reset when this item closes (including when a sibling opens and flips the
  // shared open value out from under it, bypassing this item's onOpenChange).
  useEffect(() => {
    if (!open) setFocusManaged(false);
  }, [open]);

  const id = useId();
  const triggerId = `navigation-menu-trigger-${id}`;
  const contentId = `navigation-menu-content-${id}`;

  const groupIndexCounter = useRef(0);
  groupIndexCounter.current = 0;

  const placement: Placement =
    props.placement ?? (orientation === "vertical" ? "right-start" : "bottom-start");

  const onOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (disabled && nextOpen) return;
      // Manage focus only for keyboard activation. A keyboard-activated
      // <button> dispatches a click with `detail === 0`; mouse clicks report
      // `detail >= 1` and hover reports reason "hover" — neither should pull
      // focus off the page.
      setFocusManaged(
        nextOpen && reason !== "hover" && event instanceof UIEvent && event.detail === 0,
      );
      setValue(nextOpen ? itemValue : null);
    },
    [disabled, setValue, itemValue],
  );

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange,
    strategy,
    placement,
    middleware: [
      offset(gutter),
      size({
        padding: overflowPadding,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty(
            "--seed-menu-available-height",
            `${Math.max(MIN_HEIGHT, availableHeight)}px`,
          );
        },
      }),
      flip({ padding: overflowPadding, fallbackStrategy: "initialPlacement" }),
      shift({ padding: overflowPadding }),
    ],
  });

  const { status } = useTransitionStatus(context);
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

  // Hover is gated to mouse pointers (`mouseOnly`) so touch falls back to the
  // click interaction. `safePolygon` keeps the flyout open while the pointer
  // travels from the trigger to the content (WCAG 1.4.13 "hoverable").
  // The delay opens instantly when another item is already open (skip-delay).
  const hover = useHover(context, {
    enabled: hoverEnabled && !disabled,
    mouseOnly: true,
    handleClose: safePolygon(),
    delay: () =>
      valueRef.current != null
        ? { open: 0, close: closeDelay }
        : { open: openDelay, close: closeDelay },
  });

  const click = useClick(context, {
    enabled: clickEnabled && !disabled,
  });

  const dismiss = useDismiss(context, {
    enabled: open,
  });

  const interactions = useInteractions([hover, click, dismiss]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-hidden": dataAttr(status === "unmounted"),
        "data-open": dataAttr(status === "open" || status === "initial"),
        "data-orientation": orientation,
      }),
    [status, orientation],
  );

  return {
    value: itemValue,
    open,
    disabled,
    focusManaged,

    floatingContext: context,
    stateProps,

    refs: {
      trigger: (node: HTMLElement | null) => {
        floatingRefs.setReference(node);
      },
      positioner: floatingRefs.setFloating,
    },

    triggerProps: buttonProps({
      id: triggerId,
      // Disclosure pattern: no aria-haspopup, no role="menu".
      "aria-expanded": open,
      "aria-controls": contentId,
      "data-open": dataAttr(open),
      "data-disabled": dataAttr(disabled),
      disabled,
      ...interactions.getReferenceProps(),
    }),

    positionerProps: elementProps({
      ...stateProps,
      style: floatingStyles,
    }),

    contentProps: elementProps({
      ...stateProps,
      id: contentId,
      "aria-labelledby": triggerId,
      style: {
        "--seed-menu-transform-origin": getTransformOrigin(context.placement),
      } as React.CSSProperties,
      ...interactions.getFloatingProps(),
    }),

    getLinkProps: (linkProps?: { current?: boolean }) =>
      elementProps({
        "aria-current": linkProps?.current ? ("page" as const) : undefined,
        "data-current": dataAttr(linkProps?.current),
        // Selecting a navigation link closes the flyout. This fires even when
        // the consumer calls preventDefault for client-side routing (an SPA
        // Link always does), so it is intentionally not gated on
        // event.defaultPrevented.
        onClick: () => setValue(null),
      }),

    getGroupProps: () => {
      const groupIndex = groupIndexCounter.current++;
      const labelId = `navigation-menu:${id}:group-${groupIndex}:label`;
      return {
        labelId,
        rootProps: elementProps({
          role: "group",
          "aria-labelledby": labelId,
        }),
      };
    },

    getGroupLabelProps: (labelId: string) =>
      elementProps({
        role: "presentation",
        id: labelId,
      }),
  };
}

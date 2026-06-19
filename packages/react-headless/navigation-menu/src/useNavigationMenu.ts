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
  useNextDelayGroup,
  useTransitionStatus,
  type OpenChangeReason,
  type Placement,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MIN_HEIGHT = 200;

/** Default open delay (ms) for the `NavigationMenuProvider` delay group. */
export const DEFAULT_OPEN_DELAY = 200;
/** Default close delay (ms) for the `NavigationMenuProvider` delay group. */
export const DEFAULT_CLOSE_DELAY = 100;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const y = { top: "bottom", bottom: "top", left: "center", right: "center" }[side] ?? "top";
  const x = { start: "left", end: "right" }[align] ?? "center";
  return `${x} ${y}`;
}

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
   * Default Floating UI placement for every item's flyout. Each item can
   * override it via its own `placement`.
   * @default "bottom"
   */
  placement?: Placement;

  /**
   * Delay in ms before a hovered trigger opens. Skipped (0ms) while another
   * item is already open, so moving between siblings feels instant.
   * @default 200
   */
  openDelay?: number;

  /**
   * Delay in ms before an item closes after the pointer leaves.
   * @default 100
   */
  closeDelay?: number;
}

export type UseNavigationMenuReturn = ReturnType<typeof useNavigationMenu>;

export function useNavigationMenu({
  value: propValue,
  defaultValue: propDefaultValue,
  onValueChange,
  placement = "bottom",
  // Kept undefined when not set so the `NavigationMenuProvider` delay group applies
  // the shared default (see `useGroupDelay`); defaults are applied at the delay call site.
  openDelay,
  closeDelay,
}: UseNavigationMenuProps) {
  const [value = null, setValue] = useControllableState<string | null>({
    prop: propValue,
    defaultProp: propDefaultValue ?? null,
    onChange: onValueChange,
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
      placement,
      openDelay,
      closeDelay,
    }),
    [value, setValue, placement, openDelay, closeDelay],
  );
}

export interface UseNavigationMenuRootProps {
  /**
   * Identifies this menu within the shared open state. Must be unique per Provider.
   */
  value: string;
  disabled?: boolean;

  /**
   * Floating UI placement. Defaults to the Provider's `placement`.
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

export type UseNavigationMenuRootReturn = ReturnType<typeof useNavigationMenuRoot>;

export type UseNavigationMenuItemReturn = ReturnType<UseNavigationMenuRootReturn["getItemProps"]>;

export function useNavigationMenuRoot(
  root: UseNavigationMenuReturn,
  props: UseNavigationMenuRootProps,
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
    placement: rootPlacement,
    openDelay,
    closeDelay,
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

  const placement: Placement = props.placement ?? rootPlacement;

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
      // Only clear the shared value if this item is still the open one. Moving to
      // a sibling opens it instantly (delay group), then this item's delayed
      // hover-close fires; an unconditional setValue(null) would clobber it.
      setValue((prev) => (nextOpen ? itemValue : prev === itemValue ? null : prev));
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

  // Participate in the delay group provided by `NavigationMenuRoot` (a floating-ui
  // `NextFloatingDelayGroup`, shared with `HelpBubbleTooltip`): once any grouped
  // trigger — nav flyout or tooltip — is open, the rest skip their open delay.
  const group = useNextDelayGroup(context);
  const useGroupDelay = group.hasProvider && openDelay === undefined && closeDelay === undefined;

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
    enabled: !disabled,
    mouseOnly: true,
    handleClose: safePolygon(),
    delay: useGroupDelay
      ? () => group.delayRef.current
      : () =>
          valueRef.current != null
            ? { open: 0, close: closeDelay ?? DEFAULT_CLOSE_DELAY }
            : {
                open: openDelay ?? DEFAULT_OPEN_DELAY,
                close: closeDelay ?? DEFAULT_CLOSE_DELAY,
              },
  });

  const click = useClick(context, {
    enabled: !disabled,
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
        "data-instant": dataAttr(group.isInstantPhase),
      }),
    [status, group.isInstantPhase],
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

    getItemProps: (itemProps?: { current?: boolean; disabled?: boolean }) => {
      const itemStateProps = elementProps({
        "data-current": dataAttr(itemProps?.current),
        "data-disabled": dataAttr(itemProps?.disabled),
      });

      return {
        stateProps: itemStateProps,
        rootProps: buttonProps({
          ...itemStateProps,
          disabled: itemProps?.disabled,
          "aria-current": itemProps?.current ? ("page" as const) : undefined,
          // Selecting a navigation item closes the flyout. A disabled <button>
          // never fires click, so this is safe to attach unconditionally.
          onClick: () => setValue(null),
        }),
      };
    },

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

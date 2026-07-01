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
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MIN_HEIGHT = 200;

// See the equivalent note in `@seed-design/react-menu`'s useMenu: flip/size/shift
// derive collisions from numeric padding, so the safe-area insets have to reach
// floating-ui as px numbers. The positioner re-declares them from env() via
// SAFE_AREA_STYLE and the hook reads them back below, keeping this layer
// self-contained from the global SEED safe-area tokens.
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

interface SelectReasonToDetailMap {
  trigger: { event: MouseEvent | KeyboardEvent };
  escapeKeyDown: { event: KeyboardEvent };
  interactOutside: { event: PointerEvent | TouchEvent };
  cascadeDismiss: { dismissedParent: HTMLElement };
  itemSelect: { event: Event };
}

type SelectOpenChangeDetails = {
  [R in keyof SelectReasonToDetailMap]: {
    reason?: R;
  } & SelectReasonToDetailMap[R];
}[keyof SelectReasonToDetailMap];

interface SelectValueReasonToDetailMap {
  itemSelect: { event: Event };
  hiddenSelect: { event: Event };
}

export type SelectValueChangeDetails = {
  [R in keyof SelectValueReasonToDetailMap]: {
    reason?: R;
  } & SelectValueReasonToDetailMap[R];
}[keyof SelectValueReasonToDetailMap];

interface UseSelectStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details?: SelectOpenChangeDetails) => void;

  /**
   * The selected value. `null` means nothing is selected.
   */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, details?: SelectValueChangeDetails) => void;
}

export interface UseSelectProps extends UseSelectStateProps {
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;

  /**
   * Name of the hidden native `<select>` used for form submission.
   */
  name?: string;
  /**
   * Associates the hidden native `<select>` with a form by id.
   */
  form?: string;
  /**
   * Marks the hidden native `<select>` as required for form validation.
   */
  required?: boolean;

  /**
   * Floating UI placement. @default "bottom"
   */
  placement?: Placement;

  /**
   * Distance between trigger and listbox.
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
   * Whether the listbox width should match the trigger width.
   * @default true
   */
  matchReferenceWidth?: boolean;
}

export interface UseSelectItemProps {
  /**
   * The value this option represents.
   */
  value: string;
  disabled?: boolean;
  /**
   * Overrides the text used when matching the option during keyboard typeahead.
   * Falls back to the item's text content if not provided.
   */
  typeaheadLabel?: string;
}

export type UseSelectReturn = ReturnType<typeof useSelect>;

export type GetItemPropsReturn = ReturnType<UseSelectReturn["getItemProps"]>;

function useSelectState(props: UseSelectStateProps) {
  const [open = false, setOpenState] = useControllableState<
    boolean,
    Parameters<NonNullable<UseSelectStateProps["onOpenChange"]>>[1]
  >({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const [value = null, setValueState] = useControllableState<
    string | null,
    SelectValueChangeDetails
  >({
    prop: props.value,
    defaultProp: props.defaultValue ?? null,
    onChange: props.onValueChange,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // value -> display label, kept for the trigger Value slot and the hidden native <select> options.
  const [nativeOptions, setNativeOptions] = useState<Map<string, ReactNode>>(() => new Map());

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  const groupIndexCounter = useRef(0);
  groupIndexCounter.current = 0;

  const selectId = useId();

  return {
    open,
    setOpenState,
    value,
    setValueState,
    activeIndex,
    setActiveIndex,
    selectedIndex,
    setSelectedIndex,
    nativeOptions,
    setNativeOptions,
    elementsRef,
    labelsRef,
    triggerRef,
    groupIndexCounter,
    selectId,
  };
}

export function useSelect(props: UseSelectProps) {
  const {
    open,
    setOpenState,
    value,
    setValueState,
    activeIndex,
    setActiveIndex,
    selectedIndex,
    setSelectedIndex,
    nativeOptions,
    setNativeOptions,
    elementsRef,
    labelsRef,
    triggerRef,
    groupIndexCounter,
    selectId,
  } = useSelectState(props);

  const {
    disabled = false,
    invalid = false,
    readOnly = false,
    name,
    form,
    required = false,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
    matchReferenceWidth = true,
  } = props;

  const interactive = !disabled && !readOnly;

  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  const collisionPadding = {
    top: safeArea.top || overflowPadding,
    right: overflowPadding,
    bottom: safeArea.bottom || overflowPadding,
    left: overflowPadding,
  };

  const setOpen = useCallback(
    (nextOpen: boolean, details?: SelectOpenChangeDetails) => {
      if (!interactive && nextOpen) return;
      setOpenState(nextOpen, details);
    },
    [interactive, setOpenState],
  );

  const setValue = useCallback(
    (nextValue: string | null, details?: SelectValueChangeDetails) => {
      setValueState(nextValue, details);
    },
    [setValueState],
  );

  const selectValue = useCallback(
    (nextValue: string, event: Event) => {
      setValue(nextValue, { reason: "itemSelect", event });
      setOpen(false, { reason: "itemSelect", event });
    },
    [setValue, setOpen],
  );

  const registerOption = useCallback(
    (optionValue: string, label: ReactNode) => {
      setNativeOptions((prev) => {
        if (prev.get(optionValue) === label) return prev;
        const next = new Map(prev);
        next.set(optionValue, label);
        return next;
      });
    },
    [setNativeOptions],
  );

  const unregisterOption = useCallback(
    (optionValue: string) => {
      setNativeOptions((prev) => {
        if (!prev.has(optionValue)) return prev;
        const next = new Map(prev);
        next.delete(optionValue);
        return next;
      });
    },
    [setNativeOptions],
  );

  const handleFloatingOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: string) => {
      if (reason === "click" && event) {
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
            "--seed-select-available-height",
            `${Math.max(MIN_HEIGHT, availableHeight)}px`,
          );
          if (matchReferenceWidth) {
            elements.floating.style.setProperty(
              "--seed-select-reference-width",
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

  const floatingElement = context.elements.floating;

  useEffect(() => {
    if (!floatingElement) return;

    const read = () => {
      const styles = getComputedStyle(floatingElement);
      setSafeArea({
        top: Number.parseInt(styles.getPropertyValue("--seed-safe-area-top"), 10) || 0,
        bottom: Number.parseInt(styles.getPropertyValue("--seed-safe-area-bottom"), 10) || 0,
      });
    };

    read();
    window.addEventListener("resize", read);

    return () => window.removeEventListener("resize", read);
  }, [floatingElement]);

  // Keep selectedIndex in sync with the selected value by scanning the rendered
  // options' data-value. Runs when the value or the set of options changes, so
  // controlled updates and defaultValue-on-mount both resolve to a list index
  // (used by floating-ui to highlight the selected option when the list opens).
  useEffect(() => {
    const index = elementsRef.current.findIndex(
      (element) => element?.getAttribute("data-value") === value,
    );
    setSelectedIndex(index === -1 ? null : index);
  }, [value, nativeOptions, elementsRef, setSelectedIndex]);

  const click = useClick(context, {
    enabled: interactive,
  });

  // role: "select" sets the select-only combobox contract — reference role
  // "combobox" + aria-haspopup/expanded/controls/autocomplete=none, floating
  // role "listbox", and item role "option" with aria-selected.
  const role = useRole(context, {
    role: "select",
  });

  // virtual: keep DOM focus on the trigger and expose the active option through
  // aria-activedescendant (the APG combobox pattern), instead of moving focus
  // into the list. focusItemOnHover stays off so pointer hover is handled by CSS.
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
    focusItemOnHover: false,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: setActiveIndex,
  });

  const triggerInteractions = useInteractions([click, role, listNavigation, typeahead]);

  const triggerStateProps = useMemo(
    () =>
      elementProps({
        "data-open": dataAttr(open),
        "data-disabled": dataAttr(disabled),
        "data-invalid": dataAttr(invalid),
        "data-readonly": dataAttr(readOnly),
      }),
    [open, disabled, invalid, readOnly],
  );

  const contentStateProps = useMemo(
    () =>
      elementProps({
        "data-hidden": dataAttr(status === "unmounted"),
        "data-open": dataAttr(status === "open" || status === "initial"),
      }),
    [status],
  );

  const selectedLabel = value !== null ? (nativeOptions.get(value) ?? null) : null;

  const handleTriggerKeyDown: React.KeyboardEventHandler = (event) => {
    if (!interactive) return;
    // When closed, let useClick / useListNavigation open the listbox.
    if (!open) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (activeIndex !== null) {
        const node = elementsRef.current[activeIndex];
        const nextValue = node?.getAttribute("data-value");
        const isDisabled = node?.hasAttribute("data-disabled") ?? false;
        if (nextValue != null && !isDisabled) {
          selectValue(nextValue, event.nativeEvent);
          return;
        }
      }

      setOpen(false, { reason: "trigger", event: event.nativeEvent });
    }
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    selectedLabel,
    activeIndex,
    selectedIndex,

    disabled,
    invalid,
    readOnly,
    required,
    name,
    form,

    nativeOptions,
    registerOption,
    unregisterOption,
    selectValue,

    // exposed as `stateProps` for createWithStateProps consumers (trigger sub-slots).
    stateProps: triggerStateProps,
    triggerStateProps,
    contentStateProps,

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
      ...triggerStateProps,
      disabled,
      ...triggerInteractions.getReferenceProps({
        onKeyDown: handleTriggerKeyDown,
      }),
    }),

    positionerProps: elementProps({
      ...contentStateProps,
      style: { ...SAFE_AREA_STYLE, ...floatingStyles },
    }),

    contentProps: elementProps({
      ...contentStateProps,
      style: {
        "--seed-select-transform-origin": getTransformOrigin(context.placement),
      } as React.CSSProperties,
      ...triggerInteractions.getFloatingProps(),
    }),

    getItemProps: (itemProps: UseSelectItemProps, index: number) => {
      const isActive = activeIndex === index;
      const isSelected = value !== null && value === itemProps.value;

      const itemStateProps = elementProps({
        "data-highlighted": dataAttr(isActive),
        "data-selected": dataAttr(isSelected),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      return {
        isSelected,
        isDisabled: itemProps.disabled,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          "data-value": itemProps.value,
          ...triggerInteractions.getItemProps({
            active: isActive,
            selected: isSelected,
            onClick(event) {
              if (itemProps.disabled) return;
              if (event.defaultPrevented) return;
              selectValue(itemProps.value, event.nativeEvent);
            },
          }),
          "aria-disabled": ariaAttr(itemProps.disabled),
        }),
      };
    },

    getGroupProps: () => {
      const groupIndex = groupIndexCounter.current++;
      const labelId = `select:${selectId}:group-${groupIndex}:label`;
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

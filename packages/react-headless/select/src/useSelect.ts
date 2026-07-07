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
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MIN_HEIGHT = 200;

// Stable empty-selection reference so uncontrolled Selects don't churn identity.
const EMPTY_VALUE: string[] = [];

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

interface UseSelectStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * The selected values. An empty array means nothing is selected. Single-select
   * carries at most one entry; multi-select carries one per chosen option.
   */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
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

  /**
   * Allows selecting more than one option. When enabled, choosing an option
   * toggles its membership and the listbox stays open; single-select replaces the
   * value and closes. The value is a `string[]` in both modes.
   * @default false
   */
  multiple?: boolean;
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

/**
 * A selected option projected for display: its `value`, the rich `label` node, and
 * the plain `textValue` string used for the multi-select trigger join and the
 * hidden native `<option>`.
 */
export interface SelectedItem {
  value: string;
  label: ReactNode;
  textValue: string;
}

export type UseSelectReturn = ReturnType<typeof useSelect>;

export type GetItemPropsReturn = ReturnType<UseSelectReturn["getItemProps"]>;

function useSelectState(props: UseSelectStateProps) {
  const [open = false, setOpenState] = useControllableState<boolean>({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  const [value = EMPTY_VALUE, setValueState] = useControllableState<string[]>({
    prop: props.value,
    defaultProp: props.defaultValue ?? EMPTY_VALUE,
    onChange: props.onValueChange,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // value -> { label, textValue }, kept for the trigger Value slot and the hidden
  // native <select> options. `label` is the rich display node; `textValue` is the
  // plain string used for the multi-select join and the native <option> text.
  const [nativeOptions, setNativeOptions] = useState<
    Map<string, { label: ReactNode; textValue: string }>
  >(() => new Map());

  // Ids of group labels that have actually rendered. A group only advertises
  // aria-labelledby once its label registers here, so a group with no rendered
  // label never points at a non-existent id.
  const [groupLabelIds, setGroupLabelIds] = useState<ReadonlySet<string>>(() => new Set());

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
    groupLabelIds,
    setGroupLabelIds,
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
    groupLabelIds,
    setGroupLabelIds,
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
    multiple = false,
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
    (nextOpen: boolean) => {
      if (!interactive && nextOpen) return;
      setOpenState(nextOpen);
    },
    [interactive, setOpenState],
  );

  const setValue = useCallback(
    (nextValue: string[]) => {
      setValueState(nextValue);
    },
    [setValueState],
  );

  const selectValue = useCallback(
    (optionValue: string) => {
      setValue(
        multiple
          ? value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]
          : [optionValue],
      );
      if (!multiple) setOpen(false);
    },
    [multiple, value, setValue, setOpen],
  );

  const registerOption = useCallback(
    (optionValue: string, entry: { label: ReactNode; textValue: string }) => {
      setNativeOptions((prev) => {
        const existing = prev.get(optionValue);
        if (existing && existing.label === entry.label && existing.textValue === entry.textValue) {
          return prev;
        }
        const next = new Map(prev);
        next.set(optionValue, entry);
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

  // A group label reports its presence here so the group can reference it via
  // aria-labelledby only when it is actually rendered (see getGroupProps).
  const registerGroupLabel = useCallback(
    (labelId: string) => {
      setGroupLabelIds((prev) => {
        if (prev.has(labelId)) return prev;
        const next = new Set(prev);
        next.add(labelId);
        return next;
      });
    },
    [setGroupLabelIds],
  );

  const unregisterGroupLabel = useCallback(
    (labelId: string) => {
      setGroupLabelIds((prev) => {
        if (!prev.has(labelId)) return prev;
        const next = new Set(prev);
        next.delete(labelId);
        return next;
      });
    },
    [setGroupLabelIds],
  );

  const handleFloatingOpenChange = useCallback(
    (nextOpen: boolean) => {
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
    const index = elementsRef.current.findIndex((element) => {
      const optionValue = element?.getAttribute("data-value");
      return optionValue != null && value.includes(optionValue);
    });
    setSelectedIndex(index === -1 ? null : index);
  }, [value, nativeOptions, elementsRef, setSelectedIndex]);

  // APG: when the listbox opens, seed the active option from the current
  // selection so aria-activedescendant points at the selected option
  // immediately, instead of only after the first arrow key. Fires on the open
  // rising edge (via wasOpenRef) so it never overrides in-list navigation.
  //
  // The index is resolved from the live elementsRef rather than selectedIndex
  // state: item registration can lag, so the state can still read null at open.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      const index = elementsRef.current.findIndex((element) => {
        const optionValue = element?.getAttribute("data-value");
        return optionValue != null && value.includes(optionValue);
      });
      setActiveIndex(index === -1 ? null : index);
    }
    wasOpenRef.current = open;
    // elementsRef is stable; listed for parity with the selectedIndex sync effect above.
  }, [open, value, elementsRef, setActiveIndex]);

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

  const selectedItems: SelectedItem[] = value.flatMap((optionValue) => {
    const entry = nativeOptions.get(optionValue);
    return entry ? [{ value: optionValue, label: entry.label, textValue: entry.textValue }] : [];
  });

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
          selectValue(nextValue);
          return;
        }
      }

      setOpen(false);
    }
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    multiple,
    selectedItems,
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
    registerGroupLabel,
    unregisterGroupLabel,
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
      type: "button",
      ...triggerStateProps,
      disabled,
      // Surface validation state on the combobox itself (kept in sync with the
      // hidden native <select>), matching Ark — always present, false included.
      "aria-required": required,
      "aria-invalid": invalid,
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
      ...(multiple && { "aria-multiselectable": true }),
      style: {
        "--seed-select-transform-origin": getTransformOrigin(context.placement),
      } as React.CSSProperties,
      ...triggerInteractions.getFloatingProps(),
    }),

    getItemProps: (itemProps: UseSelectItemProps, index: number) => {
      const isActive = activeIndex === index;
      const isSelected = value.includes(itemProps.value);

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
              selectValue(itemProps.value);
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
          // Reference the label only once it has actually rendered; a group
          // without a label must not point aria-labelledby at a missing id.
          ...(groupLabelIds.has(labelId) && { "aria-labelledby": labelId }),
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

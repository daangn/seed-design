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
  type OpenChangeReason,
  type Placement,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MIN_HEIGHT = 200;

// Stable empty-selection reference so uncontrolled Selects don't churn identity.
const EMPTY_VALUE: string[] = [];

// flip/size/shift derive collisions from numeric padding, so the safe-area insets
// have to reach floating-ui as px numbers. The positioner re-declares them from
// env() via SAFE_AREA_STYLE and the hook reads them back below, keeping this layer
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
   * Allows selecting more than one option. When enabled, choosing an option
   * toggles its membership and the listbox stays open; single-select replaces the
   * value and closes. The value is a `string[]` in both modes.
   * @default false
   */
  multiple?: boolean;

  /**
   * Customizes the value rendered by `SelectValue` from the selected items.
   * Overrides the default (single-select: the option's `label` node;
   * multi-select: the options' `textValue`s joined by `", "`). `SelectValue`'s
   * `children`, when provided, still wins.
   */
  formatValue?: (items: SelectedItem[]) => ReactNode;
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
  /**
   * The option's prefix icon, mirrored into the trigger prefix slot when this is
   * the only selected item.
   */
  prefixIcon?: ReactNode;
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

  // value -> { label, textValue, prefixIcon }, kept for the trigger Value slot and
  // the hidden native <select> options. `label` is the rich display node; `textValue`
  // is the plain string used for the multi-select join and the native <option> text;
  // `prefixIcon` is mirrored into the trigger prefix slot on single selection.
  const [nativeOptions, setNativeOptions] = useState<
    Map<string, { label: ReactNode; textValue: string; prefixIcon?: ReactNode }>
  >(() => new Map());

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

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
    multiple = false,
    formatValue,
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
    (
      optionValue: string,
      entry: { label: ReactNode; textValue: string; prefixIcon?: ReactNode },
    ) => {
      setNativeOptions((prev) => {
        const existing = prev.get(optionValue);
        if (
          existing &&
          existing.label === entry.label &&
          existing.textValue === entry.textValue &&
          existing.prefixIcon === entry.prefixIcon
        ) {
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

  // Tracks whether the current open was initiated by the keyboard. Read below to gate
  // the open-time active-option seed to keyboard opens: the manual seed effect (selection
  // present) and navSelectedIndex (which hides the selection from useListNavigation on
  // pointer opens so floating-ui's own seed stays off). Arrow-open reports reason
  // "list-navigation"; Enter/Space on the <button> trigger dispatch a synthetic click
  // whose detail is 0 (floating-ui's own isVirtualClick heuristic), while a real
  // pointer/tap click carries detail >= 1 so it never reads as keyboard.
  const openViaKeyboardRef = useRef(false);

  const handleFloatingOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) {
        openViaKeyboardRef.current =
          reason === "list-navigation" ||
          event instanceof KeyboardEvent ||
          (event instanceof MouseEvent && event.detail === 0);
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
          elements.floating.style.setProperty(
            "--seed-select-reference-width",
            `${rects.reference.width}px`,
          );
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

  // APG: when the listbox is opened via the keyboard, seed the active option from the
  // current selection so aria-activedescendant points at it immediately (before the
  // first arrow key). Fires on the open rising edge so it never overrides in-list
  // navigation. Pointer/tap opens are excluded (openViaKeyboardRef) so they show no
  // highlight — a seeded highlight reads as a stuck "pressed" state on touch.
  //
  // Only seeds when a selection exists, and reads the index from the live elementsRef
  // rather than selectedIndex state (item registration lags, so the state can still be
  // null at open). The no-selection keyboard case — first-item highlight — is left to
  // useListNavigation's focusItemOnOpen="auto", which resolves it from the live list.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current && openViaKeyboardRef.current) {
      const index = elementsRef.current.findIndex((element) => {
        const optionValue = element?.getAttribute("data-value");
        return optionValue != null && value.includes(optionValue);
      });
      if (index !== -1) setActiveIndex(index);
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

  // Keyboard-gated open seeding. focusItemOnOpen defaults to "auto", so on open
  // useListNavigation seeds the selected option as the active option for every
  // modality. We only want that highlight on keyboard opens — on a pointer/tap open a
  // seeded highlight reads as a stuck "pressed" state (mobile-first). Hiding the
  // selection from navigation while a pointer-opened listbox is open suppresses the
  // seed; the exposed selectedIndex and the option's data-selected/checkmark are
  // driven by `value` and stay intact. Keyboard nav (arrow/typeahead) resumes from the
  // real selection because openViaKeyboardRef is set before this recomputes.
  const navSelectedIndex = open && !openViaKeyboardRef.current ? null : selectedIndex;

  // virtual: keep DOM focus on the trigger and expose the active option through
  // aria-activedescendant (the APG combobox pattern), instead of moving focus
  // into the list. focusItemOnHover moves that single active option to the hovered
  // item so pointer hover and keyboard navigation share one highlight — the visual
  // highlight must track aria-activedescendant, so it can never sit on two options.
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex: navSelectedIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
    focusItemOnHover: true,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex: navSelectedIndex,
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
    return entry
      ? [
          {
            value: optionValue,
            label: entry.label,
            textValue: entry.textValue,
            prefixIcon: entry.prefixIcon,
          },
        ]
      : [];
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
    formatValue,
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
  };
}

export type UseSelectGroupReturn = ReturnType<typeof useSelectGroup>;

// A group advertises aria-labelledby only while its label is actually rendered.
// Mirrors useFieldset: a callback ref flips a boolean synchronously at commit, so
// the attribute is present on first paint and never points at a missing id — no
// select-global registry or render-order ids needed. Each group owns its own id and
// presence flag, so conditionally rendering or reordering groups can never make one
// group inherit another's label reference.
export function useSelectGroup() {
  const id = useId();
  const labelId = `select-group:${id}:label`;

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLDivElement | null) => {
    setIsLabelRendered(!!node);
  }, []);

  return {
    refs: {
      label: labelRef,
    },

    rootProps: elementProps({
      role: "group",
      ...(isLabelRendered && { "aria-labelledby": labelId }),
    }),

    labelProps: elementProps({
      role: "presentation",
      id: labelId,
    }),
  };
}

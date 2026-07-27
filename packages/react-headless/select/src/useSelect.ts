"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useListItem,
  useTransitionStatus,
  useTypeahead,
  type Placement,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import {
  buttonProps,
  dataAttr,
  elementProps,
  selectProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type * as React from "react";
// Type-only on the way back (`import type { UseSelectReturn }`), so this pair of
// modules never forms a runtime cycle.
import { useSelectContext } from "./useSelectContext";

const MIN_HEIGHT = 200;

// Uncontrolled empty selection keeps one stable reference so consumers can
// memo/compare by identity across renders.
const EMPTY_VALUE: string[] = [];

// flip/size/shift derive collisions from numeric padding, so the safe-area insets
// have to reach floating-ui as numbers — a CSS env() value alone can't. The
// positioner re-declares the insets from env() here and the hook reads them back
// as px (see the effect after useFloating), which keeps this layer self-contained
// from the global SEED safe-area tokens.
const SAFE_AREA_STYLE = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
} as React.CSSProperties;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const x = { start: "left", end: "right" }[align ?? ""] ?? "center";
  const y = { top: "bottom", bottom: "top", left: "center", right: "center" }[side ?? ""] ?? "top";
  return `${x} ${y}`;
}

const isSameValue = (a: string[], b: string[]) =>
  a.length === b.length && a.every((entry, index) => entry === b[index]);

// Disabled state is read off the rendered elements (aria-disabled)
// rather than a parallel registry: item registration lags render, so the DOM is
// the one source that is always in sync with the indices in `elementsRef`.
const isDisabledElement = (element: HTMLElement | null) =>
  element == null || element.getAttribute("aria-disabled") === "true";

function findSelectedIndex(elements: ReadonlyArray<HTMLElement | null>, value: string[]) {
  if (value.length === 0) return null;

  const index = elements.findIndex((element) => {
    const optionValue = element?.getAttribute("data-value");
    return optionValue != null && value.includes(optionValue);
  });
  return index === -1 ? null : index;
}

function findFirstEnabledIndex(elements: ReadonlyArray<HTMLElement | null>) {
  const index = elements.findIndex((element) => !isDisabledElement(element));
  return index === -1 ? null : index;
}

function findLastEnabledIndex(elements: ReadonlyArray<HTMLElement | null>) {
  for (let index = elements.length - 1; index >= 0; index--) {
    if (!isDisabledElement(elements[index] ?? null)) return index;
  }
  return null;
}

// Wrapping scan for the next enabled index in `delta` direction. Skips disabled
// options; may land back on `from` itself after a full cycle (single enabled item).
function findEnabledIndex(
  elements: ReadonlyArray<HTMLElement | null>,
  from: number,
  delta: 1 | -1,
) {
  const { length } = elements;
  if (length === 0) return null;

  for (let step = 1; step <= length; step++) {
    const index = (((from + delta * step) % length) + length) % length;
    if (!isDisabledElement(elements[index] ?? null)) return index;
  }
  return null;
}

interface OptionEntry {
  /** Rich display node, rendered in the single-select trigger value slot. */
  label: React.ReactNode;
  /** Plain string identity, used for the multi-select join and the hidden `<option>` text. */
  textValue: string;
  icon?: React.ReactNode;
}

export interface SelectedItem extends OptionEntry {
  value: string;
  /**
   * False while no rendered option matches `value` — either the option has not
   * registered yet, or it unmounted while selected. Display paths must skip
   * unresolved entries; `label` is `null` and `textValue` is `""` on those.
   */
  resolved: boolean;
}

function getDefaultDisplayValue(items: SelectedItem[], multiple: boolean) {
  if (!multiple) return items[0]?.label;

  // Unresolved entries hold a slot but carry an empty textValue, which would
  // otherwise join into a stray separator.
  return items
    .filter((item) => item.resolved)
    .map((item) => item.textValue)
    .join(", ");
}

export interface UseSelectProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Selected option values. An empty array means nothing is selected;
   * single-select carries at most one entry.
   */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;

  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;

  /** Name of the hidden native `<select>` for form submission. */
  name?: string;
  /** Form association of the hidden native `<select>`. */
  form?: string;
  /** Marks the hidden native `<select>` as required. */
  required?: boolean;

  /**
   * Floating UI placement.
   * @default "bottom"
   */
  placement?: Placement;

  /**
   * Distance between the trigger and the listbox.
   * @default 8
   */
  gutter?: number;

  /**
   * Virtual padding around viewport edges for collision detection.
   * @default 8
   */
  overflowPadding?: number;

  /**
   * Positioning strategy.
   * @default "absolute"
   */
  strategy?: "absolute" | "fixed";

  /**
   * Whether multiple options can be selected.
   * @default false
   */
  multiple?: boolean;

  /** Custom trigger value rendering; overrides the default value display. */
  formatValue?: (items: SelectedItem[]) => React.ReactNode;
}

export interface UseSelectItemProps {
  value: string;
  disabled?: boolean;
  /** Overrides the string matched by keyboard typeahead. */
  typeaheadLabel?: string;
  /**
   * Rich display label. Rendered in the trigger value slot for single-select and
   * used as the typeahead label when it is a string and `typeaheadLabel` is omitted.
   */
  label?: React.ReactNode;
  /**
   * Plain-string identity used for the multi-select trigger join and the hidden
   * native `<option>` text. Defaults to `label` when it is a string, otherwise the
   * option `value`. Provide it when `label` is a `ReactNode` — it then also serves
   * as the typeahead match string unless `typeaheadLabel` overrides it.
   */
  textValue?: string;
  /**
   * The option's icon. The headless item does not render it — it is only
   * registered, and re-rendered in the trigger prefix slot while this is the only
   * selected item. Expects a single `svg` element; a ref attached to that element
   * connects to only one of the two render locations.
   */
  icon?: React.ReactNode;
}

export type UseSelectReturn = ReturnType<typeof useSelect>;

export type GetItemPropsReturn = ReturnType<UseSelectReturn["getItemProps"]>;

export function useSelect(props: UseSelectProps) {
  const {
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    name,
    form,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
    multiple = false,
    formatValue,
  } = props;

  const interactive = !disabled && !readOnly;

  const [open, setOpenState] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
    caller: "useSelect",
  });

  const [value, setValueState] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? EMPTY_VALUE,
    onChange: props.onValueChange,
    caller: "useSelect",
  });

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      // Opening requires interactivity; closing is always allowed.
      if (nextOpen && !interactive) return;

      setOpenState(nextOpen);
    },
    [interactive, setOpenState],
  );

  const setValue = useCallback(
    (nextValue: string[]) => {
      // Equality-suppress no-op updates so change callbacks fire only on actual change.
      setValueState((prevValue) => (isSameValue(prevValue, nextValue) ? prevValue : nextValue));
    },
    [setValueState],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // What each rendered option contributes beyond its value: the display node,
  // the plain string, the icon. Items register from a layout effect, so this
  // fills in before the first paint but after `value` already exists — which is
  // why nothing derived from it may decide whether a value exists.
  const [optionRegistry, setOptionRegistry] = useState<ReadonlyMap<string, OptionEntry>>(
    () => new Map(),
  );
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);

  const id = useId();
  const contentId = `select:${id}:content`;
  const getItemId = (index: number) => `select:${id}:item:${index}`;

  // Inset the viewport collision boundary so flip/size/shift keep the listbox clear
  // of the notch and home indicator, not just the viewport edge. The safe area is
  // already a visual buffer, so where it exists the listbox sits right at its
  // boundary; only where there is none does it fall back to overflowPadding.
  const collisionPadding = {
    top: safeArea.top || overflowPadding,
    right: overflowPadding,
    bottom: safeArea.bottom || overflowPadding,
    left: overflowPadding,
  };

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    strategy,
    placement,
    middleware: [
      offset(gutter),
      flip({ padding: collisionPadding, fallbackStrategy: "initialPlacement" }),
      shift({ padding: collisionPadding }),
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
    ],
  });

  // The reference may be a floating-ui virtual element; only a real element
  // can receive focus redirects.
  const getTriggerElement = useCallback(() => {
    const reference = floatingRefs.reference.current;
    return reference instanceof HTMLElement ? reference : null;
  }, [floatingRefs.reference]);

  const { status } = useTransitionStatus(context);

  // Keep autoUpdate alive during the exit animation so the positioner follows
  // the trigger even while the listbox is animating out.
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

  // Read the env()-resolved insets off the positioner, which carries the env()
  // declarations via SAFE_AREA_STYLE. Key on the reactive `elements.floating`, not
  // `refs.floating`: the ref object's identity never changes, so an effect depending
  // on it runs only once at mount — before FloatingPortal has committed the positioner
  // child — reads a null ref, bails, and never re-fires, leaving `safeArea` stuck at
  // {0,0}. `elements.floating` updates when the positioner mounts (it stays mounted
  // even while closed), so the insets are read before the first open. Re-read on
  // resize for orientation changes.
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

  // Items register in layout effects after render, so rendered elements (their
  // `data-value`) are the reliable source for the selected position at any time.
  const selectedIndex = findSelectedIndex(elementsRef.current, value);

  const selectValue = useCallback(
    (optionValue: string) => {
      if (!interactive) return;

      if (multiple) {
        // Toggle membership preserving insertion order; the listbox stays open.
        setValue(
          value.includes(optionValue)
            ? value.filter((entry) => entry !== optionValue)
            : [...value, optionValue],
        );
        return;
      }

      setValue([optionValue]);
      setOpen(false);
    },
    [interactive, multiple, value, setValue, setOpen],
  );

  const registerOption = useCallback((optionValue: string, entry: OptionEntry) => {
    setOptionRegistry((prev) => {
      const existing = prev.get(optionValue);
      // Re-registering an identical entry must not churn state (render loops).
      if (
        existing &&
        existing.label === entry.label &&
        existing.textValue === entry.textValue &&
        existing.icon === entry.icon
      ) {
        return prev;
      }

      return new Map(prev).set(optionValue, entry);
    });
  }, []);

  const unregisterOption = useCallback((optionValue: string) => {
    setOptionRegistry((prev) => {
      if (!prev.has(optionValue)) return prev;

      const next = new Map(prev);
      next.delete(optionValue);
      return next;
    });
  }, []);

  // Index-aligned with `value` by construction: a value whose option has not
  // registered — or has unmounted while selected — keeps its slot as an
  // unresolved entry instead of dropping out. Consumers therefore never have to
  // reconcile `value.length` against a shorter projection.
  const selectedItems = useMemo(
    () =>
      value.map((entry): SelectedItem => {
        const option = optionRegistry.get(entry);
        return option
          ? { ...option, value: entry, resolved: true }
          : { value: entry, label: null, textValue: "", resolved: false };
      }),
    [value, optionRegistry],
  );

  // An empty selection and one that no rendered option can resolve both read as
  // "nothing to show" in the trigger — an option can unmount while selected, and
  // the value deliberately survives that (it still submits). Gated on a non-empty
  // registry because the server render and the frame before registration see one
  // too, and flipping placeholder -> label there would be a hydration mismatch.
  const showPlaceholder =
    value.length === 0 ||
    (optionRegistry.size > 0 && selectedItems.every((item) => !item.resolved));

  // The single entry a lone selection points at — undefined while nothing is
  // selected, while several are, or while that one value resolves to no rendered
  // option. Consumers mirroring the selection read this instead of pairing
  // `value.length` with an index into `selectedItems`.
  const selectedItem =
    value.length === 1 && selectedItems[0]?.resolved ? selectedItems[0] : undefined;

  // The trigger's default content, skipped entirely while the placeholder shows
  // so `formatValue` never sees an empty or wholly unresolved selection.
  const displayValue = showPlaceholder
    ? undefined
    : formatValue
      ? formatValue(selectedItems)
      : getDefaultDisplayValue(selectedItems, multiple);

  // What the hidden native `<select>` has to render as `<option>` children for
  // the current value to survive form submission.
  const hiddenSelectOptions = useMemo(
    () => [
      // A leading empty option gives single-select a "nothing chosen" slot, so
      // `required` constraint validation can actually fail.
      ...(multiple ? [] : [{ value: "", textValue: "" }]),
      ...[...optionRegistry].map(([optionValue, entry]) => ({
        value: optionValue,
        textValue: entry.textValue,
      })),
      // A controlled <select> silently drops a value that matches no option, so
      // a value the registry cannot resolve — one whose option unmounted, or one
      // seen before any option registered — needs a bare option of its own for
      // the form to submit what the component reports.
      ...value
        .filter((entry) => !optionRegistry.has(entry))
        .map((entry) => ({ value: entry, textValue: "" })),
    ],
    [multiple, optionRegistry, value],
  );

  // Closing clears the highlight so it can never leak into the next open.
  useEffect(() => {
    if (!open) setActiveIndex(null);
  }, [open]);

  // Opening reveals the current position: the seeded highlight if a keyboard
  // open placed one, otherwise the selected option (pointer opens seed no
  // highlight). Deferred a frame because at open time the content is still
  // display:none — scrollIntoView inside a hidden subtree is a no-op, and
  // hiding also dropped the previous open's scroll position — so the seeding
  // path's synchronous scroll (highlightWithKeyboard) cannot cover the open
  // transition itself.
  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      const elements = elementsRef.current;
      const target =
        elements.find((element) => element?.hasAttribute("data-highlighted")) ??
        elements.find((element) => element?.hasAttribute("data-selected"));
      target?.scrollIntoView?.({ block: "nearest" });
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  const highlightWithKeyboard = (index: number | null) => {
    setActiveIndex(index);
    if (index == null) return;

    // Keyboard-highlighted options must stay visible; hover must not scroll.
    elementsRef.current[index]?.scrollIntoView?.({ block: "nearest" });
  };

  // Keyboard opens seed the highlight: the (first, in DOM order) selected option
  // if one exists, otherwise the first enabled option. Pointer opens seed nothing
  // (mobile-first: a pre-seeded highlight under a finger reads as a stuck pressed
  // state), so this also serves the first Arrow press after a pointer open.
  const getKeyboardSeedIndex = () => {
    const elements = elementsRef.current;
    return findSelectedIndex(elements, value) ?? findFirstEnabledIndex(elements);
  };

  const handleTypeaheadMatch = (index: number) => {
    if (open) {
      highlightWithKeyboard(index);
      return;
    }

    // Closed-trigger typeahead commits directly without opening (native
    // <select> parity). No highlight is written, so none can leak into the
    // next open.
    const optionValue = elementsRef.current[index]?.getAttribute("data-value");
    if (optionValue != null) setValue([optionValue]);
  };

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
    // Closed-trigger typeahead is single-select only (multiple is ambiguous)
    // and requires interactivity; while open it always tracks the highlight.
    enabled: open || (interactive && !multiple),
  });

  // Open-state key handling, shared by the content (which holds DOM focus
  // while open) and the trigger (an AT or programmatic focus may leave DOM
  // focus there — same keys must keep working).
  const handleOpenKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;

    switch (key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const elements = elementsRef.current;
        const nextIndex =
          activeIndex == null
            ? getKeyboardSeedIndex()
            : findEnabledIndex(elements, activeIndex, key === "ArrowDown" ? 1 : -1);
        if (nextIndex != null) highlightWithKeyboard(nextIndex);
        return;
      }
      case "Home":
      case "End": {
        event.preventDefault();
        const elements = elementsRef.current;
        const nextIndex =
          key === "Home" ? findFirstEnabledIndex(elements) : findLastEnabledIndex(elements);
        if (nextIndex != null) highlightWithKeyboard(nextIndex);
        return;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        if (activeIndex == null) {
          setOpen(false);
          return;
        }

        const element = elementsRef.current[activeIndex] ?? null;
        if (isDisabledElement(element)) return;

        const optionValue = element?.getAttribute("data-value");
        if (optionValue != null) selectValue(optionValue);
        return;
      }
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // An in-progress typeahead consumes Space as a search character by
    // preventing it (the typeahead handler runs first); user handlers merged
    // in front of this one get the same veto.
    if (event.defaultPrevented) return;
    if (!interactive) return;

    if (!open) {
      const { key } = event;
      if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Enter" && key !== " ") return;

      // preventDefault suppresses the native button activation click, so
      // keyboard opens never double-toggle through the click handler.
      event.preventDefault();
      setOpen(true);
      highlightWithKeyboard(getKeyboardSeedIndex());
      return;
    }

    handleOpenKeyDown(event);
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Same typeahead Space veto as the trigger handler.
    if (event.defaultPrevented) return;
    if (!open) return;

    handleOpenKeyDown(event);
  };

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.defaultPrevented) return;

    if (open) {
      setOpen(false);
      return;
    }
    if (!interactive) return;

    setOpen(true);
    // detail 0 means a keyboard/assistive-tech activation surfaced as a click
    // (e.g. a screen reader virtual click) — treat it as a keyboard open.
    if (event.detail === 0) highlightWithKeyboard(getKeyboardSeedIndex());
  };

  const handleHiddenSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(
      multiple
        ? Array.from(event.target.selectedOptions, (option) => option.value)
        : event.target.value === ""
          ? []
          : [event.target.value],
    );
  };

  const handleHiddenSelectInvalid = (event: React.FormEvent<HTMLSelectElement>) => {
    // Native constraint validation must never surface on the hidden select:
    // the UA would focus into the aria-hidden subtree (Chrome blocks the
    // aria-hidden and permanently exposes a nameless duplicate combobox in the
    // accessibility tree) and anchor its bubble to the 1px clip. preventDefault
    // cancels only the reporting step — submission stays blocked by `required`.
    event.preventDefault();

    // Focus lands on the trigger only when this is the form's first invalid
    // control, matching where the UA would have put it (native ordering).
    const select = event.currentTarget;
    const firstInvalid =
      Array.from(select.form?.elements ?? []).find(
        (element) =>
          (element instanceof HTMLInputElement ||
            element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement) &&
          element.willValidate &&
          !element.validity.valid,
      ) ?? select;
    if (firstInvalid === select) getTriggerElement()?.focus();
  };

  const stateProps = elementProps({
    "data-open": dataAttr(open),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-readonly": dataAttr(readOnly),
  });

  const contentStateProps = elementProps({
    "data-open": dataAttr(status === "open" || status === "initial"),
    "data-hidden": dataAttr(status === "unmounted"),
  });

  return {
    open,
    setOpen,
    value,
    setValue,
    multiple,
    selectedItems,
    selectedItem,
    showPlaceholder,
    displayValue,
    formatValue,
    activeIndex,
    selectedIndex,

    disabled,
    invalid,
    readOnly,
    required,
    name,
    form,

    optionRegistry,
    registerOption,
    unregisterOption,
    hiddenSelectOptions,
    selectValue,

    stateProps,
    contentStateProps,

    floatingContext: context,
    elementsRef,
    labelsRef,

    refs: {
      trigger: (node: HTMLElement | null) => floatingRefs.setReference(node),
      positioner: (node: HTMLElement | null) => floatingRefs.setFloating(node),
      getTriggerElement,
    },

    triggerProps: buttonProps({
      type: "button",
      role: "combobox",
      disabled,
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      "aria-controls": contentId,
      "aria-autocomplete": "none",
      // Explicit "false" keeps validation state on the combobox in sync with
      // the hidden select even when off.
      "aria-required": required ? "true" : "false",
      "aria-invalid": invalid ? "true" : "false",
      // readOnly keeps the combobox focusable but refuses to open; expose why.
      ...(readOnly && { "aria-readonly": "true" as const }),
      ...stateProps,
      onKeyDown: (event) => {
        typeahead.reference?.onKeyDown?.(event);
        handleTriggerKeyDown(event);
      },
      onClick: handleTriggerClick,
    }),

    positionerProps: elementProps({
      ...contentStateProps,
      style: { ...SAFE_AREA_STYLE, ...floatingStyles },
    }),

    contentProps: elementProps({
      ...contentStateProps,
      id: contentId,
      role: "listbox",
      // DOM focus moves here while open (FloatingFocusManager picks it up as
      // the first tabbable inside the positioner); the highlighted option is
      // exposed through aria-activedescendant. While closed the content is
      // display:none, so the tabIndex never leaks into the page tab order.
      tabIndex: 0,
      "aria-activedescendant": open && activeIndex != null ? getItemId(activeIndex) : undefined,
      ...(multiple && { "aria-multiselectable": "true" }),
      style: {
        "--seed-select-transform-origin": getTransformOrigin(context.placement),
      } as React.CSSProperties,
      onKeyDown: (event) => {
        typeahead.floating?.onKeyDown?.(event);
        handleContentKeyDown(event);
      },
    }),

    hiddenSelectProps: selectProps({
      "aria-hidden": true,
      tabIndex: -1,
      name,
      form,
      required,
      disabled,
      multiple,
      value: multiple ? value : (value[0] ?? ""),
      style: visuallyHidden,
      onChange: handleHiddenSelectChange,
      onFocus: () => {
        // Label clicks (Field label's htmlFor targets this element), browser
        // extensions, and autofill can land focus here; forward it to the
        // visible trigger.
        getTriggerElement()?.focus({ preventScroll: true });
      },
      onInvalid: handleHiddenSelectInvalid,
    }),

    getItemProps: (itemProps: UseSelectItemProps, index: number) => {
      const isSelected = value.includes(itemProps.value);
      const isHighlighted = activeIndex != null && activeIndex === index;

      const itemStateProps = elementProps({
        "data-highlighted": dataAttr(isHighlighted),
        "data-selected": dataAttr(isSelected),
        "data-disabled": dataAttr(itemProps.disabled),
      });

      return {
        isSelected,
        isDisabled: itemProps.disabled,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          // index is -1 until FloatingList registration lands; the id follows
          // on the registered render so aria-activedescendant always equals a
          // real option element id.
          ...(index !== -1 && { id: getItemId(index) }),
          role: "option",
          "aria-selected": isSelected ? "true" : "false",
          "aria-disabled": itemProps.disabled ? "true" : undefined,
          "data-value": itemProps.value,
          onClick(event) {
            if (event.defaultPrevented) return;
            if (itemProps.disabled) return;

            selectValue(itemProps.value);
          },
          onPointerMove(event) {
            // Pointer hover and keyboard navigation share the single highlight;
            // hover never highlights disabled options. Only a real mouse move
            // highlights: a touch tap fires a compatibility mousemove after
            // touchend, and touch scrolling fires pointermove under the finger —
            // both would otherwise leave a highlight stuck as a pressed state.
            if (event.pointerType !== "mouse") return;
            if (itemProps.disabled) return;
            if (index === -1 || activeIndex === index) return;

            setActiveIndex(index);
          },
          onMouseDown(event) {
            // Virtual focus: keep DOM focus on the trigger while pressing options.
            event.preventDefault();
          },
        }),
      };
    },
  };
}

export type UseSelectItemReturn = ReturnType<typeof useSelectItem>;

// Registers one rendered option with the root: its position in the list (for
// typeahead and aria-activedescendant) and its display payload (for the trigger
// value slot and the hidden native `<option>`).
export function useSelectItem(props: UseSelectItemProps) {
  const { value, disabled, typeaheadLabel, label, textValue, icon } = props;
  const { getItemProps, registerOption, unregisterOption } = useSelectContext();

  const resolvedTextValue = textValue ?? (typeof label === "string" ? label : value);

  // `null` excludes disabled options from typeahead (APG: they are not typeable).
  // A ReactNode label falls back to `textValue` rather than letting floating-ui
  // read the DOM textContent, which would concatenate every rendered part
  // (label + description) into the match string.
  const { ref: listRef, index } = useListItem({
    label: disabled
      ? null
      : (typeaheadLabel ?? (typeof label === "string" ? label : resolvedTextValue)),
  });

  // SSR-safe (no-op on the server): registration runs in a layout effect so the
  // trigger value paints in the same frame items mount, instead of one frame late.
  useLayoutEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      textValue === undefined &&
      label != null &&
      typeof label !== "string"
    ) {
      console.warn(
        `SelectItem "${value}": \`label\` is a ReactNode, so \`textValue\` falls back to the option value for the trigger text and hidden <option>. Pass \`textValue\` to set the display string.`,
      );
    }
    registerOption(value, { label, textValue: resolvedTextValue, icon });
    return () => unregisterOption(value);
  }, [value, label, resolvedTextValue, icon, registerOption, unregisterOption]);

  return {
    ...getItemProps({ value, disabled, typeaheadLabel }, index),

    // label/icon are the item's own props, handed straight back so styled
    // `ItemLabel`/`ItemPrefixIcon` can consume them without the caller
    // re-threading them through the registry.
    label,
    icon,

    refs: {
      item: listRef,
    },
  };
}

export type UseSelectGroupReturn = ReturnType<typeof useSelectGroup>;

// A group advertises aria-labelledby only while its label is actually rendered.
// A callback ref flips a boolean synchronously at commit, so the attribute is
// present on first paint and never points at a missing id. Each group owns its
// own id and presence flag, so conditionally rendering or reordering groups can
// never make one group inherit another's label reference.
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

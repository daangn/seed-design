"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  buttonProps,
  dataAttr,
  elementProps,
  selectProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useCallback, useId } from "react";
import type * as React from "react";
import { useSelectFloating, type UseSelectPositioningProps } from "./useSelectFloating";
import { useSelectHighlight } from "./useSelectHighlight";
import type { UseSelectItemProps } from "./useSelectItem";
import { useSelectOptions, type UseSelectOptionsProps } from "./useSelectOptions";

// Uncontrolled empty selection keeps one stable reference so consumers can
// memo/compare by identity across renders.
const EMPTY_VALUE: string[] = [];

const isSameValue = (a: string[], b: string[]) =>
  a.length === b.length && a.every((entry, index) => entry === b[index]);

export interface UseSelectProps
  extends UseSelectPositioningProps,
    Pick<UseSelectOptionsProps, "formatValue"> {
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
   * Whether multiple options can be selected.
   * @default false
   */
  multiple?: boolean;
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

  const id = useId();
  const contentId = `select:${id}:content`;
  const getItemId = (index: number) => `select:${id}:item:${index}`;

  const {
    context: floatingContext,
    status,
    transformOrigin,
    positionerStyle,
    refs,
  } = useSelectFloating({ ...props, open, setOpen });

  const {
    optionRegistry,
    registerOption,
    unregisterOption,
    selectedItems,
    selectedItem,
    showPlaceholder,
    displayValue,
    hiddenSelectOptions,
  } = useSelectOptions({ value, multiple, formatValue });

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

  const {
    activeIndex,
    setActiveIndex,
    selectedIndex,
    elementsRef,
    labelsRef,
    seedHighlight,
    onTriggerKeyDown,
    onContentKeyDown,
  } = useSelectHighlight({
    open,
    interactive,
    multiple,
    value,
    floatingContext,
    setOpen,
    setValue,
    selectValue,
  });

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
    if (event.detail === 0) seedHighlight();
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
    if (firstInvalid === select) refs.getTriggerElement()?.focus();
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

    floatingContext,
    elementsRef,
    labelsRef,

    refs,

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
      onKeyDown: onTriggerKeyDown,
      onClick: handleTriggerClick,
    }),

    positionerProps: elementProps({
      ...contentStateProps,
      style: positionerStyle,
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
        "--seed-select-transform-origin": transformOrigin,
      } as React.CSSProperties,
      onKeyDown: onContentKeyDown,
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
        refs.getTriggerElement()?.focus({ preventScroll: true });
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

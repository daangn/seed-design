import { useCallback, useMemo, useState } from "react";
import type * as React from "react";

export interface OptionEntry {
  /**
   * Rich display node. Rendered in the option row only — never by the trigger's
   * default display, which would drop the node's own layout into a slot sized for
   * a single line of text. `formatValue` still receives it for callers that want
   * it there anyway.
   */
  label: React.ReactNode;
  /** Plain string identity, used for the trigger display and the hidden `<option>` text. */
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

// The trigger's default content is always plain text, single or multi selection
// alike: an option's `label` may be an arbitrary node whose own layout would not
// survive the trigger's single-line value slot, so only `textValue` goes there.
// Callers wanting the node in the trigger opt in through `formatValue`.
function getDefaultDisplayValue(items: SelectedItem[]) {
  // Unresolved entries hold a slot but carry an empty textValue, which would
  // otherwise join into a stray separator.
  return items
    .filter((item) => item.resolved)
    .map((item) => item.textValue)
    .join(", ");
}

export interface UseSelectOptionsProps {
  value: string[];
  multiple: boolean;
  /**
   * Custom trigger value rendering; overrides the default `textValue` join. Also
   * the way to put an option's `label` node in the trigger, which the default
   * deliberately never does.
   */
  formatValue?: (items: SelectedItem[]) => React.ReactNode;
}

// Owns what each rendered option contributes beyond its value — the display node,
// the plain string, the icon — and everything the current value projects into from
// it: the trigger content and the hidden native `<option>` children.
export function useSelectOptions({ value, multiple, formatValue }: UseSelectOptionsProps) {
  // Items register from a layout effect, so this fills in before the first paint
  // but after `value` already exists — which is why nothing derived from it may
  // decide whether a value exists.
  const [optionRegistry, setOptionRegistry] = useState<ReadonlyMap<string, OptionEntry>>(
    () => new Map(),
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
      : getDefaultDisplayValue(selectedItems);

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

  return {
    optionRegistry,
    registerOption,
    unregisterOption,

    selectedItems,
    selectedItem,
    showPlaceholder,
    displayValue,
    hiddenSelectOptions,
  };
}

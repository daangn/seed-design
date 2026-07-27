import { useListItem } from "@floating-ui/react";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import type * as React from "react";
import { useSelectContext } from "./useSelectContext";

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
  }, [value, label, textValue, resolvedTextValue, icon, registerOption, unregisterOption]);

  return {
    ...getItemProps(props, index),

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

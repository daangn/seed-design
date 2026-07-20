"use client";

import { FloatingList, FloatingPortal, useListItem } from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps, visuallyHidden } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
// SSR-safe (no-op on the server): item registration runs in a layout effect so the
// trigger value paints in the same frame items mount, instead of one frame late.
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import React, { createContext, forwardRef, useContext } from "react";
import {
  useSelect,
  useSelectGroup,
  type UseSelectGroupReturn,
  type UseSelectItemProps,
  type UseSelectProps,
} from "./useSelect";
import { SelectProvider, useSelectContext } from "./useSelectContext";
import { SelectItemProvider } from "./useSelectItemContext";

const SelectGroupContext = createContext<UseSelectGroupReturn | null>(null);

export interface SelectRootProps extends UseSelectProps {
  children?: React.ReactNode;
}

export const SelectRoot = ({
  open,
  defaultOpen,
  onOpenChange,
  value,
  defaultValue,
  onValueChange,
  disabled,
  invalid,
  readOnly,
  name,
  form,
  required,
  placement,
  gutter,
  overflowPadding,
  strategy,
  multiple,
  formatValue,
  children,
}: SelectRootProps) => {
  const api = useSelect({
    open,
    defaultOpen,
    onOpenChange,
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    readOnly,
    name,
    form,
    required,
    placement,
    gutter,
    overflowPadding,
    strategy,
    multiple,
    formatValue,
  });

  return <SelectProvider value={api}>{children}</SelectProvider>;
};

export interface SelectTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>((props, ref) => {
  const api = useSelectContext();

  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders the selected value. Nothing is rendered while the selection is empty
 * (see `SelectPlaceholder`). Precedence: `children` > root `formatValue` > default
 * (single-select `label` node / multi-select `textValue` join).
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ children, ...props }, ref) => {
    const { value, selectedItems, multiple, formatValue } = useSelectContext();

    if (value.length === 0) return null;

    const content =
      children ??
      (formatValue
        ? formatValue(selectedItems)
        : multiple
          ? selectedItems.map((item) => item.textValue).join(", ")
          : selectedItems[0]?.label);

    return (
      <Primitive.span ref={ref} {...props}>
        {content}
      </Primitive.span>
    );
  },
);
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders placeholder content while no value is selected.
 */
export const SelectPlaceholder = forwardRef<HTMLSpanElement, SelectPlaceholderProps>(
  (props, ref) => {
    const { value } = useSelectContext();

    if (value.length > 0) return null;

    return <Primitive.span ref={ref} {...props} />;
  },
);
SelectPlaceholder.displayName = "SelectPlaceholder";

export interface SelectPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * The container element to render the portal into.
   * @default document.body
   */
  container?: React.RefObject<HTMLElement | null>;
}

export const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>(
  ({ container, ...props }, ref) => {
    const api = useSelectContext();

    return (
      <FloatingPortal root={container ?? undefined}>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, props)}
        />
      </FloatingPortal>
    );
  },
);
SelectPositioner.displayName = "SelectPositioner";

export interface SelectContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>((props, ref) => {
  const { floatingContext, contentProps, open, setOpen, elementsRef, labelsRef } =
    useSelectContext();

  const content = <Primitive.div ref={ref} {...mergeProps(contentProps, props)} />;

  // The select-only combobox keeps DOM focus on the trigger (virtual focus via
  // aria-activedescendant), so there is no FloatingFocusManager/FocusScope here —
  // only list registration (FloatingList) and dismissal (DismissibleLayer).
  return (
    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
      <DismissibleLayer
        enabled={open}
        pressBehavior="drag"
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
        onPressOutside={() => {
          setOpen(false);
        }}
        onFocusOutside={() => {
          // Tab away from the combobox closes the listbox.
          setOpen(false);
        }}
        onCascadeDismiss={() => {
          setOpen(false);
        }}
        exclude={(target) => {
          const reference = floatingContext.refs.reference.current;
          if (!(reference instanceof HTMLElement)) return false;

          return reference.contains(target);
        }}
      >
        {content}
      </DismissibleLayer>
    </FloatingList>
  );
});
SelectContent.displayName = "SelectContent";

export interface SelectScrollAreaProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectScrollArea = forwardRef<HTMLDivElement, SelectScrollAreaProps>((props, ref) => {
  return <Primitive.div ref={ref} {...props} />;
});
SelectScrollArea.displayName = "SelectScrollArea";

export interface SelectItemProps
  extends UseSelectItemProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
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
   * The option's prefix icon. The headless item does not render it — it is only
   * registered, and re-rendered in the trigger prefix slot while this is the only
   * selected item. Expects a single `svg` element; a ref attached to that element
   * connects to only one of the two render locations.
   */
  prefixIcon?: React.ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, typeaheadLabel, label, textValue, prefixIcon, ...restProps }, ref) => {
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
    const api = getItemProps({ value, disabled, typeaheadLabel }, index);

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
      registerOption(value, { label, textValue: resolvedTextValue, prefixIcon });
      return () => unregisterOption(value);
    }, [value, label, resolvedTextValue, prefixIcon, registerOption, unregisterOption]);

    return (
      <SelectItemProvider value={api}>
        <Primitive.div ref={composeRefs(listRef, ref)} {...mergeProps(api.rootProps, restProps)} />
      </SelectItemProvider>
    );
  },
);
SelectItem.displayName = "SelectItem";

export interface SelectGroupProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>((props, ref) => {
  const group = useSelectGroup();

  return (
    <SelectGroupContext.Provider value={group}>
      <Primitive.div ref={ref} {...mergeProps(group.rootProps, props)} />
    </SelectGroupContext.Provider>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>((props, ref) => {
  const group = useContext(SelectGroupContext);
  if (!group) throw new Error("SelectGroupLabel must be used within a SelectGroup");

  // Compose the group's label ref so the group advertises aria-labelledby only
  // while this label is actually rendered (see useSelectGroup).
  return (
    <Primitive.div
      ref={composeRefs(group.refs.label, ref)}
      {...mergeProps(group.labelProps, props)}
    />
  );
});
SelectGroupLabel.displayName = "SelectGroupLabel";

export interface SelectHiddenSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Visually hidden native `<select>` that mirrors the current value so the Select
 * participates in native form submission (name/required/form) and autofill.
 */
export const SelectHiddenSelect = forwardRef<HTMLSelectElement, SelectHiddenSelectProps>(
  (props, ref) => {
    const { value, setValue, name, form, required, disabled, multiple, nativeOptions } =
      useSelectContext();

    return (
      <select
        ref={ref}
        aria-hidden
        tabIndex={-1}
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        multiple={multiple}
        value={multiple ? value : (value[0] ?? "")}
        onChange={(event) => {
          setValue(
            multiple
              ? Array.from(event.target.selectedOptions, (option) => option.value)
              : event.target.value === ""
                ? []
                : [event.target.value],
          );
        }}
        style={visuallyHidden}
        {...props}
      >
        {!multiple && <option value="" />}
        {[...nativeOptions].map(([optionValue, entry]) => (
          <option key={optionValue} value={optionValue}>
            {entry.textValue}
          </option>
        ))}
      </select>
    );
  },
);
SelectHiddenSelect.displayName = "SelectHiddenSelect";

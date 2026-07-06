"use client";

import { FloatingList, FloatingPortal, useListItem } from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps, visuallyHidden } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import React, { createContext, forwardRef, useContext, useEffect } from "react";
import { useSelect, type UseSelectItemProps, type UseSelectProps } from "./useSelect";
import { SelectProvider, useSelectContext } from "./useSelectContext";
import { SelectItemProvider } from "./useSelectItemContext";

const SelectGroupLabelIdContext = createContext<string | null>(null);

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
  matchReferenceWidth,
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
    matchReferenceWidth,
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
 * Renders the selected option's label. Falls back to nothing when no value is
 * selected (see `SelectPlaceholder`). Pass `children` to override the displayed
 * content.
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ children, ...props }, ref) => {
    const { value, selectedLabel } = useSelectContext();

    if (value === null) return null;

    return (
      <Primitive.span ref={ref} {...props}>
        {children ?? selectedLabel}
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

    if (value !== null) return null;

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
   * Display label registered for the trigger's value text and the hidden native
   * `<select>` option. Also used as the typeahead label when `typeaheadLabel` is
   * omitted.
   */
  label?: React.ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, typeaheadLabel, label, ...restProps }, ref) => {
    const { getItemProps, registerOption, unregisterOption } = useSelectContext();
    const { ref: listRef, index } = useListItem({
      label: typeaheadLabel ?? (typeof label === "string" ? label : undefined),
    });
    const api = getItemProps({ value, disabled, typeaheadLabel }, index);

    useEffect(() => {
      registerOption(value, label ?? value);
      return () => unregisterOption(value);
    }, [value, label, registerOption, unregisterOption]);

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
  const { getGroupProps } = useSelectContext();
  const { labelId, rootProps } = getGroupProps();

  return (
    <SelectGroupLabelIdContext.Provider value={labelId}>
      <Primitive.div ref={ref} {...mergeProps(rootProps, props)} />
    </SelectGroupLabelIdContext.Provider>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>((props, ref) => {
  const { getGroupLabelProps, registerGroupLabel, unregisterGroupLabel } = useSelectContext();
  const labelId = useContext(SelectGroupLabelIdContext);
  if (!labelId) throw new Error("SelectGroupLabel must be used within a SelectGroup");

  // Report this label so the enclosing group references it via aria-labelledby
  // only when it is actually rendered (see useSelect.getGroupProps).
  useEffect(() => {
    registerGroupLabel(labelId);
    return () => unregisterGroupLabel(labelId);
  }, [labelId, registerGroupLabel, unregisterGroupLabel]);

  return <Primitive.div ref={ref} {...mergeProps(getGroupLabelProps(labelId), props)} />;
});
SelectGroupLabel.displayName = "SelectGroupLabel";

export interface SelectHiddenSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Visually hidden native `<select>` that mirrors the current value so the Select
 * participates in native form submission (name/required/form) and autofill.
 */
export const SelectHiddenSelect = forwardRef<HTMLSelectElement, SelectHiddenSelectProps>(
  (props, ref) => {
    const { value, setValue, name, form, required, disabled, nativeOptions } = useSelectContext();

    return (
      <select
        ref={ref}
        aria-hidden
        tabIndex={-1}
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        value={value ?? ""}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        style={visuallyHidden}
        {...props}
      >
        <option value="" />
        {[...nativeOptions].map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {typeof label === "string" ? label : optionValue}
          </option>
        ))}
      </select>
    );
  },
);
SelectHiddenSelect.displayName = "SelectHiddenSelect";

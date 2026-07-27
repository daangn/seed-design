"use client";

import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  useListItem,
} from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps, visuallyHidden } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
// SSR-safe (no-op on the server): item registration runs in a layout effect so the
// trigger value paints in the same frame items mount, instead of one frame late.
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import type React from "react";
import { createContext, forwardRef, useContext } from "react";
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
 * Renders the selected value. Nothing is rendered while there is nothing to show
 * (see `SelectPlaceholder`). Precedence: `children` > root `formatValue` > default
 * (single-select `label` node / multi-select `textValue` join).
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ children, ...props }, ref) => {
    const { displayValue, showPlaceholder } = useSelectContext();

    if (showPlaceholder) return null;

    return (
      <Primitive.span ref={ref} {...props}>
        {children ?? displayValue}
      </Primitive.span>
    );
  },
);
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders placeholder content while nothing is selected — and also while the
 * selection resolves to no rendered option, which reads the same to the user
 * even though the value itself survives for form submission.
 */
export const SelectPlaceholder = forwardRef<HTMLSpanElement, SelectPlaceholderProps>(
  (props, ref) => {
    const { showPlaceholder } = useSelectContext();

    if (!showPlaceholder) return null;

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

  // DOM focus moves into the content while open (the content carries
  // aria-activedescendant for the highlighted option). Mirrors MenuContent:
  //
  // FloatingFocusManager (disabled while closed — the content stays mounted for
  // exit animations): focuses the content on open, returns focus to the trigger
  // on close, closes on focus-out, and renders portal tab-order guards.
  //
  // FocusScope participates in Radix's focusScopesStack so parent FocusScopes
  // (Dialog, BottomSheet, Drawer) pause their trap while this listbox is open —
  // without it, focus could never reach content rendered in a portal. It is
  // conditionally rendered (only when open) so it registers at the top of the
  // stack above any Dialog that mounted earlier.
  return (
    <FloatingFocusManager context={floatingContext} disabled={!open} modal={false}>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {/* DismissibleLayer must wrap FocusScope, not the other way around.
            FocusScope asChild uses Slot to forward tabIndex/onKeyDown/ref to the
            DOM element; if DismissibleLayer sat between them, those props would be
            swallowed by DismissibleLayer's own destructuring and never reach the DOM. */}
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
            // Tab-away closing is handled by FloatingFocusManager (closeOnFocusOut).
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
          {open ? (
            <FocusScope
              asChild
              trapped={false}
              loop={false}
              onMountAutoFocus={(event) => event.preventDefault()}
              onUnmountAutoFocus={(event) => event.preventDefault()}
            >
              {content}
            </FocusScope>
          ) : (
            content
          )}
        </DismissibleLayer>
      </FloatingList>
    </FloatingFocusManager>
  );
});
SelectContent.displayName = "SelectContent";

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
   * The option's icon. The headless item does not render it — it is only
   * registered, and re-rendered in the trigger prefix slot while this is the only
   * selected item. Expects a single `svg` element; a ref attached to that element
   * connects to only one of the two render locations.
   */
  icon?: React.ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, typeaheadLabel, label, textValue, icon, ...restProps }, ref) => {
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
      registerOption(value, { label, textValue: resolvedTextValue, icon });
      return () => unregisterOption(value);
    }, [value, label, resolvedTextValue, icon, registerOption, unregisterOption]);

    return (
      // label/icon are the item's own props, forwarded straight down so styled
      // `ItemLabel`/`ItemPrefixIcon` can consume them without the caller re-threading.
      <SelectItemProvider value={{ ...api, label, icon }}>
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

// Unlike sibling hidden inputs (Checkbox/Switch/etc.), this deliberately skips
// `PrimitiveProps` and renders a raw `<select>` instead of `Primitive.select`.
// `asChild` (Radix `Slot`) requires a single child, but the hidden select renders
// multiple `<option>` children alongside native form handlers, so slotting it would
// break — advertising `asChild` here would be a lie. Keep it a plain native element.
export interface SelectHiddenSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Visually hidden native `<select>` that mirrors the current value so the Select
 * participates in native form submission (name/required/form) and autofill.
 */
export const SelectHiddenSelect = forwardRef<HTMLSelectElement, SelectHiddenSelectProps>(
  (props, ref) => {
    const { value, setValue, name, form, required, disabled, multiple, optionRegistry, refs } =
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
        onFocus={() => {
          // Label clicks (Field label's htmlFor targets this element), browser
          // extensions, and autofill can land focus here; forward it to the
          // visible trigger.
          refs.getTriggerElement()?.focus({ preventScroll: true });
        }}
        onInvalid={(event) => {
          // Native constraint validation must never surface on this element:
          // the UA would focus into the aria-hidden subtree (Chrome blocks the
          // aria-hidden and permanently exposes a nameless duplicate combobox
          // in the accessibility tree) and anchor its bubble to the 1px clip.
          // preventDefault cancels only the reporting step — submission stays
          // blocked by `required` — and focus lands on the trigger instead when
          // this is the form's first invalid control (native ordering).
          event.preventDefault();

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
        }}
        style={visuallyHidden}
        {...props}
      >
        {!multiple && <option value="" />}
        {[...optionRegistry].map(([optionValue, entry]) => (
          <option key={optionValue} value={optionValue}>
            {entry.textValue}
          </option>
        ))}
        {/* A controlled <select> silently drops a value that matches no option,
            so a value the registry cannot resolve — one whose option unmounted,
            or one seen before any option registered — needs a bare option of its
            own for the form to submit what the component reports. */}
        {value
          .filter((entry) => !optionRegistry.has(entry))
          .map((entry) => (
            <option key={entry} value={entry} />
          ))}
      </select>
    );
  },
);
SelectHiddenSelect.displayName = "SelectHiddenSelect";

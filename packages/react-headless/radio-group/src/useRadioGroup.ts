import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useState } from "react";

import {
  ariaAttr,
  dataAttr,
  elementProps,
  inputProps,
  visuallyHidden,
} from "@ride-developer/dom-utils";
import { useFieldset } from "@ride-developer/react-fieldset";
import { useSupports } from "@ride-developer/react-supports";

interface UseRadioGroupStateProps {
  value?: string;

  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

function useRadioGroupState(props: UseRadioGroupStateProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  return {
    value,
    setValue,
    hoveredValue,
    setHoveredValue,
    activeValue,
    setActiveValue,
    focusedValue,
    setFocusedValue,
    isFocusVisible,
    setIsFocusVisible,
  };
}

export interface UseRadioGroupProps extends UseRadioGroupStateProps {
  /**
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  invalid?: boolean;

  // not implementing `required` behavior yet; currently we require users to have value or defaultValue
  // as well as `readOnly`

  name?: string;

  form?: string;
}

export interface RadioItemProps {
  value: string;

  disabled?: boolean;

  // note: individual radio item shouldn't be invalid independently
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>;

export type GetItemPropsReturn = ReturnType<UseRadioGroupReturn["getItemProps"]>;

export function useRadioGroup(props: UseRadioGroupProps) {
  const { disabled = false, invalid = false, form, name } = props;

  const fieldset = useFieldset();

  const stateProps = elementProps({
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
  });

  const {
    value,
    setValue,
    hoveredValue,
    setHoveredValue,
    activeValue,
    setActiveValue,
    focusedValue,
    setFocusedValue,
    isFocusVisible,
    setIsFocusVisible,
  } = useRadioGroupState(props);

  const isControlled = props.value !== undefined;
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  return {
    value,
    setValue,

    refs: fieldset.refs,

    invalid,

    stateProps,

    rootProps: elementProps({
      ...fieldset.rootProps,
      ...stateProps,

      // fieldset.rootProps gives role="group"
      // see: https://w3c.github.io/aria/#radiogroup
      role: "radiogroup",

      "aria-invalid": ariaAttr(invalid),
      "aria-disabled": ariaAttr(disabled),
    }),

    labelProps: elementProps({
      ...fieldset.labelProps,
      ...stateProps,
    }),

    descriptionProps: elementProps({
      ...fieldset.descriptionProps,
      ...stateProps,
    }),

    errorMessageProps: elementProps({
      ...fieldset.errorMessageProps,
      ...stateProps,
    }),

    getItemProps(itemProps: RadioItemProps) {
      const { value: itemValue, disabled: itemDisabled } = itemProps;

      const itemState = {
        disabled: !!itemDisabled || disabled,
        checked: value === itemValue,
        focused: focusedValue === itemValue,
        hovered: hoveredValue === itemValue,
        active: activeValue === itemValue,
      };

      const itemStateProps = elementProps({
        "data-focus": dataAttr(itemState.focused),
        "data-focus-visible": dataAttr(itemState.focused && isFocusVisible),
        "data-disabled": dataAttr(itemState.disabled),
        "data-checked": dataAttr(itemState.checked),
        "data-active": dataAttr(itemState.active),
        "data-hover": dataAttr(itemState.hovered),
      });

      return {
        ...itemState,

        setFocusedValue,
        setIsFocusVisible,

        stateProps: itemStateProps,

        rootProps: elementProps({
          ...itemStateProps,
          onPointerMove() {
            if (itemState.disabled) return;
            setHoveredValue(itemProps.value);
          },
          onPointerLeave() {
            if (itemState.disabled) return;
            setHoveredValue(null);
            setActiveValue(null);
          },
          onPointerDown(event) {
            if (itemState.disabled) return;
            // On pointerdown, the input blurs and returns focus to the `body`,
            // we need to prevent this.
            if (itemState.focused && event.pointerType === "mouse") {
              event.preventDefault();
            }
            setActiveValue(itemProps.value);
          },
          onPointerUp() {
            if (itemState.disabled) return;
            setActiveValue(null);
          },
        }),

        controlProps: elementProps({
          "aria-hidden": true,
          ...itemStateProps,
        }),

        hiddenInputProps: inputProps({
          type: "radio",
          name: name || fieldset.id,
          form: form,
          value: itemProps.value,
          onChange(event) {
            if (itemState.disabled) return;

            if (event.target.checked) {
              setValue(itemProps.value);
            }
            if (isFocusVisibleSupported) {
              setIsFocusVisible(event.target.matches(":focus-visible"));
            }
          },
          onBlur() {
            setFocusedValue(null);
            if (isFocusVisibleSupported) {
              setIsFocusVisible(false);
            }
          },
          onFocus(event) {
            setFocusedValue(itemProps.value);
            if (isFocusVisibleSupported) {
              setIsFocusVisible(event.target.matches(":focus-visible"));
            }
          },
          onKeyDown(event) {
            if (event.key === " ") {
              setActiveValue(itemProps.value);
            }
          },
          onKeyUp(event) {
            if (event.key === " ") {
              setActiveValue(null);
            }
          },
          disabled: itemState.disabled,
          defaultChecked: isControlled ? undefined : itemState.checked,
          checked: isControlled ? itemState.checked : undefined,
          style: visuallyHidden,
        }),
      };
    },
  };
}

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useId, useState } from "react";

import { dataAttr, elementProps, inputProps, visuallyHidden } from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";

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
  disabled?: boolean;

  name?: string;

  form?: string;
}

export interface RadioItemProps {
  value: string;

  disabled?: boolean;

  invalid?: boolean;
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>;

export type GetItemPropsReturn = ReturnType<UseRadioGroupReturn["getItemProps"]>;

const getLabelId = (id: string) => `radio-group:${id}:label`;

export function useRadioGroup(props: UseRadioGroupProps) {
  const id = useId();
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

  const { disabled, form, name } = props;

  const isControlled = value != null;
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const stateProps = elementProps({
    "data-disabled": dataAttr(disabled),
  });

  return {
    value,
    setValue,

    stateProps,

    rootProps: elementProps({
      role: "radiogroup",
      "aria-labelledby": getLabelId(id),
      ...stateProps,
    }),

    labelProps: elementProps({
      ...stateProps,
      id: getLabelId(id),
      // TODO: label 클릭 시 체크가 되어있는 radio에 포커스를 잡아야 한다. 체크된 게 없다면, 첫 번째 radio에 포커스를 잡아야 한다.
    }),

    getItemProps(itemProps: RadioItemProps) {
      const { value: itemValue, disabled: itemDisabled, invalid: itemInvalid } = itemProps;

      const itemState = {
        invalid: !!itemInvalid,
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
        "data-invalid": dataAttr(itemState.invalid),
      });

      return {
        ...itemState,

        value: itemProps.value,
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
          name: name || id,
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

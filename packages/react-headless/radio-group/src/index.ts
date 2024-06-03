import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useId, useState } from "react";

import { dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";

interface UseRadioGroupStateProps {
  value?: string;

  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

export function useRadioGroupState(props: UseRadioGroupStateProps) {
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
   * @default "ltr"
   */
  dir?: "ltr" | "rtl" | string;

  disabled?: boolean;

  name?: string;

  form?: string;
}

export interface RadioItemProps {
  value: string;

  disabled?: boolean;

  invalid?: boolean;
}

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

  const {
    dir = "ltr",
    disabled,
    form,
    name,
    value: omitValue,
    defaultValue: omitDefaultValue,
    onValueChange: omitOnValueChange,
    ...restProps
  } = props;

  const stateProps = {
    "data-disabled": dataAttr(disabled),
  };

  return {
    value,
    setValue,

    stateProps,
    restProps,

    rootProps: elementProps({
      role: "radiogroup",
      "aria-labelledby": getLabelId(id),
      ...stateProps,
      dir: dir,
      style: {
        position: "relative",
      },
    }),

    labelProps: elementProps({
      dir: dir,
      ...stateProps,
      id: getLabelId(id),
      // TODO: label 클릭 시 체크가 되어있는 radio에 포커스를 잡아야 한다. 체크된 게 없다면, 첫 번째 radio에 포커스를 잡아야 한다.
    }),

    getItemProps(itemProps: RadioItemProps) {
      const {
        value: itemValue,
        disabled: itemDisabled,
        invalid: itemInvalid,
        ...itemRestProps
      } = itemProps;

      const itemState = {
        isInvalid: !!itemInvalid,
        isDisabled: !!itemDisabled || disabled,
        isChecked: value === itemValue,
        isFocused: focusedValue === itemValue,
        isHovered: hoveredValue === itemValue,
        isActive: activeValue === itemValue,
      };

      const itemStateProps = {
        "data-focus": dataAttr(itemState.isFocused),
        "data-focus-visible": dataAttr(itemState.isFocused && isFocusVisible),
        "data-disabled": dataAttr(itemState.isDisabled),
        "data-checked": dataAttr(itemState.isChecked),
        "data-active": dataAttr(itemState.isActive),
        "data-hover": dataAttr(itemState.isHovered),
        "data-invalid": dataAttr(itemState.isInvalid),
      };

      return {
        itemState,

        setFocusedValue,
        setIsFocusVisible,

        stateProps: itemStateProps,
        restProps: itemRestProps,

        rootProps: elementProps({
          dir: dir,
          ...itemStateProps,
          onPointerMove() {
            if (itemState.isDisabled) return;
            setHoveredValue(itemProps.value);
          },
          onPointerLeave() {
            if (itemState.isDisabled) return;
            setHoveredValue(null);
            setActiveValue(null);
          },
          onPointerDown(event) {
            if (itemState.isDisabled) return;
            // On pointerdown, the input blurs and returns focus to the `body`,
            // we need to prevent this.
            if (itemState.isFocused && event.pointerType === "mouse") {
              event.preventDefault();
            }
            setActiveValue(itemProps.value);
          },
          onPointerUp() {
            if (itemState.isDisabled) return;
            setActiveValue(null);
          },
        }),

        controlProps: elementProps({
          dir: dir,
          "aria-hidden": true,
          ...itemStateProps,
        }),

        hiddenInputProps: inputProps({
          type: "radio",
          name: name || id,
          form: form,
          value: itemProps.value,
          onChange(event) {
            if (itemState.isDisabled) return;

            if (event.target.checked) {
              setValue(itemProps.value);
            }
            setIsFocusVisible(event.target.matches(":focus-visible"));
          },
          onBlur() {
            setFocusedValue(null);
            setIsFocusVisible(false);
          },
          onFocus(event) {
            setFocusedValue(itemProps.value);
            setIsFocusVisible(event.target.matches(":focus-visible"));
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
          disabled: itemState.isDisabled,
          defaultChecked: itemState.isChecked,
        }),
      };
    },
  };
}

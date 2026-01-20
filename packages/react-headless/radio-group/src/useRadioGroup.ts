import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useId, useState } from "react";

import {
  ariaAttr,
  dataAttr,
  elementProps,
  inputProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";
import { getDescriptionId, getErrorMessageId, getLabelId } from "./dom";

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

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLElement | null) => {
    setIsLabelRendered(!!node);
  }, []);
  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);
  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

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

    refs: {
      label: labelRef,
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },
    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },
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

  // not implementing required behavior yet; currently we require users to have value or defaultValue

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
    refs,
    renderedElements,
  } = useRadioGroupState(props);

  const { disabled = false, invalid = false, form, name } = props;

  const isControlled = props.value !== undefined;
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const ariaDescribedBy =
    [
      renderedElements.description ? getDescriptionId(id) : false,
      renderedElements.errorMessage ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const stateProps = elementProps({
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
  });

  return {
    value,
    setValue,

    refs,

    invalid,

    stateProps,

    rootProps: elementProps({
      role: "radiogroup",
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaAttr(invalid),
      ...stateProps,
    }),

    labelProps: elementProps({
      ...stateProps,

      id: getLabelId(id),
    }),

    descriptionProps: elementProps({
      ...stateProps,

      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      ...stateProps,

      id: getErrorMessageId(id),
      "aria-live": "polite",
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

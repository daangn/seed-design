import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId } from "./dom";

interface UseFieldButtonStateProps {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}

function useFieldButtonState({ values = [], onValuesChange = () => {} }: UseFieldButtonStateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);
  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

  return {
    values,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,

    refs: {
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },
    renderedElements: {
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

    setValues: onValuesChange,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  };
}

export interface UseFieldButtonProps extends UseFieldButtonStateProps {
  /**
   * @default false
   */
  disabled?: boolean;

  name?: string;
}

export type UseFieldButtonReturn = ReturnType<typeof useFieldButton>;

export function useFieldButton(props: UseFieldButtonProps) {
  const id = useId();
  const { values: propValues, onValuesChange, disabled = false, name } = props;

  const {
    values: stateValues,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    refs,
    renderedElements,
    setValues,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  } = useFieldButtonState({ values: propValues, onValuesChange });

  const ariaDescribedBy =
    [
      renderedElements.description ? getDescriptionId(id) : false,
      renderedElements.errorMessage ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const stateProps = elementProps({
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isActive),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-disabled": dataAttr(disabled),
  });

  return {
    values: stateValues,
    active: isActive,
    focused: isFocused,

    setIsFocused,
    setIsFocusVisible,

    refs,

    stateProps,

    rootProps: elementProps({
      ...stateProps,

      onPointerMove() {
        setIsHovered(true);
      },
      onPointerDown() {
        setIsActive(true);
      },
      onPointerUp() {
        setIsActive(false);
      },
      onPointerLeave() {
        setIsHovered(false);
        setIsActive(false);
      },
    }),

    labelProps: elementProps({
      ...stateProps,
      // <button>에 aria-label을 추가하는 것이 expected이기 때문에 label을 중복으로 읽으면 안 됨
      "aria-hidden": true,
    }),

    buttonProps: buttonProps({
      // ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),

      // 위처럼 하지 않는 이유: label만으로 button의 맥락을 모두 설명하기 어려움.
      // label만으로 button을 설명하기보다 button에 aria-label을 다는 것이 적절함
      // e.g. <FieldButtonLabel>태그</FieldButtonLabel>
      // '태그'를 FieldButton의 label로 사용하기 어려움 (value, placeholder 관련 정보가 누락됨)
      // '태그 편집하기, 현재 컴퓨터, 운동화 선택됨' 정도가 적절하고 이건 직접 넣어 줘야 함

      "aria-describedby": ariaDescribedBy,

      disabled,
      "aria-disabled": ariaAttr(disabled),

      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
    }),

    clearButtonProps: buttonProps({
      onClick: useCallback(() => setValues([]), [setValues]),
    }),

    hiddenInputsProps: stateValues.map((value) =>
      inputProps({
        ...stateProps,
        type: "hidden",
        value,
        name: name || id,
      }),
    ),

    descriptionProps: elementProps({
      ...stateProps,
      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      ...stateProps,
      id: getErrorMessageId(id),
      "aria-live": "polite",
    }),
  };
}

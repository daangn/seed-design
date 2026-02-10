import { useCallback, useId, useState } from "react";

import { elementProps } from "@seed-design/dom-utils";
import { getDescriptionId, getErrorMessageId, getLabelId } from "./dom";

export type UseFieldsetReturn = ReturnType<typeof useFieldset>;

export function useFieldset() {
  const id = useId();

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

  const ariaDescribedBy =
    [
      isDescriptionRendered ? getDescriptionId(id) : false,
      isErrorMessageRendered ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return {
    id,

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

    rootProps: elementProps({
      // see: https://w3c.github.io/aria/#group
      role: "group",

      // note: aria-disabled is supported but useFieldset doesn't know about the disabled state of its children
      // note: aria-required and aria-invalid should not be set here

      ...(isLabelRendered && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
    }),

    labelProps: elementProps({
      id: getLabelId(id),
    }),

    descriptionProps: elementProps({
      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      id: getErrorMessageId(id),
      "aria-live": "polite",
    }),
  };
}

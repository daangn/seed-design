import { elementProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";

export type UseSelectGroupReturn = ReturnType<typeof useSelectGroup>;

// A group advertises aria-labelledby only while its label is actually rendered.
// A callback ref flips a boolean synchronously at commit, so the attribute is
// present on first paint and never points at a missing id. Each group owns its
// own id and presence flag, so conditionally rendering or reordering groups can
// never make one group inherit another's label reference.
export function useSelectGroup() {
  const id = useId();
  const labelId = `select-group:${id}:label`;

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLDivElement | null) => {
    setIsLabelRendered(!!node);
  }, []);

  return {
    refs: {
      label: labelRef,
    },

    rootProps: elementProps({
      role: "group",
      ...(isLabelRendered && { "aria-labelledby": labelId }),
    }),

    labelProps: elementProps({
      role: "presentation",
      id: labelId,
    }),
  };
}

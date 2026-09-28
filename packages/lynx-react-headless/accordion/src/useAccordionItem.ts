import * as React from "@lynx-js/react";
import { useAccordionContext } from "./useAccordionContext.js";

export interface UseAccordionItemProps {
  value: string;
  disabled?: boolean;
}

export interface UseAccordionItemReturn {
  value: string;
  open: boolean;
  disabled: boolean;
  toggle: () => void;
}

export function useAccordionItem({
  value,
  disabled: itemDisabled = false,
}: UseAccordionItemProps): UseAccordionItemReturn {
  const accordion = useAccordionContext("AccordionItem");
  const disabled = accordion.disabled || itemDisabled;
  const open = accordion.values.includes(value);
  const toggle = React.useCallback(() => {
    if (!disabled) accordion.toggle(value);
  }, [accordion, disabled, value]);

  return React.useMemo(() => ({ value, open, disabled, toggle }), [value, open, disabled, toggle]);
}

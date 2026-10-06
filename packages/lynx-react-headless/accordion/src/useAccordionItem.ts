import * as React from "@lynx-js/react";
import { useCollapsible, type UseCollapsibleReturn } from "@seed-design/lynx-react-collapsible";
import { useAccordionContext } from "./useAccordionContext.js";

export interface UseAccordionItemProps {
  value: string;
  disabled?: boolean;
}

/**
 * Item의 Collapsible 상태입니다. `CollapsibleProvider`에 그대로 넘길 수 있어
 * `useCollapsibleTrigger`·`useCollapsibleContent`가 Accordion 값과 연결됩니다.
 */
export interface UseAccordionItemReturn extends UseCollapsibleReturn {
  value: string;
}

export function useAccordionItem({
  value,
  disabled: itemDisabled = false,
}: UseAccordionItemProps): UseAccordionItemReturn {
  const accordion = useAccordionContext();
  const handleOpenChange = React.useCallback(() => {
    "background only";
    accordion.toggle(value);
  }, [accordion, value]);
  const collapsible = useCollapsible({
    open: accordion.isOpen(value),
    onOpenChange: handleOpenChange,
    disabled: accordion.disabled || itemDisabled,
  });

  return React.useMemo(() => ({ ...collapsible, value }), [collapsible, value]);
}

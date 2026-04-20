export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  type AccordionRootProps,
  type AccordionSingleRootProps,
  type AccordionMultipleRootProps,
  type AccordionItemProps,
  type AccordionHeaderProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from "./Accordion";

export {
  useAccordion,
  type UseAccordionProps,
  type UseAccordionSingleProps,
  type UseAccordionMultipleProps,
  type UseAccordionReturn,
} from "./useAccordion";

export {
  useAccordionContext,
  AccordionProvider,
  type UseAccordionContext,
} from "./useAccordionContext";

export {
  useAccordionItemContext,
  AccordionItemProvider,
  type UseAccordionItemContext,
} from "./useAccordionItemContext";

export * as Accordion from "./Accordion.namespace";

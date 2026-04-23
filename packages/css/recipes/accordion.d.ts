declare interface AccordionVariant {
  /**
  * @default "inline"
  */
  variant: "inline" | "separated";
/**
  * @default "medium"
  */
  size: "medium" | "large";
}

declare type AccordionVariantMap = {
  [key in keyof AccordionVariant]: Array<AccordionVariant[key]>;
};

export declare type AccordionVariantProps = Partial<AccordionVariant>;

export declare type AccordionSlotName = "root" | "item" | "header" | "trigger" | "prefix" | "prefixIcon" | "body" | "title" | "description" | "suffixIcon" | "content";

export declare const accordionVariantMap: AccordionVariantMap;

export declare const accordion: ((
  props?: AccordionVariantProps,
) => Record<AccordionSlotName, string>) & {
  splitVariantProps: <T extends AccordionVariantProps>(
    props: T,
  ) => [AccordionVariantProps, Omit<T, keyof AccordionVariantProps>];
}
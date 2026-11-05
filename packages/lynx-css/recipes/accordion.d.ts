declare interface AccordionVariant {
  /**
  * @default "inline"
  */
  variant: "inline" | "separated";
/**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type AccordionVariantMap = {
  [key in keyof AccordionVariant]: Array<AccordionVariant[key]>;
};

export declare type AccordionVariantProps = Partial<AccordionVariant>;

export declare type AccordionSlotName = "root" | "item" | "header" | "trigger" | "triggerContent" | "pressedOverlay" | "prefix" | "body" | "title" | "description" | "suffixIcon" | "content" | "contentInner" | "divider";

export declare const accordionVariantMap: AccordionVariantMap;

export declare const accordion: ((
  props?: AccordionVariantProps,
) => Record<AccordionSlotName, string>) & {
  splitVariantProps: <T extends AccordionVariantProps>(
    props: T,
  ) => [AccordionVariantProps, Omit<T, keyof AccordionVariantProps>];
}
declare interface AccordionVariant {
  /**
  * - `inline`: Accordion Item들이 하나의 연속된 목록처럼 표현됩니다. 밀접하게 관련된 항목들을 컴팩트하게 나열할 때 사용합니다.
  * - `separated`: 각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.
  *
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

export declare type AccordionSlotName = "root" | "item" | "header" | "trigger" | "prefix" | "body" | "title" | "description" | "suffixIcon" | "content";

export declare const accordionVariantMap: AccordionVariantMap;

export declare const accordion: ((
  props?: AccordionVariantProps,
) => Record<AccordionSlotName, string>) & {
  splitVariantProps: <T extends AccordionVariantProps>(
    props: T,
  ) => [AccordionVariantProps, Omit<T, keyof AccordionVariantProps>];
}
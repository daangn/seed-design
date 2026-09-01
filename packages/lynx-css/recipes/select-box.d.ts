declare interface SelectBoxVariant {
  /**
  * @default "horizontal"
  */
  layout: "horizontal" | "vertical";
/**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  footerOpen: boolean;
}

declare type SelectBoxVariantMap = {
  [key in keyof SelectBoxVariant]: Array<SelectBoxVariant[key]>;
};

export declare type SelectBoxVariantProps = Partial<SelectBoxVariant>;

export declare type SelectBoxSlotName = "interactionRoot" | "root" | "selectedStroke" | "trigger" | "content" | "prefixIcon" | "body" | "label" | "description" | "footer" | "footerInner";

export declare const selectBoxVariantMap: SelectBoxVariantMap;

export declare const selectBox: ((
  props?: SelectBoxVariantProps,
) => Record<SelectBoxSlotName, string>) & {
  splitVariantProps: <T extends SelectBoxVariantProps>(
    props: T,
  ) => [SelectBoxVariantProps, Omit<T, keyof SelectBoxVariantProps>];
}
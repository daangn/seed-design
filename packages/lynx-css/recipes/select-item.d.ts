declare interface SelectItemVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
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
  selected: boolean;
}

declare type SelectItemVariantMap = {
  [key in keyof SelectItemVariant]: Array<SelectItemVariant[key]>;
};

export declare type SelectItemVariantProps = Partial<SelectItemVariant>;

export declare type SelectItemSlotName = "root" | "prefixIcon" | "body" | "label" | "description" | "indicator";

export declare const selectItemVariantMap: SelectItemVariantMap;

export declare const selectItem: ((
  props?: SelectItemVariantProps,
) => Record<SelectItemSlotName, string>) & {
  splitVariantProps: <T extends SelectItemVariantProps>(
    props: T,
  ) => [SelectItemVariantProps, Omit<T, keyof SelectItemVariantProps>];
}
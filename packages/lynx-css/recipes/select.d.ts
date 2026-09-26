declare interface SelectVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  positioned: boolean;
}

declare type SelectVariantMap = {
  [key in keyof SelectVariant]: Array<SelectVariant[key]>;
};

export declare type SelectVariantProps = Partial<SelectVariant>;

export declare type SelectSlotName = "positioner" | "backdrop" | "content" | "scrollArea" | "scrollContent" | "group" | "groupLabel" | "separator";

export declare const selectVariantMap: SelectVariantMap;

export declare const select: ((
  props?: SelectVariantProps,
) => Record<SelectSlotName, string>) & {
  splitVariantProps: <T extends SelectVariantProps>(
    props: T,
  ) => [SelectVariantProps, Omit<T, keyof SelectVariantProps>];
}
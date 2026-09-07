declare interface SelectVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
}

declare type SelectVariantMap = {
  [key in keyof SelectVariant]: Array<SelectVariant[key]>;
};

export declare type SelectVariantProps = Partial<SelectVariant>;

export declare type SelectSlotName = "root" | "backdrop" | "scrollArea" | "group" | "groupLabel";

export declare const selectVariantMap: SelectVariantMap;

export declare const select: ((
  props?: SelectVariantProps,
) => Record<SelectSlotName, string>) & {
  splitVariantProps: <T extends SelectVariantProps>(
    props: T,
  ) => [SelectVariantProps, Omit<T, keyof SelectVariantProps>];
}
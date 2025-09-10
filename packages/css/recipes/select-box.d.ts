declare interface SelectBoxVariant {
  
}

declare type SelectBoxVariantMap = {
  [key in keyof SelectBoxVariant]: Array<SelectBoxVariant[key]>;
};

export declare type SelectBoxVariantProps = Partial<SelectBoxVariant>;

export declare type SelectBoxSlotName = "root" | "content" | "label" | "description";

export declare const selectBoxVariantMap: SelectBoxVariantMap;

export declare const selectBox: ((
  props?: SelectBoxVariantProps,
) => Record<SelectBoxSlotName, string>) & {
  splitVariantProps: <T extends SelectBoxVariantProps>(
    props: T,
  ) => [SelectBoxVariantProps, Omit<T, keyof SelectBoxVariantProps>];
}
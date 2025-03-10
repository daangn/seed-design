declare interface SelectBoxGroupVariant {
  
}

declare type SelectBoxGroupVariantMap = {
  [key in keyof SelectBoxGroupVariant]: Array<SelectBoxGroupVariant[key]>;
};

export declare type SelectBoxGroupVariantProps = Partial<SelectBoxGroupVariant>;

export declare const selectBoxGroupVariantMap: SelectBoxGroupVariantMap;

export declare const selectBoxGroup: ((
  props?: SelectBoxGroupVariantProps,
) => string) & {
  splitVariantProps: <T extends SelectBoxGroupVariantProps>(
    props: T,
  ) => [SelectBoxGroupVariantProps, Omit<T, keyof SelectBoxGroupVariantProps>];
}
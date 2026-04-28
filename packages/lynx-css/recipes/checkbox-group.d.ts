declare interface CheckboxGroupVariant {
  
}

declare type CheckboxGroupVariantMap = {
  [key in keyof CheckboxGroupVariant]: Array<CheckboxGroupVariant[key]>;
};

export declare type CheckboxGroupVariantProps = Partial<CheckboxGroupVariant>;

export declare const checkboxGroupVariantMap: CheckboxGroupVariantMap;

export declare const checkboxGroup: ((
  props?: CheckboxGroupVariantProps,
) => string) & {
  splitVariantProps: <T extends CheckboxGroupVariantProps>(
    props: T,
  ) => [CheckboxGroupVariantProps, Omit<T, keyof CheckboxGroupVariantProps>];
}
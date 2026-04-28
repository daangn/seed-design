declare interface RadioGroupVariant {
  
}

declare type RadioGroupVariantMap = {
  [key in keyof RadioGroupVariant]: Array<RadioGroupVariant[key]>;
};

export declare type RadioGroupVariantProps = Partial<RadioGroupVariant>;

export declare const radioGroupVariantMap: RadioGroupVariantMap;

export declare const radioGroup: ((
  props?: RadioGroupVariantProps,
) => string) & {
  splitVariantProps: <T extends RadioGroupVariantProps>(
    props: T,
  ) => [RadioGroupVariantProps, Omit<T, keyof RadioGroupVariantProps>];
}
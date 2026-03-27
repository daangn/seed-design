declare interface RadioGroupVariant {
  
  disabled?: boolean;
  loading?: boolean;}

declare type RadioGroupVariantMap = {
  [key in keyof RadioGroupVariant]: Array<RadioGroupVariant[key]>;
};

export declare type RadioGroupVariantProps = Partial<RadioGroupVariant>;

export declare type RadioGroupSlotName = "root" | "text";

export declare const radioGroupVariantMap: RadioGroupVariantMap;

export declare const radioGroup: ((
  props?: RadioGroupVariantProps,
) => Record<RadioGroupSlotName, string>) & {
  splitVariantProps: <T extends RadioGroupVariantProps>(
    props: T,
  ) => [RadioGroupVariantProps, Omit<T, keyof RadioGroupVariantProps>];
}
declare interface CheckboxGroupVariant {
  
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;}

declare type CheckboxGroupVariantMap = {
  [key in keyof CheckboxGroupVariant]: Array<CheckboxGroupVariant[key]>;
};

export declare type CheckboxGroupVariantProps = Partial<CheckboxGroupVariant>;

export declare type CheckboxGroupSlotName = "root" | "text";

export declare const checkboxGroupVariantMap: CheckboxGroupVariantMap;

export declare const checkboxGroup: ((
  props?: CheckboxGroupVariantProps,
) => Record<CheckboxGroupSlotName, string>) & {
  splitVariantProps: <T extends CheckboxGroupVariantProps>(
    props: T,
  ) => [CheckboxGroupVariantProps, Omit<T, keyof CheckboxGroupVariantProps>];
}
declare interface CheckboxVariant {
  /**
  * @default "regular"
  */
  weight: "regular" | "bold";
/**
  * @default "medium"
  */
  size: "large" | "medium";
}

declare type CheckboxVariantMap = {
  [key in keyof CheckboxVariant]: Array<CheckboxVariant[key]>;
};

export declare type CheckboxVariantProps = Partial<CheckboxVariant>;

export declare type CheckboxSlotName = "root" | "label";

export declare const checkboxVariantMap: CheckboxVariantMap;

export declare const checkbox: ((
  props?: CheckboxVariantProps,
) => Record<CheckboxSlotName, string>) & {
  splitVariantProps: <T extends CheckboxVariantProps>(
    props: T,
  ) => [CheckboxVariantProps, Omit<T, keyof CheckboxVariantProps>];
}
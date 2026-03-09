declare interface RadioVariant {
  /**
  * @default "regular"
  */
  weight: "regular" | "bold";
/**
  * @default "medium"
  */
  size: "large" | "medium";
}

declare type RadioVariantMap = {
  [key in keyof RadioVariant]: Array<RadioVariant[key]>;
};

export declare type RadioVariantProps = Partial<RadioVariant>;

export declare type RadioSlotName = "root" | "label";

export declare const radioVariantMap: RadioVariantMap;

export declare const radio: ((
  props?: RadioVariantProps,
) => Record<RadioSlotName, string>) & {
  splitVariantProps: <T extends RadioVariantProps>(
    props: T,
  ) => [RadioVariantProps, Omit<T, keyof RadioVariantProps>];
}
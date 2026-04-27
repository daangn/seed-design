declare interface RadiomarkVariant {
  /**
  * @default "brand"
  */
  tone: "brand" | "neutral";
/**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default false
  */
  checked: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type RadiomarkVariantMap = {
  [key in keyof RadiomarkVariant]: Array<RadiomarkVariant[key]>;
};

export declare type RadiomarkVariantProps = Partial<RadiomarkVariant>;

export declare type RadiomarkSlotName = "root" | "icon";

export declare const radiomarkVariantMap: RadiomarkVariantMap;

export declare const radiomark: ((
  props?: RadiomarkVariantProps,
) => Record<RadiomarkSlotName, string>) & {
  splitVariantProps: <T extends RadiomarkVariantProps>(
    props: T,
  ) => [RadiomarkVariantProps, Omit<T, keyof RadiomarkVariantProps>];
}
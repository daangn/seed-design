declare interface CheckmarkVariant {
  /**
  * @default "square"
  */
  variant: "square" | "ghost";
/**
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default "medium"
  */
  size: "large" | "medium";
}

declare type CheckmarkVariantMap = {
  [key in keyof CheckmarkVariant]: Array<CheckmarkVariant[key]>;
};

export declare type CheckmarkVariantProps = Partial<CheckmarkVariant>;

export declare type CheckmarkSlotName = "root" | "icon";

export declare const checkmarkVariantMap: CheckmarkVariantMap;

export declare const checkmark: ((
  props?: CheckmarkVariantProps,
) => Record<CheckmarkSlotName, string>) & {
  splitVariantProps: <T extends CheckmarkVariantProps>(
    props: T,
  ) => [CheckmarkVariantProps, Omit<T, keyof CheckmarkVariantProps>];
}
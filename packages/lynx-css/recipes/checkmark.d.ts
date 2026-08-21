declare interface CheckmarkVariant {
  /**
  * @default "square"
  */
  variant: "square" | "ghost";
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
  indeterminate: boolean;
/**
  * @default false
  */
  pressed: boolean;
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
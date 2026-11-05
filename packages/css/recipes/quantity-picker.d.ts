declare interface QuantityPickerVariant {
  /**
  * @default "hug"
  */
  layout: "hug" | "fill";
/**
  * @default "medium"
  */
  size: "small" | "medium" | "large";
}

declare type QuantityPickerVariantMap = {
  [key in keyof QuantityPickerVariant]: Array<QuantityPickerVariant[key]>;
};

export declare type QuantityPickerVariantProps = Partial<QuantityPickerVariant>;

export declare type QuantityPickerSlotName = "root" | "decrementButton" | "decrementIcon" | "valueDisplay" | "valueDisplayPlaceholder" | "valueDisplayText" | "divider" | "incrementButton" | "incrementIcon";

export declare const quantityPickerVariantMap: QuantityPickerVariantMap;

export declare const quantityPicker: ((
  props?: QuantityPickerVariantProps,
) => Record<QuantityPickerSlotName, string>) & {
  splitVariantProps: <T extends QuantityPickerVariantProps>(
    props: T,
  ) => [QuantityPickerVariantProps, Omit<T, keyof QuantityPickerVariantProps>];
}
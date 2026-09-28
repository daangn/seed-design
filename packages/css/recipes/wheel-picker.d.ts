declare interface WheelPickerVariant {
  /**
  * @default "medium"
  */
  size: "small" | "medium";
}

declare type WheelPickerVariantMap = {
  [key in keyof WheelPickerVariant]: Array<WheelPickerVariant[key]>;
};

export declare type WheelPickerVariantProps = Partial<WheelPickerVariant>;

export declare type WheelPickerSlotName = "root" | "scrollFog" | "columns" | "column" | "item" | "itemLabel" | "selectionIndicator";

export declare const wheelPickerVariantMap: WheelPickerVariantMap;

export declare const wheelPicker: ((
  props?: WheelPickerVariantProps,
) => Record<WheelPickerSlotName, string>) & {
  splitVariantProps: <T extends WheelPickerVariantProps>(
    props: T,
  ) => [WheelPickerVariantProps, Omit<T, keyof WheelPickerVariantProps>];
}
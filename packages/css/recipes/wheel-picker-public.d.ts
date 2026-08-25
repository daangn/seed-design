declare interface WheelPickerPublicVariant {
  /**
  * @default "medium"
  */
  size: "small" | "medium";
}

declare type WheelPickerPublicVariantMap = {
  [key in keyof WheelPickerPublicVariant]: Array<WheelPickerPublicVariant[key]>;
};

export declare type WheelPickerPublicVariantProps = Partial<WheelPickerPublicVariant>;

export declare type WheelPickerPublicSlotName = "root" | "scrollFog" | "columns" | "column" | "item" | "itemLabel" | "selectionIndicator";

export declare const wheelPickerPublicVariantMap: WheelPickerPublicVariantMap;

export declare const wheelPickerPublic: ((
  props?: WheelPickerPublicVariantProps,
) => Record<WheelPickerPublicSlotName, string>) & {
  splitVariantProps: <T extends WheelPickerPublicVariantProps>(
    props: T,
  ) => [WheelPickerPublicVariantProps, Omit<T, keyof WheelPickerPublicVariantProps>];
}
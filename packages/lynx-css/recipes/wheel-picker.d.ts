declare interface WheelPickerVariant {
  /**
  * @default "medium"
  */
  size: "small" | "medium";
/**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type WheelPickerVariantMap = {
  [key in keyof WheelPickerVariant]: Array<WheelPickerVariant[key]>;
};

export declare type WheelPickerVariantProps = Partial<WheelPickerVariant>;

export declare type WheelPickerSlotName = "root" | "scrollFog" | "columns" | "column" | "track" | "sizingContent" | "item" | "itemLabel" | "itemText" | "selectionIndicator";

export declare const wheelPickerVariantMap: WheelPickerVariantMap;

export declare const wheelPicker: ((
  props?: WheelPickerVariantProps,
) => Record<WheelPickerSlotName, string>) & {
  splitVariantProps: <T extends WheelPickerVariantProps>(
    props: T,
  ) => [WheelPickerVariantProps, Omit<T, keyof WheelPickerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const wheelPickerSeedTagSpec: {
  readonly name: "WheelPicker";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "medium" };
};

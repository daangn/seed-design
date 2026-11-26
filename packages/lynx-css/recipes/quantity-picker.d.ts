declare interface QuantityPickerVariant {
  /**
  * @default "hug"
  */
  layout: "hug" | "fill";
/**
  * @default "medium"
  */
  size: "small" | "medium" | "large";
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  loading: boolean;
}

declare type QuantityPickerVariantMap = {
  [key in keyof QuantityPickerVariant]: Array<QuantityPickerVariant[key]>;
};

export declare type QuantityPickerVariantProps = Partial<QuantityPickerVariant>;

export declare type QuantityPickerSlotName = "root" | "stroke" | "decrementButton" | "decrementIcon" | "valueDisplay" | "valueDisplayPlaceholder" | "valueDisplayText" | "divider" | "incrementButton" | "incrementIcon";

export declare const quantityPickerVariantMap: QuantityPickerVariantMap;

export declare const quantityPicker: ((
  props?: QuantityPickerVariantProps,
) => Record<QuantityPickerSlotName, string>) & {
  splitVariantProps: <T extends QuantityPickerVariantProps>(
    props: T,
  ) => [QuantityPickerVariantProps, Omit<T, keyof QuantityPickerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const quantityPickerSeedTagSpec: {
  readonly name: "QuantityPicker";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "medium" };
};

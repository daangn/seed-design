declare interface SegmentedTextInputVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  focused: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  readOnly: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type SegmentedTextInputVariantMap = {
  [key in keyof SegmentedTextInputVariant]: Array<SegmentedTextInputVariant[key]>;
};

export declare type SegmentedTextInputVariantProps = Partial<SegmentedTextInputVariant>;

export declare type SegmentedTextInputSlotName = "root" | "baseStroke" | "stroke" | "segment" | "segmentFill" | "segmentCenter" | "valueContainer" | "valueContainerFill" | "valueSizer" | "value" | "maskedValue" | "placeholder" | "placeholderBeforeSuffix" | "dots" | "maskedDots" | "dot" | "placeholderDot" | "maskedDot" | "filledDot" | "caret" | "readOnlyValue" | "readOnlyText" | "readOnlyPlaceholder" | "maskedReadOnlyText" | "staticText" | "staticContent" | "staticPrefix" | "staticSuffix" | "separator" | "suffix";

export declare const segmentedTextInputVariantMap: SegmentedTextInputVariantMap;

export declare const segmentedTextInput: ((
  props?: SegmentedTextInputVariantProps,
) => Record<SegmentedTextInputSlotName, string>) & {
  splitVariantProps: <T extends SegmentedTextInputVariantProps>(
    props: T,
  ) => [SegmentedTextInputVariantProps, Omit<T, keyof SegmentedTextInputVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const segmentedTextInputSeedTagSpec: {
  readonly name: "SegmentedTextInput";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "large" };
};

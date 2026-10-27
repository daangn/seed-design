declare interface SegmentedTextInputVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
}

declare type SegmentedTextInputVariantMap = {
  [key in keyof SegmentedTextInputVariant]: Array<SegmentedTextInputVariant[key]>;
};

export declare type SegmentedTextInputVariantProps = Partial<SegmentedTextInputVariant>;

export declare type SegmentedTextInputSlotName = "root" | "segment" | "valueContainer" | "valueSizer" | "value" | "staticText" | "separator" | "suffix";

export declare const segmentedTextInputVariantMap: SegmentedTextInputVariantMap;

export declare const segmentedTextInput: ((
  props?: SegmentedTextInputVariantProps,
) => Record<SegmentedTextInputSlotName, string>) & {
  splitVariantProps: <T extends SegmentedTextInputVariantProps>(
    props: T,
  ) => [SegmentedTextInputVariantProps, Omit<T, keyof SegmentedTextInputVariantProps>];
}
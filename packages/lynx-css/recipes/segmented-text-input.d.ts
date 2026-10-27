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

export declare type SegmentedTextInputSlotName = "root" | "baseStroke" | "stroke" | "segment" | "segmentFill" | "segmentCenter" | "valueContainer" | "valueContainerFill" | "valueSizer" | "value" | "maskedValue" | "readOnlyValue" | "readOnlyText" | "readOnlyPlaceholder" | "staticText" | "separator" | "suffix";

export declare const segmentedTextInputVariantMap: SegmentedTextInputVariantMap;

export declare const segmentedTextInput: ((
  props?: SegmentedTextInputVariantProps,
) => Record<SegmentedTextInputSlotName, string>) & {
  splitVariantProps: <T extends SegmentedTextInputVariantProps>(
    props: T,
  ) => [SegmentedTextInputVariantProps, Omit<T, keyof SegmentedTextInputVariantProps>];
}
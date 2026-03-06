declare interface SegmentedControlVariant {
  
}

declare type SegmentedControlVariantMap = {
  [key in keyof SegmentedControlVariant]: Array<SegmentedControlVariant[key]>;
};

export declare type SegmentedControlVariantProps = Partial<SegmentedControlVariant>;

export declare type SegmentedControlSlotName = "root" | "indicator" | "item";

export declare const segmentedControlVariantMap: SegmentedControlVariantMap;

export declare const segmentedControl: ((
  props?: SegmentedControlVariantProps,
) => Record<SegmentedControlSlotName, string>) & {
  splitVariantProps: <T extends SegmentedControlVariantProps>(
    props: T,
  ) => [SegmentedControlVariantProps, Omit<T, keyof SegmentedControlVariantProps>];
}
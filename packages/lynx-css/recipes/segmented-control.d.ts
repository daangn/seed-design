declare interface SegmentedControlVariant {
  /**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default true
  */
  hasSelection: boolean;
}

declare type SegmentedControlVariantMap = {
  [key in keyof SegmentedControlVariant]: Array<SegmentedControlVariant[key]>;
};

export declare type SegmentedControlVariantProps = Partial<SegmentedControlVariant>;

export declare type SegmentedControlSlotName = "root" | "indicator" | "item" | "itemBackground" | "label";

export declare const segmentedControlVariantMap: SegmentedControlVariantMap;

export declare const segmentedControl: ((
  props?: SegmentedControlVariantProps,
) => Record<SegmentedControlSlotName, string>) & {
  splitVariantProps: <T extends SegmentedControlVariantProps>(
    props: T,
  ) => [SegmentedControlVariantProps, Omit<T, keyof SegmentedControlVariantProps>];
}
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
  * @default true
  */
  hasSelection: boolean;
/**
  * @default true
  */
  transitionEnabled: boolean;
}

declare type SegmentedControlVariantMap = {
  [key in keyof SegmentedControlVariant]: Array<SegmentedControlVariant[key]>;
};

export declare type SegmentedControlVariantProps = Partial<SegmentedControlVariant>;

export declare type SegmentedControlSlotName = "root" | "indicator" | "item" | "itemContent" | "itemBackground" | "itemSelectedBackground" | "label";

export declare const segmentedControlVariantMap: SegmentedControlVariantMap;

export declare const segmentedControl: ((
  props?: SegmentedControlVariantProps,
) => Record<SegmentedControlSlotName, string>) & {
  splitVariantProps: <T extends SegmentedControlVariantProps>(
    props: T,
  ) => [SegmentedControlVariantProps, Omit<T, keyof SegmentedControlVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const segmentedControlSeedTagSpec: {
  readonly name: "SegmentedControl";
  readonly axes: readonly [];
  readonly defaults: {};
};

declare interface BottomSheetHandleVariant {
  
}

declare type BottomSheetHandleVariantMap = {
  [key in keyof BottomSheetHandleVariant]: Array<BottomSheetHandleVariant[key]>;
};

export declare type BottomSheetHandleVariantProps = Partial<BottomSheetHandleVariant>;

export declare type BottomSheetHandleSlotName = "root" | "touchArea";

export declare const bottomSheetHandleVariantMap: BottomSheetHandleVariantMap;

export declare const bottomSheetHandle: ((
  props?: BottomSheetHandleVariantProps,
) => Record<BottomSheetHandleSlotName, string>) & {
  splitVariantProps: <T extends BottomSheetHandleVariantProps>(
    props: T,
  ) => [BottomSheetHandleVariantProps, Omit<T, keyof BottomSheetHandleVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const bottomSheetHandleSeedTagSpec: {
  readonly name: "BottomSheetHandle";
  readonly axes: readonly [];
  readonly defaults: {};
};

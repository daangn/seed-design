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
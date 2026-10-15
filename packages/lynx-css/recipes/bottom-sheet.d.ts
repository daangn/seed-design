declare interface BottomSheetVariant {
  /**
  * @default "left"
  */
  headerAlign: "left" | "center";
/**
  * @default false
  */
  skipAnimation: boolean;
/**
  * @default false
  */
  closeButton: boolean;
}

declare type BottomSheetVariantMap = {
  [key in keyof BottomSheetVariant]: Array<BottomSheetVariant[key]>;
};

export declare type BottomSheetVariantProps = Partial<BottomSheetVariant>;

export declare type BottomSheetSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "scrollArea" | "scrollContent" | "footer" | "title" | "description" | "closeButton" | "closeButtonIcon";

export declare const bottomSheetVariantMap: BottomSheetVariantMap;

export declare const bottomSheet: ((
  props?: BottomSheetVariantProps,
) => Record<BottomSheetSlotName, string>) & {
  splitVariantProps: <T extends BottomSheetVariantProps>(
    props: T,
  ) => [BottomSheetVariantProps, Omit<T, keyof BottomSheetVariantProps>];
}
declare interface BottomSheetVariant {
  /**
  * @default "left"
  */
  headerAlign: "left" | "center";
/**
  * @default false
  */
  skipAnimation: boolean;
}

declare type BottomSheetVariantMap = {
  [key in keyof BottomSheetVariant]: Array<BottomSheetVariant[key]>;
};

export declare type BottomSheetVariantProps = Partial<BottomSheetVariant>;

export declare type BottomSheetSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const bottomSheetVariantMap: BottomSheetVariantMap;

export declare const bottomSheet: ((
  props?: BottomSheetVariantProps,
) => Record<BottomSheetSlotName, string>) & {
  splitVariantProps: <T extends BottomSheetVariantProps>(
    props: T,
  ) => [BottomSheetVariantProps, Omit<T, keyof BottomSheetVariantProps>];
}
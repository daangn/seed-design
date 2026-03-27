declare interface ActionSheetVariant {
  
}

declare type ActionSheetVariantMap = {
  [key in keyof ActionSheetVariant]: Array<ActionSheetVariant[key]>;
};

export declare type ActionSheetVariantProps = Partial<ActionSheetVariant>;

export declare type ActionSheetSlotName = "backdrop" | "positioner" | "content" | "header" | "title" | "description" | "list" | "closeButton";

export declare const actionSheetVariantMap: ActionSheetVariantMap;

export declare const actionSheet: ((
  props?: ActionSheetVariantProps,
) => Record<ActionSheetSlotName, string>) & {
  splitVariantProps: <T extends ActionSheetVariantProps>(
    props: T,
  ) => [ActionSheetVariantProps, Omit<T, keyof ActionSheetVariantProps>];
}
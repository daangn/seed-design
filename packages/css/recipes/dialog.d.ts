declare interface DialogVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "large";
}

declare type DialogVariantMap = {
  [key in keyof DialogVariant]: Array<DialogVariant[key]>;
};

export declare type DialogVariantProps = Partial<DialogVariant>;

export declare type DialogSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const dialogVariantMap: DialogVariantMap;

export declare const dialog: ((
  props?: DialogVariantProps,
) => Record<DialogSlotName, string>) & {
  splitVariantProps: <T extends DialogVariantProps>(
    props: T,
  ) => [DialogVariantProps, Omit<T, keyof DialogVariantProps>];
}
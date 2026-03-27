declare interface DialogVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
}

declare type DialogVariantMap = {
  [key in keyof DialogVariant]: Array<DialogVariant[key]>;
};

export declare type DialogVariantProps = Partial<DialogVariant>;

export declare type DialogSlotName = "positioner" | "backdrop" | "content" | "header" | "footer" | "action" | "title" | "description";

export declare const dialogVariantMap: DialogVariantMap;

export declare const dialog: ((
  props?: DialogVariantProps,
) => Record<DialogSlotName, string>) & {
  splitVariantProps: <T extends DialogVariantProps>(
    props: T,
  ) => [DialogVariantProps, Omit<T, keyof DialogVariantProps>];
}
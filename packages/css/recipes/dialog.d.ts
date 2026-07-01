declare interface DialogVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
/**
  * @default "alert"
  */
  size: "alert" | "medium" | "large";
}

declare type DialogVariantMap = {
  [key in keyof DialogVariant]: Array<DialogVariant[key]>;
};

export declare type DialogVariantProps = Partial<DialogVariant>;

export declare type DialogSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "action" | "title" | "description" | "closeButton";

export declare const dialogVariantMap: DialogVariantMap;

export declare const dialog: ((
  props?: DialogVariantProps,
) => Record<DialogSlotName, string>) & {
  splitVariantProps: <T extends DialogVariantProps>(
    props: T,
  ) => [DialogVariantProps, Omit<T, keyof DialogVariantProps>];
}
declare interface AlertDialogVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
}

declare type AlertDialogVariantMap = {
  [key in keyof AlertDialogVariant]: Array<AlertDialogVariant[key]>;
};

export declare type AlertDialogVariantProps = Partial<AlertDialogVariant>;

export declare type AlertDialogSlotName = "positioner" | "backdrop" | "content" | "header" | "footer" | "action" | "title" | "description";

export declare const alertDialogVariantMap: AlertDialogVariantMap;

export declare const alertDialog: ((
  props?: AlertDialogVariantProps,
) => Record<AlertDialogSlotName, string>) & {
  splitVariantProps: <T extends AlertDialogVariantProps>(
    props: T,
  ) => [AlertDialogVariantProps, Omit<T, keyof AlertDialogVariantProps>];
}
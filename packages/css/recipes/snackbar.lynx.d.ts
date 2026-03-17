declare interface SnackbarVariant {
  /**
  * @default "default"
  */
  variant: "default" | "positive" | "critical";
}

declare type SnackbarVariantMap = {
  [key in keyof SnackbarVariant]: Array<SnackbarVariant[key]>;
};

export declare type SnackbarVariantProps = Partial<SnackbarVariant>;

export declare type SnackbarSlotName = "root" | "message" | "prefixIcon" | "actionButton" | "content";

export declare const snackbarVariantMap: SnackbarVariantMap;

export declare const snackbar: ((
  props?: SnackbarVariantProps,
) => Record<SnackbarSlotName, string>) & {
  splitVariantProps: <T extends SnackbarVariantProps>(
    props: T,
  ) => [SnackbarVariantProps, Omit<T, keyof SnackbarVariantProps>];
}
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

export declare type AlertDialogSlotName = "positioner" | "backdrop" | "content" | "scrollArea" | "scrollContent" | "header" | "footer" | "action" | "title" | "description";

export declare const alertDialogVariantMap: AlertDialogVariantMap;

export declare const alertDialog: ((
  props?: AlertDialogVariantProps,
) => Record<AlertDialogSlotName, string>) & {
  splitVariantProps: <T extends AlertDialogVariantProps>(
    props: T,
  ) => [AlertDialogVariantProps, Omit<T, keyof AlertDialogVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const alertDialogSeedTagSpec: {
  readonly name: "AlertDialog";
  readonly axes: readonly [];
  readonly defaults: {};
};

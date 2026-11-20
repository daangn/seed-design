declare interface DialogVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
/**
  * @default "medium"
  */
  size: "medium" | "large";
}

declare type DialogVariantMap = {
  [key in keyof DialogVariant]: Array<DialogVariant[key]>;
};

export declare type DialogVariantProps = Partial<DialogVariant>;

export declare type DialogSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "action" | "title" | "description";

export declare const dialogVariantMap: DialogVariantMap;

export declare const dialog: ((
  props?: DialogVariantProps,
) => Record<DialogSlotName, string>) & {
  splitVariantProps: <T extends DialogVariantProps>(
    props: T,
  ) => [DialogVariantProps, Omit<T, keyof DialogVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const dialogSeedTagSpec: {
  readonly name: "Dialog";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "medium" };
};

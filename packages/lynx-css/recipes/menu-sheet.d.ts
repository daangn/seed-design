declare interface MenuSheetVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
/**
  * @default false
  */
  closeButtonPressed: boolean;
}

declare type MenuSheetVariantMap = {
  [key in keyof MenuSheetVariant]: Array<MenuSheetVariant[key]>;
};

export declare type MenuSheetVariantProps = Partial<MenuSheetVariant>;

export declare type MenuSheetSlotName = "positioner" | "backdrop" | "content" | "contentInner" | "header" | "title" | "description" | "list" | "listContent" | "group" | "footer" | "closeButton" | "closeButtonLabel";

export declare const menuSheetVariantMap: MenuSheetVariantMap;

export declare const menuSheet: ((
  props?: MenuSheetVariantProps,
) => Record<MenuSheetSlotName, string>) & {
  splitVariantProps: <T extends MenuSheetVariantProps>(
    props: T,
  ) => [MenuSheetVariantProps, Omit<T, keyof MenuSheetVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const menuSheetSeedTagSpec: {
  readonly name: "MenuSheet";
  readonly axes: readonly [];
  readonly defaults: {};
};

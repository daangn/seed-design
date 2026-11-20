declare interface MenuSheetItemVariant {
  /**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
/**
  * @default "left"
  */
  labelAlign: "left" | "center";
/**
  * @default false
  */
  pressed: boolean;
}

declare type MenuSheetItemVariantMap = {
  [key in keyof MenuSheetItemVariant]: Array<MenuSheetItemVariant[key]>;
};

export declare type MenuSheetItemVariantProps = Partial<MenuSheetItemVariant>;

export declare type MenuSheetItemSlotName = "root" | "scaleContent" | "content" | "label" | "description" | "prefixIcon" | "divider";

export declare const menuSheetItemVariantMap: MenuSheetItemVariantMap;

export declare const menuSheetItem: ((
  props?: MenuSheetItemVariantProps,
) => Record<MenuSheetItemSlotName, string>) & {
  splitVariantProps: <T extends MenuSheetItemVariantProps>(
    props: T,
  ) => [MenuSheetItemVariantProps, Omit<T, keyof MenuSheetItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const menuSheetItemSeedTagSpec: {
  readonly name: "MenuSheetItem";
  readonly axes: readonly ["tone", "labelAlign"];
  readonly defaults: { readonly tone: "neutral"; readonly labelAlign: "left" };
};

declare interface MenuItemVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
/**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type MenuItemVariantMap = {
  [key in keyof MenuItemVariant]: Array<MenuItemVariant[key]>;
};

export declare type MenuItemVariantProps = Partial<MenuItemVariant>;

export declare type MenuItemSlotName = "root" | "scaleContent" | "pressedOverlay" | "body" | "label" | "description" | "prefixIcon" | "suffixIcon";

export declare const menuItemVariantMap: MenuItemVariantMap;

export declare const menuItem: ((
  props?: MenuItemVariantProps,
) => Record<MenuItemSlotName, string>) & {
  splitVariantProps: <T extends MenuItemVariantProps>(
    props: T,
  ) => [MenuItemVariantProps, Omit<T, keyof MenuItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const menuItemSeedTagSpec: {
  readonly name: "MenuItem";
  readonly axes: readonly ["size", "tone"];
  readonly defaults: { readonly size: "medium"; readonly tone: "neutral" };
};

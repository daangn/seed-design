declare interface MenuVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
/**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  positioned: boolean;
}

declare type MenuVariantMap = {
  [key in keyof MenuVariant]: Array<MenuVariant[key]>;
};

export declare type MenuVariantProps = Partial<MenuVariant>;

export declare type MenuSlotName = "positioner" | "content" | "scrollArea" | "scrollContent" | "group" | "groupLabel" | "separator";

export declare const menuVariantMap: MenuVariantMap;

export declare const menu: ((
  props?: MenuVariantProps,
) => Record<MenuSlotName, string>) & {
  splitVariantProps: <T extends MenuVariantProps>(
    props: T,
  ) => [MenuVariantProps, Omit<T, keyof MenuVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const menuSeedTagSpec: {
  readonly name: "Menu";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "medium" };
};

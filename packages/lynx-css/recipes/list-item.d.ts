declare interface ListItemVariant {
  /**
  * @default false
  */
  interactive: boolean;
/**
  * @default false
  */
  highlighted: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type ListItemVariantMap = {
  [key in keyof ListItemVariant]: Array<ListItemVariant[key]>;
};

export declare type ListItemVariantProps = Partial<ListItemVariant>;

export declare type ListItemSlotName = "root" | "highlightedOverlay" | "pressedOverlay" | "layout" | "content" | "title" | "detail" | "prefix" | "suffix" | "prefixIcon" | "suffixIcon";

export declare const listItemVariantMap: ListItemVariantMap;

export declare const listItem: ((
  props?: ListItemVariantProps,
) => Record<ListItemSlotName, string>) & {
  splitVariantProps: <T extends ListItemVariantProps>(
    props: T,
  ) => [ListItemVariantProps, Omit<T, keyof ListItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const listItemSeedTagSpec: {
  readonly name: "ListItem";
  readonly axes: readonly [];
  readonly defaults: {};
};

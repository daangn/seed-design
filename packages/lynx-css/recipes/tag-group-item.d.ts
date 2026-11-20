declare interface TagGroupItemVariant {
  /**
  * @default "t2"
  */
  size: "t2" | "t3" | "t4";
/**
  * @default "regular"
  */
  weight: "regular" | "bold";
/**
  * @default "neutralSubtle"
  */
  tone: "neutralSubtle" | "neutral" | "brand";
}

declare type TagGroupItemVariantMap = {
  [key in keyof TagGroupItemVariant]: Array<TagGroupItemVariant[key]>;
};

export declare type TagGroupItemVariantProps = Partial<TagGroupItemVariant>;

export declare type TagGroupItemSlotName = "root" | "label";

export declare const tagGroupItemVariantMap: TagGroupItemVariantMap;

export declare const tagGroupItem: ((
  props?: TagGroupItemVariantProps,
) => Record<TagGroupItemSlotName, string>) & {
  splitVariantProps: <T extends TagGroupItemVariantProps>(
    props: T,
  ) => [TagGroupItemVariantProps, Omit<T, keyof TagGroupItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const tagGroupItemSeedTagSpec: {
  readonly name: "TagGroupItem";
  readonly axes: readonly ["size", "weight", "tone"];
  readonly defaults: { readonly size: "t2"; readonly weight: "regular"; readonly tone: "neutralSubtle" };
};

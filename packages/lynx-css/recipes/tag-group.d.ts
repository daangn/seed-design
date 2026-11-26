declare interface TagGroupVariant {
  /**
  * @default "t2"
  */
  size: "t2" | "t3" | "t4";
}

declare type TagGroupVariantMap = {
  [key in keyof TagGroupVariant]: Array<TagGroupVariant[key]>;
};

export declare type TagGroupVariantProps = Partial<TagGroupVariant>;

export declare type TagGroupSlotName = "root" | "separatorWrapper" | "separator";

export declare const tagGroupVariantMap: TagGroupVariantMap;

export declare const tagGroup: ((
  props?: TagGroupVariantProps,
) => Record<TagGroupSlotName, string>) & {
  splitVariantProps: <T extends TagGroupVariantProps>(
    props: T,
  ) => [TagGroupVariantProps, Omit<T, keyof TagGroupVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const tagGroupSeedTagSpec: {
  readonly name: "TagGroup";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "t2" };
};

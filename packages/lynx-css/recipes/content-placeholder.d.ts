declare interface ContentPlaceholderVariant {
  
}

declare type ContentPlaceholderVariantMap = {
  [key in keyof ContentPlaceholderVariant]: Array<ContentPlaceholderVariant[key]>;
};

export declare type ContentPlaceholderVariantProps = Partial<ContentPlaceholderVariant>;

export declare type ContentPlaceholderSlotName = "root" | "asset" | "presetLight" | "presetDark";

export declare const contentPlaceholderVariantMap: ContentPlaceholderVariantMap;

export declare const contentPlaceholder: ((
  props?: ContentPlaceholderVariantProps,
) => Record<ContentPlaceholderSlotName, string>) & {
  splitVariantProps: <T extends ContentPlaceholderVariantProps>(
    props: T,
  ) => [ContentPlaceholderVariantProps, Omit<T, keyof ContentPlaceholderVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const contentPlaceholderSeedTagSpec: {
  readonly name: "ContentPlaceholder";
  readonly axes: readonly ["type"];
  readonly defaults: {};
};

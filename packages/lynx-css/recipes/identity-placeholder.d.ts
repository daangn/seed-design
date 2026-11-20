declare interface IdentityPlaceholderVariant {
  /**
  * @default "person"
  */
  identity: "person" | "business";
}

declare type IdentityPlaceholderVariantMap = {
  [key in keyof IdentityPlaceholderVariant]: Array<IdentityPlaceholderVariant[key]>;
};

export declare type IdentityPlaceholderVariantProps = Partial<IdentityPlaceholderVariant>;

export declare type IdentityPlaceholderSlotName = "root" | "image";

export declare const identityPlaceholderVariantMap: IdentityPlaceholderVariantMap;

export declare const identityPlaceholder: ((
  props?: IdentityPlaceholderVariantProps,
) => Record<IdentityPlaceholderSlotName, string>) & {
  splitVariantProps: <T extends IdentityPlaceholderVariantProps>(
    props: T,
  ) => [IdentityPlaceholderVariantProps, Omit<T, keyof IdentityPlaceholderVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const identityPlaceholderSeedTagSpec: {
  readonly name: "IdentityPlaceholder";
  readonly axes: readonly [];
  readonly defaults: {};
};

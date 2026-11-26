declare interface AvatarStackVariant {
  /**
  * @default 48
  */
  size: "20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108";
}

declare type AvatarStackVariantMap = {
  [key in keyof AvatarStackVariant]: Array<AvatarStackVariant[key]>;
};

export declare type AvatarStackVariantProps = Partial<AvatarStackVariant>;

export declare type AvatarStackSlotName = "root" | "item" | "overlap";

export declare const avatarStackVariantMap: AvatarStackVariantMap;

export declare const avatarStack: ((
  props?: AvatarStackVariantProps,
) => Record<AvatarStackSlotName, string>) & {
  splitVariantProps: <T extends AvatarStackVariantProps>(
    props: T,
  ) => [AvatarStackVariantProps, Omit<T, keyof AvatarStackVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const avatarStackSeedTagSpec: {
  readonly name: "AvatarStack";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: 48 };
};

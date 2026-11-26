declare interface AvatarVariant {
  /**
  * @default "none"
  */
  badgeMask: "none" | "circle" | "flower" | "shield";
/**
  * @default 48
  */
  size: "20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108";
}

declare type AvatarVariantMap = {
  [key in keyof AvatarVariant]: Array<AvatarVariant[key]>;
};

export declare type AvatarVariantProps = Partial<AvatarVariant>;

export declare type AvatarSlotName = "root" | "imageContainer" | "pendingImageContainer" | "image" | "pendingImage" | "fallback" | "badge" | "stroke";

export declare const avatarVariantMap: AvatarVariantMap;

export declare const avatar: ((
  props?: AvatarVariantProps,
) => Record<AvatarSlotName, string>) & {
  splitVariantProps: <T extends AvatarVariantProps>(
    props: T,
  ) => [AvatarVariantProps, Omit<T, keyof AvatarVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const avatarSeedTagSpec: {
  readonly name: "Avatar";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: 48 };
};

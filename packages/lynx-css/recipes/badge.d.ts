declare interface BadgeVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default "solid"
  */
  variant: "weak" | "solid" | "outline";
/**
  * @default "neutral"
  */
  tone: "neutral" | "brand" | "informative" | "positive" | "warning" | "critical";
}

declare type BadgeVariantMap = {
  [key in keyof BadgeVariant]: Array<BadgeVariant[key]>;
};

export declare type BadgeVariantProps = Partial<BadgeVariant>;

export declare type BadgeSlotName = "root" | "prefix" | "label" | "action";

export declare const badgeVariantMap: BadgeVariantMap;

export declare const badge: ((
  props?: BadgeVariantProps,
) => Record<BadgeSlotName, string>) & {
  splitVariantProps: <T extends BadgeVariantProps>(
    props: T,
  ) => [BadgeVariantProps, Omit<T, keyof BadgeVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const badgeSeedTagSpec: {
  readonly name: "Badge";
  readonly axes: readonly ["size", "variant", "tone"];
  readonly defaults: { readonly size: "medium"; readonly variant: "solid"; readonly tone: "neutral" };
};

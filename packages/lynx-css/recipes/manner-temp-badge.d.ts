declare interface MannerTempBadgeVariant {
  /**
  * @default "l1"
  */
  level: "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9" | "l10";
}

declare type MannerTempBadgeVariantMap = {
  [key in keyof MannerTempBadgeVariant]: Array<MannerTempBadgeVariant[key]>;
};

export declare type MannerTempBadgeVariantProps = Partial<MannerTempBadgeVariant>;

export declare type MannerTempBadgeSlotName = "root" | "label";

export declare const mannerTempBadgeVariantMap: MannerTempBadgeVariantMap;

export declare const mannerTempBadge: ((
  props?: MannerTempBadgeVariantProps,
) => Record<MannerTempBadgeSlotName, string>) & {
  splitVariantProps: <T extends MannerTempBadgeVariantProps>(
    props: T,
  ) => [MannerTempBadgeVariantProps, Omit<T, keyof MannerTempBadgeVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const mannerTempBadgeSeedTagSpec: {
  readonly name: "MannerTempBadge";
  readonly axes: readonly ["level"];
  readonly defaults: { readonly level: "l1" };
};

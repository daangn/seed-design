declare interface MannerTempVariant {
  /**
  * @default "l1"
  */
  level: "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9" | "l10";
}

declare type MannerTempVariantMap = {
  [key in keyof MannerTempVariant]: Array<MannerTempVariant[key]>;
};

export declare type MannerTempVariantProps = Partial<MannerTempVariant>;

export declare type MannerTempSlotName = "root" | "label" | "emote";

export declare const mannerTempVariantMap: MannerTempVariantMap;

export declare const mannerTemp: ((
  props?: MannerTempVariantProps,
) => Record<MannerTempSlotName, string>) & {
  splitVariantProps: <T extends MannerTempVariantProps>(
    props: T,
  ) => [MannerTempVariantProps, Omit<T, keyof MannerTempVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const mannerTempSeedTagSpec: {
  readonly name: "MannerTemp";
  readonly axes: readonly ["level"];
  readonly defaults: { readonly level: "l1" };
};

declare interface SwitchmarkVariant {
  /**
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default "32"
  */
  size: "16" | "24" | "32";
/**
  * @default false
  */
  checked: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type SwitchmarkVariantMap = {
  [key in keyof SwitchmarkVariant]: Array<SwitchmarkVariant[key]>;
};

export declare type SwitchmarkVariantProps = Partial<SwitchmarkVariant>;

export declare type SwitchmarkSlotName = "root" | "thumb";

export declare const switchmarkVariantMap: SwitchmarkVariantMap;

export declare const switchmark: ((
  props?: SwitchmarkVariantProps,
) => Record<SwitchmarkSlotName, string>) & {
  splitVariantProps: <T extends SwitchmarkVariantProps>(
    props: T,
  ) => [SwitchmarkVariantProps, Omit<T, keyof SwitchmarkVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const switchmarkSeedTagSpec: {
  readonly name: "Switchmark";
  readonly axes: readonly ["tone", "size"];
  readonly defaults: { readonly tone: "brand"; readonly size: "32" };
};

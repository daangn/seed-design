declare interface SwitchVariant {
  /**
  * @default 32
  */
  size: "16" | "24" | "32";
/**
  * @default false
  */
  disabled: boolean;
}

declare type SwitchVariantMap = {
  [key in keyof SwitchVariant]: Array<SwitchVariant[key]>;
};

export declare type SwitchVariantProps = Partial<SwitchVariant>;

export declare type SwitchSlotName = "root" | "label";

export declare const switchVariantMap: SwitchVariantMap;

export declare const switchStyle: ((
  props?: SwitchVariantProps,
) => Record<SwitchSlotName, string>) & {
  splitVariantProps: <T extends SwitchVariantProps>(
    props: T,
  ) => [SwitchVariantProps, Omit<T, keyof SwitchVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const switchSeedTagSpec: {
  readonly name: "Switch";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: 32 };
};

declare interface RadiomarkVariant {
  /**
  * @default "brand"
  */
  tone: "brand" | "neutral";
/**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default false
  */
  checked: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type RadiomarkVariantMap = {
  [key in keyof RadiomarkVariant]: Array<RadiomarkVariant[key]>;
};

export declare type RadiomarkVariantProps = Partial<RadiomarkVariant>;

export declare type RadiomarkSlotName = "root" | "icon";

export declare const radiomarkVariantMap: RadiomarkVariantMap;

export declare const radiomark: ((
  props?: RadiomarkVariantProps,
) => Record<RadiomarkSlotName, string>) & {
  splitVariantProps: <T extends RadiomarkVariantProps>(
    props: T,
  ) => [RadiomarkVariantProps, Omit<T, keyof RadiomarkVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const radiomarkSeedTagSpec: {
  readonly name: "Radiomark";
  readonly axes: readonly ["tone", "size"];
  readonly defaults: { readonly tone: "brand"; readonly size: "medium" };
};

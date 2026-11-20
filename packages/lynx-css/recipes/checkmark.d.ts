declare interface CheckmarkVariant {
  /**
  * @default "square"
  */
  variant: "square" | "ghost";
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
  indeterminate: boolean;
}

declare type CheckmarkVariantMap = {
  [key in keyof CheckmarkVariant]: Array<CheckmarkVariant[key]>;
};

export declare type CheckmarkVariantProps = Partial<CheckmarkVariant>;

export declare type CheckmarkSlotName = "root" | "background" | "selectedBackground" | "icon";

export declare const checkmarkVariantMap: CheckmarkVariantMap;

export declare const checkmark: ((
  props?: CheckmarkVariantProps,
) => Record<CheckmarkSlotName, string>) & {
  splitVariantProps: <T extends CheckmarkVariantProps>(
    props: T,
  ) => [CheckmarkVariantProps, Omit<T, keyof CheckmarkVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const checkmarkSeedTagSpec: {
  readonly name: "Checkmark";
  readonly axes: readonly ["variant", "tone", "size"];
  readonly defaults: { readonly variant: "square"; readonly tone: "brand"; readonly size: "medium" };
};

declare interface SelectItemVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type SelectItemVariantMap = {
  [key in keyof SelectItemVariant]: Array<SelectItemVariant[key]>;
};

export declare type SelectItemVariantProps = Partial<SelectItemVariant>;

export declare type SelectItemSlotName = "root" | "scaleContent" | "pressedOverlay" | "body" | "label" | "description" | "prefixIcon" | "indicator";

export declare const selectItemVariantMap: SelectItemVariantMap;

export declare const selectItem: ((
  props?: SelectItemVariantProps,
) => Record<SelectItemSlotName, string>) & {
  splitVariantProps: <T extends SelectItemVariantProps>(
    props: T,
  ) => [SelectItemVariantProps, Omit<T, keyof SelectItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const selectItemSeedTagSpec: {
  readonly name: "SelectItem";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "large" };
};

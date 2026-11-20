declare interface SelectBoxCheckmarkVariant {
  /**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type SelectBoxCheckmarkVariantMap = {
  [key in keyof SelectBoxCheckmarkVariant]: Array<SelectBoxCheckmarkVariant[key]>;
};

export declare type SelectBoxCheckmarkVariantProps = Partial<SelectBoxCheckmarkVariant>;

export declare type SelectBoxCheckmarkSlotName = "root" | "icon";

export declare const selectBoxCheckmarkVariantMap: SelectBoxCheckmarkVariantMap;

export declare const selectBoxCheckmark: ((
  props?: SelectBoxCheckmarkVariantProps,
) => Record<SelectBoxCheckmarkSlotName, string>) & {
  splitVariantProps: <T extends SelectBoxCheckmarkVariantProps>(
    props: T,
  ) => [SelectBoxCheckmarkVariantProps, Omit<T, keyof SelectBoxCheckmarkVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const selectBoxCheckmarkSeedTagSpec: {
  readonly name: "SelectBoxCheckmark";
  readonly axes: readonly [];
  readonly defaults: {};
};

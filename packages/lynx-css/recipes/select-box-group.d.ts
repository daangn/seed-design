declare interface SelectBoxGroupVariant {
  /**
  * @default false
  */
  multiColumn: boolean;
}

declare type SelectBoxGroupVariantMap = {
  [key in keyof SelectBoxGroupVariant]: Array<SelectBoxGroupVariant[key]>;
};

export declare type SelectBoxGroupVariantProps = Partial<SelectBoxGroupVariant>;

export declare const selectBoxGroupVariantMap: SelectBoxGroupVariantMap;

export declare const selectBoxGroup: ((
  props?: SelectBoxGroupVariantProps,
) => string) & {
  splitVariantProps: <T extends SelectBoxGroupVariantProps>(
    props: T,
  ) => [SelectBoxGroupVariantProps, Omit<T, keyof SelectBoxGroupVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const selectBoxGroupSeedTagSpec: {
  readonly name: "SelectBoxGroup";
  readonly axes: readonly [];
  readonly defaults: {};
};

declare interface FieldLabelVariant {
  /**
  * @default "medium"
  */
  weight: "medium" | "bold";
}

declare type FieldLabelVariantMap = {
  [key in keyof FieldLabelVariant]: Array<FieldLabelVariant[key]>;
};

export declare type FieldLabelVariantProps = Partial<FieldLabelVariant>;

export declare type FieldLabelSlotName = "root" | "indicatorText" | "indicatorIcon";

export declare const fieldLabelVariantMap: FieldLabelVariantMap;

export declare const fieldLabel: ((
  props?: FieldLabelVariantProps,
) => Record<FieldLabelSlotName, string>) & {
  splitVariantProps: <T extends FieldLabelVariantProps>(
    props: T,
  ) => [FieldLabelVariantProps, Omit<T, keyof FieldLabelVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const fieldLabelSeedTagSpec: {
  readonly name: "FieldLabel";
  readonly axes: readonly ["weight"];
  readonly defaults: { readonly weight: "medium" };
};

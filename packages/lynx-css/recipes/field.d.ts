declare interface FieldVariant {
  /**
  * @default false
  */
  empty: boolean;
/**
  * @default false
  */
  invalid: boolean;
}

declare type FieldVariantMap = {
  [key in keyof FieldVariant]: Array<FieldVariant[key]>;
};

export declare type FieldVariantProps = Partial<FieldVariant>;

export declare type FieldSlotName = "root" | "header" | "footer" | "description" | "errorMessage" | "characterCountArea" | "characterCount" | "maxCharacterCount";

export declare const fieldVariantMap: FieldVariantMap;

export declare const field: ((
  props?: FieldVariantProps,
) => Record<FieldSlotName, string>) & {
  splitVariantProps: <T extends FieldVariantProps>(
    props: T,
  ) => [FieldVariantProps, Omit<T, keyof FieldVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const fieldSeedTagSpec: {
  readonly name: "Field";
  readonly axes: readonly [];
  readonly defaults: {};
};

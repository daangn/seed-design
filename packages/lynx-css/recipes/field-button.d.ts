declare interface FieldButtonVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  readOnly: boolean;
}

declare type FieldButtonVariantMap = {
  [key in keyof FieldButtonVariant]: Array<FieldButtonVariant[key]>;
};

export declare type FieldButtonVariantProps = Partial<FieldButtonVariant>;

export declare type FieldButtonSlotName = "root" | "button" | "content" | "baseStroke" | "stroke" | "value" | "placeholder" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon" | "clearButton";

export declare const fieldButtonVariantMap: FieldButtonVariantMap;

export declare const fieldButton: ((
  props?: FieldButtonVariantProps,
) => Record<FieldButtonSlotName, string>) & {
  splitVariantProps: <T extends FieldButtonVariantProps>(
    props: T,
  ) => [FieldButtonVariantProps, Omit<T, keyof FieldButtonVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const fieldButtonSeedTagSpec: {
  readonly name: "InputButton";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "large" };
};

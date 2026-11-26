declare interface SelectTriggerVariant {
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
  readOnly: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type SelectTriggerVariantMap = {
  [key in keyof SelectTriggerVariant]: Array<SelectTriggerVariant[key]>;
};

export declare type SelectTriggerVariantProps = Partial<SelectTriggerVariant>;

export declare type SelectTriggerSlotName = "root" | "scaleContent" | "pressedOverlay" | "value" | "placeholder" | "prefixIcon" | "suffixIcon";

export declare const selectTriggerVariantMap: SelectTriggerVariantMap;

export declare const selectTrigger: ((
  props?: SelectTriggerVariantProps,
) => Record<SelectTriggerSlotName, string>) & {
  splitVariantProps: <T extends SelectTriggerVariantProps>(
    props: T,
  ) => [SelectTriggerVariantProps, Omit<T, keyof SelectTriggerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const selectTriggerSeedTagSpec: {
  readonly name: "SelectTrigger";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "large" };
};

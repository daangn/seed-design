declare interface SelectBoxVariant {
  /**
  * @default "horizontal"
  */
  layout: "horizontal" | "vertical";
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
/**
  * @default false
  */
  footerOpen: boolean;
}

declare type SelectBoxVariantMap = {
  [key in keyof SelectBoxVariant]: Array<SelectBoxVariant[key]>;
};

export declare type SelectBoxVariantProps = Partial<SelectBoxVariant>;

export declare type SelectBoxSlotName = "interactionRoot" | "root" | "scaleContent" | "selectedStroke" | "trigger" | "content" | "prefixIcon" | "body" | "label" | "description" | "footer" | "footerInner";

export declare const selectBoxVariantMap: SelectBoxVariantMap;

export declare const selectBox: ((
  props?: SelectBoxVariantProps,
) => Record<SelectBoxSlotName, string>) & {
  splitVariantProps: <T extends SelectBoxVariantProps>(
    props: T,
  ) => [SelectBoxVariantProps, Omit<T, keyof SelectBoxVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const selectBoxSeedTagSpec: {
  readonly name: "SelectBox";
  readonly axes: readonly ["layout"];
  readonly defaults: { readonly layout: "horizontal" };
};

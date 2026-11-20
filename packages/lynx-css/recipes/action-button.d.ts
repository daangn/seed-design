declare interface ActionButtonVariant {
  /**
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost";
/**
  * @default "medium"
  */
  size: "xsmall" | "small" | "medium" | "large";
/**
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
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
  loading: boolean;
}

declare type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export declare type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export declare type ActionButtonSlotName = "root" | "content" | "text" | "prefixIcon" | "suffixIcon" | "icon" | "loadingIndicator";

export declare const actionButtonVariantMap: ActionButtonVariantMap;

export declare const actionButton: ((
  props?: ActionButtonVariantProps,
) => Record<ActionButtonSlotName, string>) & {
  splitVariantProps: <T extends ActionButtonVariantProps>(
    props: T,
  ) => [ActionButtonVariantProps, Omit<T, keyof ActionButtonVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const actionButtonSeedTagSpec: {
  readonly name: "ActionButton";
  readonly axes: readonly ["variant", "size", "layout"];
  readonly defaults: { readonly variant: "brandSolid"; readonly size: "medium"; readonly layout: "withText" };
};

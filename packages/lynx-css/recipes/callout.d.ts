declare interface CalloutVariant {
  /**
  * @default "neutral"
  */
  tone: "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  interactive: boolean;
}

declare type CalloutVariantMap = {
  [key in keyof CalloutVariant]: Array<CalloutVariant[key]>;
};

export declare type CalloutVariantProps = Partial<CalloutVariant>;

export declare type CalloutSlotName = "root" | "content" | "title" | "description" | "link" | "closeButton" | "prefixIcon" | "suffixIcon";

export declare const calloutVariantMap: CalloutVariantMap;

export declare const callout: ((
  props?: CalloutVariantProps,
) => Record<CalloutSlotName, string>) & {
  splitVariantProps: <T extends CalloutVariantProps>(
    props: T,
  ) => [CalloutVariantProps, Omit<T, keyof CalloutVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const calloutSeedTagSpec: {
  readonly name: "Callout";
  readonly axes: readonly ["tone"];
  readonly defaults: { readonly tone: "neutral" };
};

declare interface ReactionButtonVariant {
  /**
  * @default "small"
  */
  size: "xsmall" | "small";
/**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  loading: boolean;
}

declare type ReactionButtonVariantMap = {
  [key in keyof ReactionButtonVariant]: Array<ReactionButtonVariant[key]>;
};

export declare type ReactionButtonVariantProps = Partial<ReactionButtonVariant>;

export declare type ReactionButtonSlotName = "root" | "content" | "label" | "count" | "prefixIcon" | "loadingIndicator";

export declare const reactionButtonVariantMap: ReactionButtonVariantMap;

export declare const reactionButton: ((
  props?: ReactionButtonVariantProps,
) => Record<ReactionButtonSlotName, string>) & {
  splitVariantProps: <T extends ReactionButtonVariantProps>(
    props: T,
  ) => [ReactionButtonVariantProps, Omit<T, keyof ReactionButtonVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const reactionButtonSeedTagSpec: {
  readonly name: "ReactionButton";
  readonly axes: readonly ["size"];
  readonly defaults: { readonly size: "small" };
};

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
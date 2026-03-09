declare interface ReactionButtonVariant {
  /**
  * @default "small"
  */
  size: "xsmall" | "small";
  disabled?: true;
  loading?: true;}

declare type ReactionButtonVariantMap = {
  [key in keyof ReactionButtonVariant]: Array<ReactionButtonVariant[key]>;
};

export declare type ReactionButtonVariantProps = Partial<ReactionButtonVariant>;

export declare type ReactionButtonSlotName = "root" | "text";

export declare const reactionButtonVariantMap: ReactionButtonVariantMap;

export declare const reactionButton: ((
  props?: ReactionButtonVariantProps,
) => Record<ReactionButtonSlotName, string>) & {
  splitVariantProps: <T extends ReactionButtonVariantProps>(
    props: T,
  ) => [ReactionButtonVariantProps, Omit<T, keyof ReactionButtonVariantProps>];
}
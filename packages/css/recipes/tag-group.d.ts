declare interface TagGroupVariant {
  /**
  * @default "t2"
  */
  size: "t2" | "t3" | "t4";
/**
  * @default false
  */
  truncate: boolean;
}

declare type TagGroupVariantMap = {
  [key in keyof TagGroupVariant]: Array<TagGroupVariant[key]>;
};

export declare type TagGroupVariantProps = Partial<TagGroupVariant>;

export declare type TagGroupSlotName = "root" | "separator";

export declare const tagGroupVariantMap: TagGroupVariantMap;

export declare const tagGroup: ((
  props?: TagGroupVariantProps,
) => Record<TagGroupSlotName, string>) & {
  splitVariantProps: <T extends TagGroupVariantProps>(
    props: T,
  ) => [TagGroupVariantProps, Omit<T, keyof TagGroupVariantProps>];
}
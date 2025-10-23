declare interface TagGroupItemVariant {
  /**
  * @default "t2"
  */
  size: "t2" | "t3" | "t4";
/**
  * @default "regular"
  */
  weight: "regular" | "bold";
/**
  * @default "neutralSubtle"
  */
  tone: "neutralSubtle" | "neutral" | "brand";
}

declare type TagGroupItemVariantMap = {
  [key in keyof TagGroupItemVariant]: Array<TagGroupItemVariant[key]>;
};

export declare type TagGroupItemVariantProps = Partial<TagGroupItemVariant>;

export declare const tagGroupItemVariantMap: TagGroupItemVariantMap;

export declare const tagGroupItem: ((
  props?: TagGroupItemVariantProps,
) => string) & {
  splitVariantProps: <T extends TagGroupItemVariantProps>(
    props: T,
  ) => [TagGroupItemVariantProps, Omit<T, keyof TagGroupItemVariantProps>];
}
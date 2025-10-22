declare interface TagGroupTagVariant {
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

declare type TagGroupTagVariantMap = {
  [key in keyof TagGroupTagVariant]: Array<TagGroupTagVariant[key]>;
};

export declare type TagGroupTagVariantProps = Partial<TagGroupTagVariant>;

export declare const tagGroupTagVariantMap: TagGroupTagVariantMap;

export declare const tagGroupTag: ((
  props?: TagGroupTagVariantProps,
) => string) & {
  splitVariantProps: <T extends TagGroupTagVariantProps>(
    props: T,
  ) => [TagGroupTagVariantProps, Omit<T, keyof TagGroupTagVariantProps>];
}
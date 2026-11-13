declare interface NextListItemVariant {
  /**
  * @default false
  */
  highlighted: boolean;
}

declare type NextListItemVariantMap = {
  [key in keyof NextListItemVariant]: Array<NextListItemVariant[key]>;
};

export declare type NextListItemVariantProps = Partial<NextListItemVariant>;

export declare type NextListItemSlotName = "root" | "layout" | "content" | "title" | "detail" | "prefix" | "suffix";

export declare const nextListItemVariantMap: NextListItemVariantMap;

export declare const nextListItem: ((
  props?: NextListItemVariantProps,
) => Record<NextListItemSlotName, string>) & {
  splitVariantProps: <T extends NextListItemVariantProps>(
    props: T,
  ) => [NextListItemVariantProps, Omit<T, keyof NextListItemVariantProps>];
}
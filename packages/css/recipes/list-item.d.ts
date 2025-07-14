declare interface ListItemVariant {
  /**
  * @default false
  */
  highlighted: boolean;
}

declare type ListItemVariantMap = {
  [key in keyof ListItemVariant]: Array<ListItemVariant[key]>;
};

export declare type ListItemVariantProps = Partial<ListItemVariant>;

export declare type ListItemSlotName = "root" | "content" | "title" | "detail" | "prefix" | "suffix";

export declare const listItemVariantMap: ListItemVariantMap;

export declare const listItem: ((
  props?: ListItemVariantProps,
) => Record<ListItemSlotName, string>) & {
  splitVariantProps: <T extends ListItemVariantProps>(
    props: T,
  ) => [ListItemVariantProps, Omit<T, keyof ListItemVariantProps>];
}
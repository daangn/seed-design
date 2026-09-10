declare interface ListItemVariant {
  /**
  * @default false
  */
  highlighted: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type ListItemVariantMap = {
  [key in keyof ListItemVariant]: Array<ListItemVariant[key]>;
};

export declare type ListItemVariantProps = Partial<ListItemVariant>;

export declare type ListItemSlotName = "interactionRoot" | "root" | "highlightedOverlay" | "pressedOverlay" | "layout" | "content" | "title" | "detail" | "prefix" | "suffix" | "prefixIcon" | "suffixIcon";

export declare const listItemVariantMap: ListItemVariantMap;

export declare const listItem: ((
  props?: ListItemVariantProps,
) => Record<ListItemSlotName, string>) & {
  splitVariantProps: <T extends ListItemVariantProps>(
    props: T,
  ) => [ListItemVariantProps, Omit<T, keyof ListItemVariantProps>];
}
declare interface DrawerVariant {
  /**
  * @default "medium"
  */
  size: "small" | "medium" | "large";
}

declare type DrawerVariantMap = {
  [key in keyof DrawerVariant]: Array<DrawerVariant[key]>;
};

export declare type DrawerVariantProps = Partial<DrawerVariant>;

export declare type DrawerSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const drawerVariantMap: DrawerVariantMap;

export declare const drawer: ((
  props?: DrawerVariantProps,
) => Record<DrawerSlotName, string>) & {
  splitVariantProps: <T extends DrawerVariantProps>(
    props: T,
  ) => [DrawerVariantProps, Omit<T, keyof DrawerVariantProps>];
}
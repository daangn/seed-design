declare interface SideNavigationVariant {
  /**
  * @default "neutral"
  */
  variant: "neutral" | "transparent";
}

declare type SideNavigationVariantMap = {
  [key in keyof SideNavigationVariant]: Array<SideNavigationVariant[key]>;
};

export declare type SideNavigationVariantProps = Partial<SideNavigationVariant>;

export declare type SideNavigationSlotName = "root" | "header" | "content" | "footer" | "group" | "groupLabel" | "trigger";

export declare const sideNavigationVariantMap: SideNavigationVariantMap;

export declare const sideNavigation: ((
  props?: SideNavigationVariantProps,
) => Record<SideNavigationSlotName, string>) & {
  splitVariantProps: <T extends SideNavigationVariantProps>(
    props: T,
  ) => [SideNavigationVariantProps, Omit<T, keyof SideNavigationVariantProps>];
}
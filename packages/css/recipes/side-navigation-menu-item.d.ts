declare interface SideNavigationMenuItemVariant {
  
}

declare type SideNavigationMenuItemVariantMap = {
  [key in keyof SideNavigationMenuItemVariant]: Array<SideNavigationMenuItemVariant[key]>;
};

export declare type SideNavigationMenuItemVariantProps = Partial<SideNavigationMenuItemVariant>;

export declare type SideNavigationMenuItemSlotName = "root" | "prefixIcon" | "label" | "suffixIcon" | "panel";

export declare const sideNavigationMenuItemVariantMap: SideNavigationMenuItemVariantMap;

export declare const sideNavigationMenuItem: ((
  props?: SideNavigationMenuItemVariantProps,
) => Record<SideNavigationMenuItemSlotName, string>) & {
  splitVariantProps: <T extends SideNavigationMenuItemVariantProps>(
    props: T,
  ) => [SideNavigationMenuItemVariantProps, Omit<T, keyof SideNavigationMenuItemVariantProps>];
}
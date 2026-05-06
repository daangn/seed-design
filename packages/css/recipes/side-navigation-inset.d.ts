declare interface SideNavigationInsetVariant {
  
}

declare type SideNavigationInsetVariantMap = {
  [key in keyof SideNavigationInsetVariant]: Array<SideNavigationInsetVariant[key]>;
};

export declare type SideNavigationInsetVariantProps = Partial<SideNavigationInsetVariant>;

export declare const sideNavigationInsetVariantMap: SideNavigationInsetVariantMap;

export declare const sideNavigationInset: ((
  props?: SideNavigationInsetVariantProps,
) => string) & {
  splitVariantProps: <T extends SideNavigationInsetVariantProps>(
    props: T,
  ) => [SideNavigationInsetVariantProps, Omit<T, keyof SideNavigationInsetVariantProps>];
}
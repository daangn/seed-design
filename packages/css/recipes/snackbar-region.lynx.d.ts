declare interface SnackbarRegionVariant {
  
}

declare type SnackbarRegionVariantMap = {
  [key in keyof SnackbarRegionVariant]: Array<SnackbarRegionVariant[key]>;
};

export declare type SnackbarRegionVariantProps = Partial<SnackbarRegionVariant>;

export declare type SnackbarRegionSlotName = "root" | "text";

export declare const snackbarRegionVariantMap: SnackbarRegionVariantMap;

export declare const snackbarRegion: ((
  props?: SnackbarRegionVariantProps,
) => Record<SnackbarRegionSlotName, string>) & {
  splitVariantProps: <T extends SnackbarRegionVariantProps>(
    props: T,
  ) => [SnackbarRegionVariantProps, Omit<T, keyof SnackbarRegionVariantProps>];
}
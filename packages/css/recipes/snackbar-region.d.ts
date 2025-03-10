declare interface SnackbarRegionVariant {
  
}

declare type SnackbarRegionVariantMap = {
  [key in keyof SnackbarRegionVariant]: Array<SnackbarRegionVariant[key]>;
};

export declare type SnackbarRegionVariantProps = Partial<SnackbarRegionVariant>;

export declare const snackbarRegionVariantMap: SnackbarRegionVariantMap;

export declare const snackbarRegion: ((
  props?: SnackbarRegionVariantProps,
) => string) & {
  splitVariantProps: <T extends SnackbarRegionVariantProps>(
    props: T,
  ) => [SnackbarRegionVariantProps, Omit<T, keyof SnackbarRegionVariantProps>];
}
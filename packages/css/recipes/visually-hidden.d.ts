declare interface VisuallyHiddenVariant {
  
}

declare type VisuallyHiddenVariantMap = {
  [key in keyof VisuallyHiddenVariant]: Array<VisuallyHiddenVariant[key]>;
};

export declare type VisuallyHiddenVariantProps = Partial<VisuallyHiddenVariant>;

export declare const visuallyHiddenVariantMap: VisuallyHiddenVariantMap;

export declare const visuallyHidden: ((
  props?: VisuallyHiddenVariantProps,
) => string) & {
  splitVariantProps: <T extends VisuallyHiddenVariantProps>(
    props: T,
  ) => [VisuallyHiddenVariantProps, Omit<T, keyof VisuallyHiddenVariantProps>];
}
declare interface HeaderToggleButtonVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
}

declare type HeaderToggleButtonVariantMap = {
  [key in keyof HeaderToggleButtonVariant]: Array<HeaderToggleButtonVariant[key]>;
};

export declare type HeaderToggleButtonVariantProps = Partial<HeaderToggleButtonVariant>;

export declare const headerToggleButtonVariantMap: HeaderToggleButtonVariantMap;

export declare const headerToggleButton: ((
  props?: HeaderToggleButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends HeaderToggleButtonVariantProps>(
    props: T,
  ) => [HeaderToggleButtonVariantProps, Omit<T, keyof HeaderToggleButtonVariantProps>];
}
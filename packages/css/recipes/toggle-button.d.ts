declare interface ToggleButtonVariant {
  /**
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralWeak";
/**
  * @default "small"
  */
  size: "xsmall" | "small";
}

declare type ToggleButtonVariantMap = {
  [key in keyof ToggleButtonVariant]: Array<ToggleButtonVariant[key]>;
};

export declare type ToggleButtonVariantProps = Partial<ToggleButtonVariant>;

export declare const toggleButtonVariantMap: ToggleButtonVariantMap;

export declare const toggleButton: ((
  props?: ToggleButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ToggleButtonVariantProps>(
    props: T,
  ) => [ToggleButtonVariantProps, Omit<T, keyof ToggleButtonVariantProps>];
}
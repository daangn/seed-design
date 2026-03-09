declare interface ToggleButtonVariant {
  /**
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralWeak";
/**
  * @default "small"
  */
  size: "xsmall" | "small";
  disabled?: boolean;
  loading?: boolean;}

declare type ToggleButtonVariantMap = {
  [key in keyof ToggleButtonVariant]: Array<ToggleButtonVariant[key]>;
};

export declare type ToggleButtonVariantProps = Partial<ToggleButtonVariant>;

export declare type ToggleButtonSlotName = "root" | "text";

export declare const toggleButtonVariantMap: ToggleButtonVariantMap;

export declare const toggleButton: ((
  props?: ToggleButtonVariantProps,
) => Record<ToggleButtonSlotName, string>) & {
  splitVariantProps: <T extends ToggleButtonVariantProps>(
    props: T,
  ) => [ToggleButtonVariantProps, Omit<T, keyof ToggleButtonVariantProps>];
}
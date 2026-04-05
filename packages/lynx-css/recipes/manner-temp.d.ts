declare interface MannerTempVariant {
  /**
  * @default "l1"
  */
  level: "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9" | "l10";
  disabled?: boolean;
  loading?: boolean;}

declare type MannerTempVariantMap = {
  [key in keyof MannerTempVariant]: Array<MannerTempVariant[key]>;
};

export declare type MannerTempVariantProps = Partial<MannerTempVariant>;

export declare type MannerTempSlotName = "root" | "text";

export declare const mannerTempVariantMap: MannerTempVariantMap;

export declare const mannerTemp: ((
  props?: MannerTempVariantProps,
) => Record<MannerTempSlotName, string>) & {
  splitVariantProps: <T extends MannerTempVariantProps>(
    props: T,
  ) => [MannerTempVariantProps, Omit<T, keyof MannerTempVariantProps>];
}
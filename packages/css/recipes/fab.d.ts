declare interface FabVariant {
  /**
  * @default true
  */
  extended: boolean;
}

declare type FabVariantMap = {
  [key in keyof FabVariant]: Array<FabVariant[key]>;
};

export declare type FabVariantProps = Partial<FabVariant>;

export declare type FabSlotName = "root" | "icon" | "label";

export declare const fabVariantMap: FabVariantMap;

export declare const fab: ((
  props?: FabVariantProps,
) => Record<FabSlotName, string>) & {
  splitVariantProps: <T extends FabVariantProps>(
    props: T,
  ) => [FabVariantProps, Omit<T, keyof FabVariantProps>];
}
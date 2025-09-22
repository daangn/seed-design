declare interface SwitchControlVariant {
  /**
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default 32
  */
  size: "16" | "24" | "32";
}

declare type SwitchControlVariantMap = {
  [key in keyof SwitchControlVariant]: Array<SwitchControlVariant[key]>;
};

export declare type SwitchControlVariantProps = Partial<SwitchControlVariant>;

export declare type SwitchControlSlotName = "root" | "thumb";

export declare const switchControlVariantMap: SwitchControlVariantMap;

export declare const switchControl: ((
  props?: SwitchControlVariantProps,
) => Record<SwitchControlSlotName, string>) & {
  splitVariantProps: <T extends SwitchControlVariantProps>(
    props: T,
  ) => [SwitchControlVariantProps, Omit<T, keyof SwitchControlVariantProps>];
}
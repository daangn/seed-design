declare interface SwitchmarkVariant {
  /**
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default 32
  */
  size: "16" | "24" | "32";
}

declare type SwitchmarkVariantMap = {
  [key in keyof SwitchmarkVariant]: Array<SwitchmarkVariant[key]>;
};

export declare type SwitchmarkVariantProps = Partial<SwitchmarkVariant>;

export declare type SwitchmarkSlotName = "root" | "thumb";

export declare const switchmarkVariantMap: SwitchmarkVariantMap;

export declare const switchmark: ((
  props?: SwitchmarkVariantProps,
) => Record<SwitchmarkSlotName, string>) & {
  splitVariantProps: <T extends SwitchmarkVariantProps>(
    props: T,
  ) => [SwitchmarkVariantProps, Omit<T, keyof SwitchmarkVariantProps>];
}
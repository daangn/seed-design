declare interface SwitchMarkVariant {
  /**
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default 32
  */
  size: "16" | "24" | "32";
}

declare type SwitchMarkVariantMap = {
  [key in keyof SwitchMarkVariant]: Array<SwitchMarkVariant[key]>;
};

export declare type SwitchMarkVariantProps = Partial<SwitchMarkVariant>;

export declare type SwitchMarkSlotName = "root" | "thumb";

export declare const switchMarkVariantMap: SwitchMarkVariantMap;

export declare const switchMark: ((
  props?: SwitchMarkVariantProps,
) => Record<SwitchMarkSlotName, string>) & {
  splitVariantProps: <T extends SwitchMarkVariantProps>(
    props: T,
  ) => [SwitchMarkVariantProps, Omit<T, keyof SwitchMarkVariantProps>];
}
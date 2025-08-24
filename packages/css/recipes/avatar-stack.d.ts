declare interface AvatarStackVariant {
  /**
  * @default 48
  */
  size: "20" | "24" | "36" | "42" | "48" | "64" | "80" | "96" | "108";
}

declare type AvatarStackVariantMap = {
  [key in keyof AvatarStackVariant]: Array<AvatarStackVariant[key]>;
};

export declare type AvatarStackVariantProps = Partial<AvatarStackVariant>;

export declare type AvatarStackSlotName = "root" | "item";

export declare const avatarStackVariantMap: AvatarStackVariantMap;

export declare const avatarStack: ((
  props?: AvatarStackVariantProps,
) => Record<AvatarStackSlotName, string>) & {
  splitVariantProps: <T extends AvatarStackVariantProps>(
    props: T,
  ) => [AvatarStackVariantProps, Omit<T, keyof AvatarStackVariantProps>];
}
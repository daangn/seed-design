declare interface AvatarVariant {
  /**
  * @default 48
  */
  size: "20" | "24" | "36" | "42" | "48" | "64" | "80" | "96" | "108";
/**
  * @default "none"
  */
  badgeMask: "none" | "circle" | "flower" | "shield";
}

declare type AvatarVariantMap = {
  [key in keyof AvatarVariant]: Array<AvatarVariant[key]>;
};

export declare type AvatarVariantProps = Partial<AvatarVariant>;

export declare type AvatarSlotName = "root" | "image" | "fallback" | "badge";

export declare const avatarVariantMap: AvatarVariantMap;

export declare const avatar: ((
  props?: AvatarVariantProps,
) => Record<AvatarSlotName, string>) & {
  splitVariantProps: <T extends AvatarVariantProps>(
    props: T,
  ) => [AvatarVariantProps, Omit<T, keyof AvatarVariantProps>];
}
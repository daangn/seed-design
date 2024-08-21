interface AvatarVariant {
  size: "20" | "24" | "36" | "48" | "64" | "80" | "96"
}

type AvatarVariantMap = {
  [key in keyof AvatarVariant]: Array<AvatarVariant[key]>;
};

export type AvatarVariantProps = Partial<AvatarVariant>;

export type AvatarSlotName = "root" | "image" | "fallback" | "badge";

export const avatarVariantMap: AvatarVariantMap;

export function avatar(
  props?: AvatarVariantProps,
): Record<AvatarSlotName, string>;
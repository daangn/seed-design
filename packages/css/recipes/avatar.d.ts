declare interface AvatarVariant {
  /**
  * - `20`: 대표 사용처: 댓글을 남긴 사용자
  * - `24`: 대표 사용처: 답글 프로필
  * - `36`: 대표 사용처: 댓글 프로필
  * - `42`: 대표 사용처: 게시글 상세 내 프로필
  * - `48`: 대표 사용처: 작은 리스트
  * - `56`: 대표 사용처: 큰 리스트
  * - `64`: 대표 사용처: 프로필 상세, 캐러셀
  * - `108`: 대표 사용처: 프로필 수정
  *
  * @default 48
  */
  size: "20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108";
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
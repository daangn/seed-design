declare interface SkeletonVariant {
  /**
  * - `0`: 기본값입니다.
  * - `8`: 텍스트 콘텐츠에 사용합니다.
  * - `16`: 카드 및 썸네일에 사용합니다.
  * - `full`: Avatar(원형) 콘텐츠에 사용합니다.
  *
  * @default 8
  */
  radius: "0" | "8" | "16" | "full";
/**
  * - `neutral`: 데이터를 불러오는 일반적인 로딩 경험에 사용합니다.
  * - `magic`: AI 기능이 활성화되었을 때 사용합니다.
  *
  * @default "neutral"
  */
  tone: "neutral" | "magic";
}

declare type SkeletonVariantMap = {
  [key in keyof SkeletonVariant]: Array<SkeletonVariant[key]>;
};

export declare type SkeletonVariantProps = Partial<SkeletonVariant>;

export declare const skeletonVariantMap: SkeletonVariantMap;

export declare const skeleton: ((
  props?: SkeletonVariantProps,
) => string) & {
  splitVariantProps: <T extends SkeletonVariantProps>(
    props: T,
  ) => [SkeletonVariantProps, Omit<T, keyof SkeletonVariantProps>];
}
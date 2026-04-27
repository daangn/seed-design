declare interface BadgeVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * - `weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
  * - `solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
  * - `outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
  *
  * @default "solid"
  */
  variant: "weak" | "solid" | "outline";
/**
  * - `neutral`: 상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태
  * - `informative`: 베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지
  * - `positive`: 완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과
  * - `warning`: 만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태
  * - `critical`: 검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패
  *
  * @default "neutral"
  */
  tone: "neutral" | "brand" | "informative" | "positive" | "warning" | "critical";
}

declare type BadgeVariantMap = {
  [key in keyof BadgeVariant]: Array<BadgeVariant[key]>;
};

export declare type BadgeVariantProps = Partial<BadgeVariant>;

export declare type BadgeSlotName = "root" | "label";

export declare const badgeVariantMap: BadgeVariantMap;

export declare const badge: ((
  props?: BadgeVariantProps,
) => Record<BadgeSlotName, string>) & {
  splitVariantProps: <T extends BadgeVariantProps>(
    props: T,
  ) => [BadgeVariantProps, Omit<T, keyof BadgeVariantProps>];
}
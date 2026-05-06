declare interface ProgressCircleVariant {
  /**
  * - `neutral`: 가장 보편적으로 사용되며 스타일보다는 로딩 상태의 인식이 더 중요한 경우 사용합니다.
  * - `brand`: 사용자 경험의 초기 단계에서 브랜드 컬러를 통해 주요 전환점을 강조할 때 사용합니다.
  * - `staticWhite`: 화면 전체를 어둡게 덮는 오버레이(Overlay) 위에 로딩 상태를 표시할 때 사용합니다.
  *
  * @default "neutral"
  */
  tone: "neutral" | "brand" | "staticWhite" | "inherit";
/**
  * - `24`: 특정 요소 안에서 사용하는 경우 사용합니다.
  * - `40`: 주로 전체 페이지 로딩에 사용합니다.
  *
  * @default 40
  */
  size: "24" | "40" | "inherit";
}

declare type ProgressCircleVariantMap = {
  [key in keyof ProgressCircleVariant]: Array<ProgressCircleVariant[key]>;
};

export declare type ProgressCircleVariantProps = Partial<ProgressCircleVariant>;

export declare type ProgressCircleSlotName = "root" | "track" | "range";

export declare const progressCircleVariantMap: ProgressCircleVariantMap;

export declare const progressCircle: ((
  props?: ProgressCircleVariantProps,
) => Record<ProgressCircleSlotName, string>) & {
  splitVariantProps: <T extends ProgressCircleVariantProps>(
    props: T,
  ) => [ProgressCircleVariantProps, Omit<T, keyof ProgressCircleVariantProps>];
}
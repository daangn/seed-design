declare interface TextVariant {
  /**
  * - `screenTitle`: 화면에 크게 표시되는 주요 제목이나 타이틀에 사용합니다.
  * - `articleBody`: 게시물이나 콘텐츠 중심 섹션의 본문 텍스트에 사용합니다.
  * - `articleNote`: 주석, 참고 사항 및 상세 리스트 등 부가 정보에 사용하며, 일반 본문 텍스트에는 사용하지 않습니다.
  * - `t1StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t1StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t1StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t2StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t2StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t2StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t3StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t3StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t3StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t4StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t4StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t4StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t5StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t5StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t5StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t6StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t6StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t6StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t7StaticRegular`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t7StaticMedium`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t7StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t8StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t9StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  * - `t10StaticBold`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
  *
  * @default "t5Regular"
  */
  textStyle: "screenTitle" | "articleBody" | "articleNote" | "t1Regular" | "t1Medium" | "t1Bold" | "t2Regular" | "t2Medium" | "t2Bold" | "t3Regular" | "t3Medium" | "t3Bold" | "t4Regular" | "t4Medium" | "t4Bold" | "t5Regular" | "t5Medium" | "t5Bold" | "t6Regular" | "t6Medium" | "t6Bold" | "t7Regular" | "t7Medium" | "t7Bold" | "t8Bold" | "t9Bold" | "t10Bold" | "t1StaticRegular" | "t1StaticMedium" | "t1StaticBold" | "t2StaticRegular" | "t2StaticMedium" | "t2StaticBold" | "t3StaticRegular" | "t3StaticMedium" | "t3StaticBold" | "t4StaticRegular" | "t4StaticMedium" | "t4StaticBold" | "t5StaticRegular" | "t5StaticMedium" | "t5StaticBold" | "t6StaticRegular" | "t6StaticMedium" | "t6StaticBold" | "t7StaticRegular" | "t7StaticMedium" | "t7StaticBold" | "t8StaticBold" | "t9StaticBold" | "t10StaticBold";
/**
  * @default "none"
  */
  maxLines: "none" | "single" | "multi";
/**
  * @default "none"
  */
  textDecorationLine: "none" | "line-through" | "underline";
}

declare type TextVariantMap = {
  [key in keyof TextVariant]: Array<TextVariant[key]>;
};

export declare type TextVariantProps = Partial<TextVariant>;

export declare const textVariantMap: TextVariantMap;

export declare const text: ((
  props?: TextVariantProps,
) => string) & {
  splitVariantProps: <T extends TextVariantProps>(
    props: T,
  ) => [TextVariantProps, Omit<T, keyof TextVariantProps>];
}
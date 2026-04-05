/* TODO: Lynx SVG(stroke-dasharray) 지원 시 qvism recipe 자동 생성으로 전환하고 이 파일 삭제 */

declare interface ProgressCircleVariant {
  /**
   * @default "neutral"
   */
  tone: "neutral" | "brand" | "staticWhite";
  /**
   * @default "40"
   */
  size: "24" | "40";
}

declare type ProgressCircleVariantMap = {
  [key in keyof ProgressCircleVariant]: Array<ProgressCircleVariant[key]>;
};

export declare type ProgressCircleVariantProps = Partial<ProgressCircleVariant>;

export declare type ProgressCircleSlotName = "root" | "range" | "cap";

export declare const progressCircleVariantMap: ProgressCircleVariantMap;

export declare const progressCircle: ((
  props?: ProgressCircleVariantProps,
) => Record<ProgressCircleSlotName, string>) & {
  splitVariantProps: <T extends ProgressCircleVariantProps>(
    props: T,
  ) => [ProgressCircleVariantProps, Omit<T, keyof ProgressCircleVariantProps>];
};

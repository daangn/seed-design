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

export declare type ProgressCircleSlotName = "root" | "halfContainer" | "range" | "cap";

export declare const progressCircleVariantMap: ProgressCircleVariantMap;

export declare const progressCircleVariantKeys: Array<keyof ProgressCircleVariant>;

export declare const progressCircle: (props?: ProgressCircleVariantProps) => Record<
  ProgressCircleSlotName,
  string
> & {
  halfRotator: (side: "LEFT" | "RIGHT") => string;
};

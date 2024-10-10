interface ProgressCircleVariant {
  size: "small" | "medium";
  indeterminate: true | false
}

type ProgressCircleVariantMap = {
  [key in keyof ProgressCircleVariant]: Array<ProgressCircleVariant[key]>;
};

export type ProgressCircleVariantProps = Partial<ProgressCircleVariant>;

export type ProgressCircleSlotName = "root" | "track" | "indicator" | "indicator-path";

export const progressCircleVariantMap: ProgressCircleVariantMap;

export function progressCircle(
  props?: ProgressCircleVariantProps,
): Record<ProgressCircleSlotName, string>;
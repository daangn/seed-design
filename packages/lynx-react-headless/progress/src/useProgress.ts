import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";

type ViewProps = IntrinsicElements["view"];

export interface UseProgressProps {
  /** 현재 값입니다. 숫자가 아니면 indeterminate입니다. */
  value?: number;

  /**
   * 최솟값입니다.
   * @default 0
   */
  minValue?: number;

  /**
   * 최댓값입니다.
   * @default 100
   */
  maxValue?: number;
}

export type ProgressRootNativeProps = Required<
  Pick<
    ViewProps,
    "accessibility-element" | "accessibility-role-description" | "accessibility-value"
  >
>;

export interface UseProgressReturn {
  value: number | undefined;
  minValue: number;
  maxValue: number;
  /** `value`가 숫자가 아니면 `true`입니다. */
  indeterminate: boolean;
  /**
   * `minValue`부터 `maxValue`까지에서 `value`의 위치를 0–100으로 나타냅니다.
   * 범위 밖의 값은 0이나 100으로 맞추고, `minValue`와 `maxValue`가 같으면 0입니다.
   * indeterminate이면 -1입니다.
   */
  percent: number;
  /** Root native view에 펼칩니다. 뒤에 펼친 접근성 props가 기본값을 덮어씁니다. */
  rootProps: ProgressRootNativeProps;
}

/**
 * @platform Lynx
 *
 * 진행률의 determinate 여부, 0–100 진행률, progressbar 접근성 기본값을 제공하는 headless 훅입니다.
 * 웹 `@seed-design/react-progress`와 달리 `aria-*` 대신 `accessibility-value`로
 * `"minimum 0, maximum 100, current 40"` 또는 `"indeterminate"`를 알립니다.
 */
export function useProgress(props: UseProgressProps = {}): UseProgressReturn {
  const { value, minValue = 0, maxValue = 100 } = props;

  return useMemo<UseProgressReturn>(() => {
    const indeterminate = typeof value !== "number";
    const range = maxValue - minValue;
    const percent = indeterminate
      ? -1
      : range === 0
        ? 0
        : Math.min(100, Math.max(0, ((value - minValue) / range) * 100));

    return {
      value,
      minValue,
      maxValue,
      indeterminate,
      percent,
      rootProps: {
        "accessibility-element": true,
        "accessibility-role-description": "progressbar",
        "accessibility-value": indeterminate
          ? "indeterminate"
          : `minimum ${minValue}, maximum ${maxValue}, current ${value}`,
      },
    };
  }, [value, minValue, maxValue]);
}

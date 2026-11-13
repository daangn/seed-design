/**
 * 시트 레이어 기준 길이다. `vh`·`vw`는 LynxView viewport 기준이라 `container` 레이어나 고정 높이로 삽입된
 * LynxView에서는 레이어와 다르므로, 측정값이 있으면 그 값을 쓴다. 측정 전에는 viewport 단위로 두며, 화면 전체
 * LynxView에서는 두 값이 같다.
 */
export function getSheetLayerLength(size: number | undefined, unit: "vh" | "vw", fraction = 1) {
  return size === undefined ? `${fraction * 100}${unit}` : `${size * fraction}px`;
}

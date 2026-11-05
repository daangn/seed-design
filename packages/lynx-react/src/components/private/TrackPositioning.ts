export interface TrackPositioningOptions {
  /** 최솟값이 0, 최댓값이 1인 값의 비율입니다. 범위 밖이면 양 끝에 고정합니다. */
  progress: number;
  trackWidth: number;
  thumbWidth: number;
  labelWidth: number;
  direction?: "ltr" | "rtl";
}

/**
 * 트랙 왼쪽 기준 논리 px로 thumb 중심과 label 왼쪽 좌표를 계산합니다.
 * arrowCenter는 label 왼쪽 기준이며 화살표 너비의 절반을 빼서 배치합니다.
 * 트랙보다 넓은 label은 중앙에 두고 양쪽으로 넘치게 합니다.
 *
 * 각 thumb에 대해 호출하며, 측정값을 재사용할 수 있는 동기식 계산입니다.
 * MTS에서는 이 모듈을 runtime: 'shared'로 import하고 native 측정은 별도로 수행합니다.
 */
export function getTrackPosition({
  progress,
  trackWidth,
  thumbWidth,
  labelWidth,
  direction = "ltr",
}: TrackPositioningOptions) {
  const track = Math.max(0, trackWidth);
  const thumb = Math.min(track, Math.max(0, thumbWidth));
  const label = Math.max(0, labelWidth);
  const value = Math.max(0, Math.min(1, progress));
  const physicalProgress = direction === "rtl" ? 1 - value : value;
  const thumbCenter = thumb / 2 + physicalProgress * (track - thumb);
  const labelLeft =
    label > track
      ? (track - label) / 2
      : Math.max(0, Math.min(track - label, thumbCenter - label / 2));

  return { thumbCenter, labelLeft, arrowCenter: thumbCenter - labelLeft };
}

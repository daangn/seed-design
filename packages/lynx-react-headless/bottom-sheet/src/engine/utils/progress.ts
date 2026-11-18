/** 위치 애니메이션과 배경 농도의 관계. 레이아웃 변경 중에도 이 기준을 유지한다. */
export interface ProgressMapping {
  kind: "transition" | "drag";
  fromPosition: number;
  fromProgress: number;
  toPosition: number;
  toProgress: number;
}

export function getSheetProgress(position: number, mapping: ProgressMapping): number {
  "main thread";
  const { kind, fromPosition, fromProgress, toPosition, toProgress } = mapping;
  let progress: number;
  if (kind === "drag" && position <= fromPosition) {
    progress = fromPosition > 0 ? (position / fromPosition) * fromProgress : 0;
  } else if (toPosition === fromPosition) {
    progress = toProgress;
  } else {
    progress =
      fromProgress +
      ((position - fromPosition) / (toPosition - fromPosition)) * (toProgress - fromProgress);
  }
  return Math.max(0, Math.min(1, progress));
}

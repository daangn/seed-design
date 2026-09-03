import { useRef } from "react";
import type { NextAppScreenProps } from "seed-design/ui/next-app-screen";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

/**
 * 스와이프백의 시작 시점과 확정 여부, 그리고 최대 displacement ratio 를 Snackbar 로
 * 알린다. 전환 QA 화면과 제스처 충돌 화면이 같은 신호를 읽어야 두 화면의 결과를
 * 서로 비교할 수 있으므로 핸들러를 한곳에 둔다.
 */
export function useSwipeBackSnackbar(): Pick<
  NextAppScreenProps,
  "onSwipeBackStart" | "onSwipeBackMove" | "onSwipeBackEnd"
> {
  const snackbar = useSnackbarAdapter();

  // 제스처 진행 중에는 ref 에만 적어 프레임마다 리렌더가 걸리지 않게 한다.
  const peakRatioRef = useRef(0);

  return {
    onSwipeBackStart: () => {
      peakRatioRef.current = 0;
      snackbar.create({ render: () => <Snackbar message="Started swiping" />, timeout: 500 });
    },
    onSwipeBackMove: ({ displacementRatio }) => {
      peakRatioRef.current = Math.max(peakRatioRef.current, displacementRatio);
    },
    onSwipeBackEnd: ({ swiped }) => {
      const peak = peakRatioRef.current.toFixed(2);
      snackbar.create({
        render: () => <Snackbar message={`Swiped: ${swiped} (peak ratio ${peak})`} />,
        timeout: 1000,
      });
    },
  };
}

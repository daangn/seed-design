import * as React from "@lynx-js/react";
import { useSafeArea } from "@seed-design/lynx-react-use-safe-area";

export interface UseAppBarReturn {
  /** host가 제공한 상단 safe area 값. 값이 없으면 `env(safe-area-inset-top)`이다. */
  safeAreaInsetTop: string;
  /** host가 제공한 좌측 safe area 값. 값이 없으면 `env(safe-area-inset-left)`이다. */
  safeAreaInsetLeft: string;
  /** host가 제공한 우측 safe area 값. 값이 없으면 `env(safe-area-inset-right)`이다. */
  safeAreaInsetRight: string;
  /** 좌우 슬롯 중 넓은 쪽의 폭. 가운데 정렬한 제목의 좌우 padding으로 사용한다. */
  centeredTitlePaddingX: string;
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
}

export function useAppBar(): UseAppBarReturn {
  const { safeAreaInsetTop, safeAreaInsetLeft, safeAreaInsetRight } = useSafeArea();
  const sideWidths = React.useRef({ left: 0, right: 0 });
  const [titlePadding, setTitlePadding] = React.useState(0);
  const setSideWidth = React.useCallback((side: "left" | "right", width: number) => {
    "background only";
    sideWidths.current[side] = width;
    setTitlePadding(Math.max(sideWidths.current.left, sideWidths.current.right));
  }, []);
  const setLeftWidth = React.useCallback(
    (width: number) => {
      "background only";
      setSideWidth("left", width);
    },
    [setSideWidth],
  );
  const setRightWidth = React.useCallback(
    (width: number) => {
      "background only";
      setSideWidth("right", width);
    },
    [setSideWidth],
  );
  const centeredTitlePaddingX = `${titlePadding}px`;

  return React.useMemo(
    () => ({
      safeAreaInsetTop,
      safeAreaInsetLeft,
      safeAreaInsetRight,
      centeredTitlePaddingX,
      setLeftWidth,
      setRightWidth,
    }),
    [
      safeAreaInsetTop,
      safeAreaInsetLeft,
      safeAreaInsetRight,
      centeredTitlePaddingX,
      setLeftWidth,
      setRightWidth,
    ],
  );
}

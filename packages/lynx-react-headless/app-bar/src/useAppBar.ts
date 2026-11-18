import * as React from "@lynx-js/react";
import { useSafeArea } from "@seed-design/lynx-react-use-safe-area";

export interface UseAppBarReturn {
  /** 상단 safe area 값. Provider가 없으면 `"0px"`이다. */
  safeAreaInsetTop: string;
  /** 좌측 safe area 값. Provider가 없으면 `"0px"`이다. */
  safeAreaInsetLeft: string;
  /** 우측 safe area 값. Provider가 없으면 `"0px"`이다. */
  safeAreaInsetRight: string;
  /** 좌우 슬롯 중 넓은 쪽의 폭. 가운데 정렬한 제목의 좌우 padding으로 사용한다. */
  centeredTitlePaddingX: string;
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
}

export function useAppBar(): UseAppBarReturn {
  const { safeAreaInsetTop, safeAreaInsetLeft, safeAreaInsetRight } = useSafeArea();
  const [leftWidth, setLeftWidth] = React.useState(0);
  const [rightWidth, setRightWidth] = React.useState(0);
  const centeredTitlePaddingX = `${Math.max(leftWidth, rightWidth)}px`;

  return React.useMemo(
    () => ({
      safeAreaInsetTop,
      safeAreaInsetLeft,
      safeAreaInsetRight,
      centeredTitlePaddingX,
      setLeftWidth,
      setRightWidth,
    }),
    [safeAreaInsetTop, safeAreaInsetLeft, safeAreaInsetRight, centeredTitlePaddingX],
  );
}

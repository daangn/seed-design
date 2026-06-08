import type { LynxStyle } from "../../types";

interface GetAppBarRootStyleOptions {
  centeredTitlePaddingX: string;
  safeAreaInsetTop: string;
  style?: LynxStyle;
}

export function getAppBarRootStyle({
  centeredTitlePaddingX,
  safeAreaInsetTop,
  style,
}: GetAppBarRootStyleOptions): LynxStyle {
  return {
    "--seed-safe-area-top": safeAreaInsetTop,
    "--centered-title-padding-x": centeredTitlePaddingX,
    ...style,
  } as LynxStyle;
}

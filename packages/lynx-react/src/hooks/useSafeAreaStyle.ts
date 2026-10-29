import { useGlobalProps } from "@lynx-js/react";
import { useSafeArea } from "./useSafeArea";

export function useSafeAreaStyle() {
  // host가 inset을 바꾸면 Recipe에 전달하는 값도 다시 계산한다.
  useGlobalProps();
  const { safeAreaInsetLeft, safeAreaInsetRight } = useSafeArea();

  return {
    "--seed-safe-area-left": safeAreaInsetLeft,
    "--seed-safe-area-right": safeAreaInsetRight,
  };
}

import { useSafeArea } from "./useSafeArea";

export function useSafeAreaStyle() {
  // `useSafeArea`가 `globalPropsMode`에 맞게 host 값을 읽으므로 inset이 바뀌면 다시 계산된다.
  const { safeAreaInsetLeft, safeAreaInsetRight } = useSafeArea();

  return {
    "--seed-safe-area-left": safeAreaInsetLeft,
    "--seed-safe-area-right": safeAreaInsetRight,
  };
}

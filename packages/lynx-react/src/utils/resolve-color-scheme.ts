import type { ColorMode } from "./get-seed-class-name";

/**
 * `colorMode`를 적용한 테마. `"system"`이면 `getSystemScheme()`의 값이 `"dark"`일 때만 dark다.
 * root `<page>`의 className(`getSeedClassName`)과 JS에서 테마를 정하는 곳(Liquid Glass tint)이 같은 규칙을 쓴다.
 */
export function resolveColorScheme(
  colorMode: ColorMode | undefined,
  getSystemScheme: () => unknown,
): "light" | "dark" {
  if (colorMode === "light-only") return "light";
  if (colorMode === "dark-only") return "dark";

  const systemScheme = getSystemScheme();
  return typeof systemScheme === "string" && systemScheme.toLowerCase() === "dark"
    ? "dark"
    : "light";
}

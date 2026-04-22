/**
 * Rootage vars 객체에서 `path` 를 따라 token 값(주로 `"var(--seed-...)"` 스트링)을 꺼낸다.
 *
 * 쓰임새: Lynx `<image>` 의 `tint-color` / `width` / `height` 처럼 CSS 만으로는
 * override 할 수 없거나(아이콘 패키지가 inline style 을 박는 경우 등) React 가
 * recipe 와 같은 소스에서 꺼내 inline attribute 로 주입해야 하는 속성을 다룰 때.
 *
 * ```ts
 * import { actionButton as actionButtonVars } from "@seed-design/lynx-css/vars/component";
 * import { capitalize, resolveRecipeToken } from "@seed-design/lynx-react/utils/resolve-recipe-token";
 *
 * // variant × state × slot → color
 * const color = resolveRecipeToken(actionButtonVars, [
 *   `variant${capitalize(variant)}`,
 *   state,          // "enabled" | "disabled" | "loading" | "pressed"
 *   "prefixIcon",
 *   "color",
 * ]);
 *
 * // size × layout → icon size
 * const size = resolveRecipeToken(actionButtonVars, [
 *   `size${capitalize(size)}Layout${capitalize(layout)}`,
 *   "enabled",
 *   "prefixIcon",
 *   "size",
 * ]);
 * ```
 *
 * recipe token 경로가 컴포넌트마다 조금씩 다르므로(variant/size/layout 조합 여부 등)
 * 이 유틸은 "vars + path" 조합만 제공하고, 각 컴포넌트가 자기 path 를 만들어 호출한다.
 */
export function resolveRecipeToken<V extends Record<string, unknown>>(
  vars: V,
  path: readonly string[],
): string | undefined {
  let cursor: unknown = vars;
  for (const key of path) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return typeof cursor === "string" ? cursor : undefined;
}

/**
 * 첫 글자 대문자. recipe variant key 조립용
 * (e.g. `variant` + `brandSolid` → `variantBrandSolid`).
 */
export function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>;
}

import type { SeedGlassEffect } from "../contexts/SeedContext";

export type ResolvedGlassEffect = Required<SeedGlassEffect>;

/**
 * `SeedProvider`와 컴포넌트의 `glassEffect`를 같은 규칙으로 해석한다.
 * 생략하면 바깥 값을 이어받고, `false`는 이어받은 효과를 끄며, `true`는 `{}`와 같다.
 */
export function resolveGlassEffect(
  own: boolean | SeedGlassEffect | undefined,
  inherited: boolean | SeedGlassEffect | undefined,
): ResolvedGlassEffect | undefined {
  // `false`는 `??`에서 멈추므로 바깥 값을 이어받지 않는다.
  const input = own ?? inherited;
  if (input === undefined || input === false) return undefined;
  if (input === true) return { style: "regular", interactive: false };
  return { style: input.style ?? "regular", interactive: input.interactive ?? false };
}

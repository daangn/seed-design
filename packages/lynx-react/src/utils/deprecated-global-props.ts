// 당근 앱 호스트만 넣어 주는 global props 키를 직접 읽는 deprecated 경로다.
// 다음 메이저에서 이 파일과 호출부를 함께 제거한다. 앱은 `SeedProvider`로 값을 넘긴다.

export type DeprecatedGlobalPropKey = "theme" | "motion";

const replacements: Record<DeprecatedGlobalPropKey, string> = {
  theme: "preferredColorScheme",
  motion: "preferredMotion",
};

const warnedKeys = new Set<DeprecatedGlobalPropKey>();

/**
 * global props에서 `key`를 읽는다. 값이 있어 실제로 쓰일 때만 dev 빌드에서 키별로 한 번 경고한다.
 * 키가 없는 호스트(PlayLynx 등)에서는 조용히 `undefined`를 돌려준다.
 */
export function readDeprecatedGlobalProp(
  globalProps: object | undefined,
  key: DeprecatedGlobalPropKey,
): unknown {
  const value = (globalProps as Record<string, unknown> | undefined)?.[key];

  if (process.env.NODE_ENV !== "production" && value !== undefined && !warnedKeys.has(key)) {
    warnedKeys.add(key);
    console.warn(
      `[@seed-design/lynx-react] Reading \`lynx.__globalProps.${key}\` is deprecated and will be removed in the next major version. Pass \`${replacements[key]}\` to \`SeedProvider\` instead.`,
    );
  }

  return value;
}

/** @internal 테스트에서 키별 1회 경고 상태를 초기화한다. */
export function resetDeprecatedGlobalPropWarnings(): void {
  warnedKeys.clear();
}

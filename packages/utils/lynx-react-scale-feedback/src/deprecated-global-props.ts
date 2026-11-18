let warned = false;

// TODO(next major): `motion` global prop 읽기를 제거한다. 앱은 `SeedProvider`에 `preferredMotion`을 넘긴다.
export function warnDeprecatedMotionGlobalProp(): void {
  if (process.env.NODE_ENV === "production" || warned) return;

  warned = true;
  console.warn(
    "[@seed-design/lynx-react-scale-feedback] Reading `lynx.__globalProps.motion` is deprecated and will be removed in the next major version. Pass `preferredMotion` to `SeedProvider` instead.",
  );
}

/** @internal 테스트용. */
export function resetDeprecatedMotionWarning(): void {
  warned = false;
}

const warnedKeys = new Set<string>();

export function warnDeprecatedGlobalProp(key: string) {
  if (process.env.NODE_ENV === "production" || warnedKeys.has(key)) return;

  warnedKeys.add(key);
  console.warn(
    `[@seed-design/lynx-react-use-safe-area] Reading \`lynx.__globalProps.${key}\` is deprecated and will be removed in the next major version. Pass \`safeAreaInsets\` to \`SeedProvider\` or \`insets\` to \`SafeAreaProvider\` instead.`,
  );
}

/** @internal 테스트용. */
export function resetDeprecatedSafeAreaWarnings(): void {
  warnedKeys.clear();
}

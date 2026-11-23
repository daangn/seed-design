export function getTokenType<T extends string>(token: string, types: readonly T[]): T | undefined {
  const type = types[0];
  if (types.some((other) => other !== type)) {
    throw new Error(
      `Token "${token}" has different value types across modes: ${[...new Set(types)].join(", ")}`,
    );
  }
  return type;
}

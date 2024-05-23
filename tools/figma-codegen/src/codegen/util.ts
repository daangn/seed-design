export function ensureArray<T>(maybeArray: T | T[]): T[] {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }

  return [maybeArray];
}

export function exists<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function compactObject<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null)) as T;
}

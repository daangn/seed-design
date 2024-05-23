export function compact<T>(array: Array<T | undefined>): T[] {
  return array.filter((item) => item !== undefined) as T[];
}

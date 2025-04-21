export function uniqBy<T>(arr: T[], predicate: ((item: T) => any) | string): T[] {
  const cb =
    typeof predicate === "function"
      ? (predicate as (item: T) => any)
      : (o: any) => o[predicate as string];

  // Create a new Map to store unique values
  const map = new Map();

  // Add each item to the map with the key determined by the predicate
  arr.forEach((item) => {
    const key = item === null || item === undefined ? item : cb(item);
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  // Convert the map values back to an array
  return Array.from(map.values());
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

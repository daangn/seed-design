export type ColorMode = (
  | 'auto'
  | 'light-only'
  | 'dark-only'
);

export const StorageKey = {
  COLOR: '@seed-design/scale-color',
  PLATFORM: '@seed-design/platform',
} as const;

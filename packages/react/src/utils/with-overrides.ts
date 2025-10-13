export type WithOverrides<T extends string> = {
  overrides?: Partial<Record<T, string>>;
};

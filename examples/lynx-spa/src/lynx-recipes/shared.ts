export function createClassName(
  className: string,
  variants: Record<string, string>,
  compoundVariants: Record<string, string>[] = [],
): string {
  const variantKeys = Object.keys(variants);
  const variantClassName = variantKeys
    .map((key) => `${className}--${key}_${variants[key]}`)
    .join(' ');

  const compoundClassName = compoundVariants
    .filter((cv) => Object.keys(cv).every((key) => cv[key] === variants[key]))
    .map(
      (cv) =>
        `${className}--${Object.keys(cv)
          .map((key) => `${key}_${cv[key]}`)
          .join('-')}`,
    )
    .join(' ');

  return [className, variantClassName, compoundClassName]
    .filter(Boolean)
    .join(' ');
}

export function mergeVariants(
  defaults: Record<string, string>,
  overrides: Record<string, string | undefined>,
): Record<string, string> {
  const result = { ...defaults };
  for (const key in overrides) {
    if (overrides[key] != null) {
      result[key] = overrides[key] as string;
    }
  }
  return result;
}

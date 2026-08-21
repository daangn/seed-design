/** Restores defaults overwritten by explicitly passed undefined values. */
export function restoreDefaultProps<P>(
  props: Record<string, unknown>,
  defaultProps: Partial<P> | undefined,
) {
  if (!defaultProps) return;

  for (const key of Object.keys(defaultProps)) {
    if (props[key] === undefined) {
      props[key] = defaultProps[key as keyof P];
    }
  }
}

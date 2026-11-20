export interface SeedTagSpec {
  name: string;
  axes: readonly string[];
  defaults: Readonly<Record<string, unknown>>;
}

/**
 * Builds the `lynx-test-tag` value `seed:<Name>;<axis>=<value>;...` from a recipe's `SeedTagSpec`.
 * Only Rootage variant axes are written, in Rootage order, with the value the recipe draws.
 */
export function seedTag(spec: SeedTagSpec, values: Record<string, unknown> = {}): string {
  let tag = `seed:${spec.name}`;

  for (const axis of spec.axes) {
    const value = values[axis] ?? spec.defaults[axis];
    if (value != null) tag += `;${axis}=${value}`;
  }

  return tag;
}

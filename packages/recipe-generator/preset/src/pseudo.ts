export const hover = ":hover";

export const focus = ":is(:focus, [data-focus])";

export const focusVisible = ":is(:focus-visible, [data-focus-visible])";

export const pressed = ":is(:active, [data-pressed])";

export const disabled = ":is(:disabled, [disabled], [data-disabled])";

export const open = ':is([data-state="open"], [data-open])';

export function pseudo<T extends string>(selectorA: T): `&${T}`;
export function pseudo<T extends string, U extends string>(
  selectorA: T,
  selectorB: U,
): `&${T}${U}`;
export function pseudo(...selectors: string[]) {
  return selectors.map((selector) => `&${selector}`).join("");
}

export function not<T extends string>(selector: T): `:not(${T})` {
  return `:not(${selector})`;
}

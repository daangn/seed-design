export const focus = ":is(:focus, [data-focus])";

export const focusVisible = ":is(:focus-visible, [data-focus-visible])";

export const active = ":is(:active, [data-active])";

export const disabled = ":is(:disabled, [disabled], [data-disabled])";

export const checked = ":is(:checked, [data-checked])";

export const selected = ":is(:selected, [data-selected])";

export const open = ':is([data-state="open"], [data-open])';

export function pseudo<T extends string>(selectorA: T): `&${T}`;
export function pseudo<T extends string, U extends string>(selectorA: T, selectorB: U): `&${T}${U}`;
export function pseudo(...selectors: string[]) {
  return `&${selectors.join("")}`;
}

export function not<T extends string>(selector: T): `:not(${T})` {
  return `:not(${selector})`;
}

export const media = {
  isHoverableInputDevice: "@media (hover: hover) and (pointer: fine)",
  isNotHoverableInputDevice: "@media not all and (hover: hover) and (pointer: fine)",
} as const;

export const loading = "[data-loading]";

export const before = "::before";
export const after = "::after";
export const directChild = " > *:not(style)";

type ConcatStrings<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${First}${ConcatStrings<Rest>}`
  : "";

export function pseudo<T extends string>(selectorA: T): `&${T}`;
export function pseudo<T extends string, U extends string>(selectorA: T, selectorB: U): `&${T}${U}`;
export function pseudo<T extends string[]>(...selectors: [...T]): `&${ConcatStrings<T>}`;
export function pseudo(...selectors: string[]) {
  return `&${selectors.join("")}`;
}

export function not<T extends string>(selector: T): `:not(${T})` {
  return `:not(${selector})`;
}

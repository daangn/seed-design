/** Converts rem to sp (1rem = 16sp). Lynx `rem` ignores the system font scale, so font-scaled values use `sp`. */
export const remToSp = (rem: number) => `${Number.parseFloat((rem * 16).toFixed(4))}sp`;

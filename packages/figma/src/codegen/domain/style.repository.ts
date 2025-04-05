import type { Style } from "./style.interface";

export interface StyleRepository {
  getAll(): Style[];
  getTextStyles(): Style[];
  getColorStyles(): Style[];
  getOne(key: string): Style | undefined;
}

export function createStaticStyleRepository(styles: Style[]): StyleRepository {
  const stylesMap = new Map<string, Style>();

  for (const style of styles) {
    stylesMap.set(style.key, style);
  }

  return {
    getAll: () => styles,
    getTextStyles: () => styles.filter((style) => style.styleType === "TEXT"),
    getColorStyles: () => styles.filter((style) => style.styleType === "FILL"),
    getOne: (key) => stylesMap.get(key),
  };
}

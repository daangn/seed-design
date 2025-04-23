import type { Style } from "./style.interface";

export interface StyleRepository {
  getAll(): Style[];
  getTextStyles(): Style[];
  getColorStyles(): Style[];
  findOneByKey(key: string): Style | undefined;
  findOneByName(name: string): Style | undefined;
}

export function createStaticStyleRepository(styles: Style[]): StyleRepository {
  const stylesMap = new Map<string, Style>();
  const stylesNameMap = new Map<string, Style>();

  for (const style of styles) {
    stylesMap.set(style.key, style);
    stylesNameMap.set(style.name, style);
  }

  return {
    getAll: () => styles,
    getTextStyles: () => styles.filter((style) => style.styleType === "TEXT"),
    getColorStyles: () => styles.filter((style) => style.styleType === "FILL"),
    findOneByKey: (key) => stylesMap.get(key),
    findOneByName: (name) => stylesNameMap.get(name),
  };
}

import type { IconData } from "./icon.interface";

export interface IconRepository {
  getIconData(key: string): IconData;
}

export function createStaticIconRepository(iconRecord: Record<string, IconData>) {
  return {
    getIconData: (key: string) => iconRecord[key],
  };
}

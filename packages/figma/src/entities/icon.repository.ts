import type { IconData } from "./icon.interface";

export interface IconRepository {
  getOne(key: string): IconData;
}

export function createStaticIconRepository(iconRecord: Record<string, IconData>) {
  return {
    getOne: (key: string) => iconRecord[key],
  };
}

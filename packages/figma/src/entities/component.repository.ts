import type { ComponentMetadata } from "./component.interface";

export interface ComponentRepository {
  getOne(key: string): ComponentMetadata;
}

export function createStaticComponentRepository(data: Record<string, ComponentMetadata>) {
  const componentRecord: Record<string, ComponentMetadata> = {};
  Object.values(data).forEach((component) => {
    componentRecord[component.key] = component;
  });

  return {
    getOne: (key: string) => componentRecord[key],
  };
}

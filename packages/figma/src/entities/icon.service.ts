import { pascalCase } from "change-case";
import type { IconRepository } from "./icon.repository";

export interface IconService {
  isIconComponent: (componentKey: string) => boolean;
  createIconTagName: (key?: string) => string;
}

export function createIconService({
  iconRepository,
}: { iconRepository: IconRepository }): IconService {
  function isIconComponent(componentKey: string) {
    return iconRepository.getIconData(componentKey) !== undefined;
  }

  function createIconTagName(key?: string) {
    if (!key) {
      return "UnknownIcon";
    }

    const iconData = iconRepository.getIconData(key);
    if (!iconData) {
      return "UnknownIcon";
    }

    const { name, weight } = iconData;

    return pascalCase(`${name}${weight ? weight : ""}`);
  }

  return {
    isIconComponent,
    createIconTagName,
  };
}

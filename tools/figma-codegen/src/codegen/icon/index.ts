import { pascalCase } from "change-case";

import { iconRecord } from "./data";

export function isIconComponent(componentKey: string) {
  return !!iconRecord[componentKey];
}

export function createIconTagNameFromKey(key: string) {
  const iconData = iconRecord[key];
  if (!iconData) {
    throw new Error(`Icon not found: ${key}`);
  }

  const { name, weight } = iconData;

  return pascalCase(`${name}${weight}`);
}

export function createIconTagNameFromId(id: string) {
  const component = figma.getNodeById(id) as ComponentNode;
  const componentKey = component.key;

  return createIconTagNameFromKey(componentKey);
}

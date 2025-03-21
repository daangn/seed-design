import { pascalCase } from "change-case";

import { createColorProps } from "./color";
import { iconRecord } from "./data/icons";
import type { NormalizedInstanceNode } from "./normalizer/types";

export function isIconComponent(componentKey: string) {
  return !!iconRecord[componentKey];
}

export function createIconTagNameFromKey(key?: string) {
  if (!key) {
    return "UnknownIcon";
  }

  const iconData = iconRecord[key];
  if (!iconData) {
    throw new Error(`Icon not found: ${key}`);
  }

  const { name, weight } = iconData;

  return pascalCase(`${name}${weight ? weight : ""}`);
}

export function createMonochromeIconColorProps(node: NormalizedInstanceNode) {
  if (node.children.length === 0) {
    throw new Error("Icon node has no children");
  }

  const icons = node.children.filter(
    (child) => child.type === "VECTOR" || child.type === "BOOLEAN_OPERATION",
  );

  const colorProps = icons.map(createColorProps);

  const fills = new Set(
    colorProps.map((props) => props.color).filter((color) => color !== undefined),
  );

  if (fills.size > 1) {
    throw new Error(`Children of the icon node ${node.name} has multiple colors`);
  }

  return { color: fills.values().next().value };
}

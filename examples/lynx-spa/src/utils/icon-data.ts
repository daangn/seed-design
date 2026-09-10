import type { ComponentType } from "@lynx-js/react";

import type { IconEntry, IconProps } from "../components/icon-virtual-grid.jsx";

interface RawIconData {
  name: string;
}

type IconData = Record<string, RawIconData>;
type IconComponentMap = Record<string, ComponentType<IconProps> | undefined>;

function toPascalCasePart(part: string) {
  return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
}

function toComponentName(iconName: string) {
  return iconName
    .split("_")
    .map((part, index) => {
      const pascalCasePart = toPascalCasePart(part);
      return index > 0 && /^\d/.test(part) ? `_${pascalCasePart}` : pascalCasePart;
    })
    .join("");
}

function isIconEntry(entry: IconEntry | null): entry is IconEntry {
  return entry != null;
}

export function createIconEntries(iconData: IconData, components: IconComponentMap) {
  return Object.values(iconData)
    .map((icon) => {
      const componentName = toComponentName(icon.name);
      const component = components[componentName];

      if (component == null) {
        return null;
      }

      return {
        component,
        name: componentName.replace(/^Icon/, ""),
      };
    })
    .filter(isIconEntry);
}

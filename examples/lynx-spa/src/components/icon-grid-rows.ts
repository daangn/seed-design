import type { ComponentType } from "@lynx-js/react";
import type { LynxIconElementProps } from "@seed-design/lynx-react";

export interface IconProps extends LynxIconElementProps {
  color?: string;
  size?: number;
}

export interface IconEntry {
  component: ComponentType<IconProps>;
  name: string;
}

export function chunkIconEntries(icons: IconEntry[], columnCount: number) {
  const rows: IconEntry[][] = [];

  for (let index = 0; index < icons.length; index += columnCount) {
    rows.push(icons.slice(index, index + columnCount));
  }

  return rows;
}

import { Children } from "react";
import type { ReactNode } from "react";

export function hasChildren(children: ReactNode): boolean {
  return Children.count(children) > 0;
}

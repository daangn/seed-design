import type { ReactNode } from "@lynx-js/react";

export function toArray(children: ReactNode): ReactNode[] {
  if (children == null || typeof children === "boolean") {
    return [];
  }

  if (Array.isArray(children)) {
    return children.flatMap(toArray);
  }

  return [children];
}

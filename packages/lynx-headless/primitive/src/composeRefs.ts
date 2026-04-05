import type { Ref, RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    (ref as RefCallback<T>)(value);
  } else if (ref != null) {
    (ref as { current: T }).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void {
  return (node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}

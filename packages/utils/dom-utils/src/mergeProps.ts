// Mostly based on:
// - react-aria
// - @zag-js/core

import { clsx } from "cn";

interface Props {
  [key: string]: any;
}

type TupleTypes<T extends any[]> = T[number];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export function mergeProps<T>(...args: T[]): UnionToIntersection<TupleTypes<T[]>> {
  // Start with a base clone of the first argument. This is a lot faster than starting
  // with an empty object and adding properties as we go.
  const result = { ...args[0] } as Props;
  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    for (const key in props) {
      const a = result[key];
      const b = props[key];

      // Chain events
      if (
        typeof a === "function" &&
        typeof b === "function" &&
        key[0] === "o" &&
        key[1] === "n" &&
        key.charCodeAt(2) >= /* 'A' */ 65 &&
        key.charCodeAt(2) <= /* 'Z' */ 90
      ) {
        // While merging, we want to call the overriding function first.
        // Calling preventDefault in overriding function will prevent the default behavior of the base function.
        result[key] = chain(b, a);
      } else if (key === "className" && typeof a === "string" && typeof b === "string") {
        result[key] = clsx(a, b);
      } else if (key === "style") {
        result[key] = Object.assign({}, a ?? {}, b ?? {});
      } else {
        result[key] = b !== undefined ? b : a;
      }
    }
  }

  return result as UnionToIntersection<TupleTypes<T[]>>;
}

const chain =
  <T extends (...p: any[]) => void>(...fns: (T | undefined)[]) =>
  (...p: Parameters<T>) => {
    fns.forEach(function (fn) {
      fn?.(...p);
    });
  };

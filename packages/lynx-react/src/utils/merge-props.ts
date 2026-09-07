import clsx from "clsx";
import { composeEventHandlers, composeMainThreadEventHandlers } from "./compose-event-handlers";
import { mergeRefs, mergeMainThreadRefs } from "./merge-refs";

type Props = Record<string, any>;
type Merge<A, B> = Omit<A, keyof B> & {
  [K in keyof B]: undefined extends B[K]
    ? Exclude<B[K], undefined> | (K extends keyof A ? A[K] : undefined)
    : B[K];
};
type Merged<T extends object[], Result = {}> = T extends [
  infer First extends object,
  ...infer Rest extends object[],
]
  ? Merged<Rest, Merge<Result, First>>
  : Result;

const nativeEvent = /^(?:main-thread:)?(?:(?:capture|global)-)?(?:bind|catch)[a-z]/;
const callbackEvent = /^on[A-Z]/;

/**
 * Merges props without changing event threads or propagation modes.
 * Same-key handlers run last-source first, matching SEED React. Return values
 * and preventDefault do not cancel another handler. Ref cleanup is preserved.
 */
export function mergeProps<T extends object[]>(...sources: T): Merged<T> {
  const result: Props = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      const previous = result[key];
      if (key === "ref" || key === "main-thread:ref") {
        if (value == null) continue;
        const merge = key === "ref" ? mergeRefs : mergeMainThreadRefs;
        result[key] = previous ? merge(previous, value as any) : value;
      } else if (key === "className") {
        result[key] = clsx(previous, value as string);
      } else if (key === "style" && typeof value === "object" && value !== null) {
        result[key] = { ...(typeof previous === "object" ? previous : {}), ...value };
      } else if (nativeEvent.test(key) || callbackEvent.test(key)) {
        if (previous && value) {
          const compose = key.startsWith("main-thread:")
            ? composeMainThreadEventHandlers
            : composeEventHandlers;
          result[key] = compose(value as any, previous);
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result as Merged<T>;
}

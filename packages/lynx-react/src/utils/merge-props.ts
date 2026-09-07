import clsx from "clsx";
import { composeEventHandlers, composeMainThreadEventHandlers } from "./compose-event-handlers";
import { mergeRefs, mergeMainThreadRefs, type Ref } from "./merge-refs";

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
  const refs: Ref<unknown>[] = [];
  const mainThreadRefs: Ref<unknown>[] = [];
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      const previous = result[key];
      if (key === "ref" || key === "main-thread:ref") {
        if (value == null) continue;
        const targetRefs = key === "ref" ? refs : mainThreadRefs;
        targetRefs.push(value as Ref<unknown>);
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
  if (refs.length) result["ref"] = refs.length === 1 ? refs[0] : mergeRefs(...refs);
  if (mainThreadRefs.length) {
    result["main-thread:ref"] =
      mainThreadRefs.length === 1 ? mainThreadRefs[0] : mergeMainThreadRefs(...mainThreadRefs);
  }
  return result as Merged<T>;
}

type Cleanup = void | (() => void);
export type Ref<T> = { current: T | null } | ((value: T | null) => Cleanup);

function setRef<T>(ref: Ref<T>, value: T | null): Cleanup {
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}

function setMainThreadRef<T>(ref: Ref<T>, value: T | null): Cleanup {
  "main thread";
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}

export function mergeRefs<T>(...refs: Ref<T>[]): Ref<T> {
  return (value) => {
    const cleanups = refs.map((ref) => setRef(ref, value));
    return () => {
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index];
        if (cleanup) cleanup();
        else setRef(ref, null);
      });
    };
  };
}

export function mergeMainThreadRefs<T>(...refs: Ref<T>[]): Ref<T> {
  return (value) => {
    "main thread";
    const cleanups: Cleanup[] = [];
    // Indexed access preserves the captured array in the Main Thread compiler.
    for (let index = 0; index < refs.length; index++) {
      cleanups.push(setMainThreadRef(refs[index], value));
    }
    return () => {
      for (let index = 0; index < refs.length; index++) {
        const cleanup = cleanups[index];
        if (cleanup) cleanup();
        else setMainThreadRef(refs[index], null);
      }
    };
  };
}

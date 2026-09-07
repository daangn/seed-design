type Cleanup = void | (() => void);
type Ref<T> = { current: T | null } | ((value: T | null) => Cleanup);

function setRef<T>(ref: Ref<T>, value: T | null): Cleanup {
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}

function setMainThreadRef<T>(ref: Ref<T>, value: T | null): Cleanup {
  "main thread";
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}

export function mergeRefs<T>(first: Ref<T>, second: Ref<T>): Ref<T> {
  return (value) => {
    const cleanFirst = setRef(first, value);
    const cleanSecond = setRef(second, value);
    return () => {
      if (cleanFirst) cleanFirst();
      else setRef(first, null);
      if (cleanSecond) cleanSecond();
      else setRef(second, null);
    };
  };
}

export function mergeMainThreadRefs<T>(first: Ref<T>, second: Ref<T>): Ref<T> {
  return (value) => {
    "main thread";
    const cleanFirst = setMainThreadRef(first, value);
    const cleanSecond = setMainThreadRef(second, value);
    return () => {
      if (cleanFirst) cleanFirst();
      else setMainThreadRef(first, null);
      if (cleanSecond) cleanSecond();
      else setMainThreadRef(second, null);
    };
  };
}

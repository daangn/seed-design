export function memoize<Arg, Result>(fn: (arg: Arg) => Result): (arg: Arg) => Result {
  const cache = new Map<Arg, Result>();

  return (arg: Arg) => {
    if (cache.has(arg)) {
      return cache.get(arg) as Result;
    }

    const result = fn(arg);
    cache.set(arg, result);

    return result;
  };
}

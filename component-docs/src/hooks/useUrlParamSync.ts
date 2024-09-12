// hooks/useUrlParamSync.ts
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SetStateAction<T> = T | ((prevState: T) => T);
type SetStateFunction<T> = (value: SetStateAction<T>) => void;

interface UrlParamSyncOptions<T> {
  paramName: string;
  storeValue: T;
  setStoreValue: (value: T) => void;
  parse?: (value: string) => T;
}

export function useUrlParamSync<T>({
  paramName,
  storeValue,
  setStoreValue,
  parse = (value: string) => value as unknown as T,
}: UrlParamSyncOptions<T>): [T, SetStateFunction<T>] {
  const searchParams = useSearchParams();
  const [localValue, setLocalValue] = useState<T>(storeValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const paramValue = searchParams.get(paramName);
    if (paramValue) {
      const parsedValue = parse(paramValue);
      setLocalValue(parsedValue);
      setStoreValue(parsedValue);
    }
  }, [searchParams]);

  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  return [localValue, setLocalValue];
}

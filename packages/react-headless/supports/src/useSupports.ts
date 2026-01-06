import { useEffect, useState } from "react";

export function useSupports(selector: string) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSupported(CSS.supports(selector));
  }, [selector]);

  return isSupported;
}

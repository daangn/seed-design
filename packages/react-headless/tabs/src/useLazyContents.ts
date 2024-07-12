import { useEffect, useState } from "react";

export interface UseLazyContentsProps {
  currentValue: string;

  isLazy?: boolean;

  lazyMode?: "keepMounted" | "unmount";
}

interface LazyOptions {
  enabled?: boolean;
  isSelected?: boolean;
  wasSelected?: boolean;
  mode?: UseLazyContentsProps["lazyMode"];
}

function lazyDisclosure(options: LazyOptions) {
  const { enabled, isSelected, wasSelected, mode = "unmount" } = options;

  if (!enabled) return true;

  // if the disclosure is selected, render the disclosure's content
  if (isSelected) return true;

  // if the disclosure was selected but not active, keep its content active
  if (mode === "keepMounted" && wasSelected) return true;

  return false;
}

export function useLazyContents(props: UseLazyContentsProps) {
  const { currentValue, isLazy, lazyMode } = props;
  const [previousValues, setPreviousValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPreviousValues((prev) => ({
      ...prev,
      [currentValue]: true,
    }));
  }, [currentValue]);

  function shouldRender(value: string): boolean {
    return lazyDisclosure({
      enabled: isLazy,
      isSelected: value === currentValue,
      wasSelected: previousValues[value],
      mode: lazyMode,
    });
  }

  return {
    shouldRender,
  };
}

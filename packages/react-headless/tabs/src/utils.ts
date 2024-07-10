import type { UseTabsProps } from "./types";

interface LazyOptions {
  enabled?: UseTabsProps["isLazy"];
  isSelected?: boolean;
  wasSelected?: boolean;
  mode?: UseTabsProps["lazyMode"];
}

export function lazyDisclosure(options: LazyOptions) {
  const { enabled, isSelected, wasSelected, mode = "unmount" } = options;

  // if not lazy, always render the disclosure's content
  if (!enabled) return true;

  // if the disclosure is selected, render the disclosure's content
  if (isSelected) return true;

  // if the disclosure was selected but not active, keep its content active
  if (mode === "keepMounted" && wasSelected) return true;

  return false;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function pushUnique(arr: any[], value: any) {
  const newArr = arr.slice();
  const index = newArr.indexOf(value);
  if (index > -1) {
    newArr.splice(index, 1);
  }
  newArr.push(value);
  return newArr;
}

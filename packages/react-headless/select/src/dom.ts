// Disabled state is read off the rendered elements (aria-disabled)
// rather than a parallel registry: item registration lags render, so the DOM is
// the one source that is always in sync with the indices in `elementsRef`.
export const isDisabledElement = (element: HTMLElement | null) =>
  element == null || element.getAttribute("aria-disabled") === "true";

export const getOptionValue = (element: HTMLElement | null) =>
  element?.getAttribute("data-value") ?? null;

export function findSelectedIndex(elements: ReadonlyArray<HTMLElement | null>, value: string[]) {
  if (value.length === 0) return null;

  const index = elements.findIndex((element) => {
    const optionValue = getOptionValue(element);
    return optionValue != null && value.includes(optionValue);
  });
  return index === -1 ? null : index;
}

export function findFirstEnabledIndex(elements: ReadonlyArray<HTMLElement | null>) {
  const index = elements.findIndex((element) => !isDisabledElement(element));
  return index === -1 ? null : index;
}

export function findLastEnabledIndex(elements: ReadonlyArray<HTMLElement | null>) {
  for (let index = elements.length - 1; index >= 0; index--) {
    if (!isDisabledElement(elements[index] ?? null)) return index;
  }
  return null;
}

// Wrapping scan for the next enabled index in `delta` direction. Skips disabled
// options; may land back on `from` itself after a full cycle (single enabled item).
export function findEnabledIndex(
  elements: ReadonlyArray<HTMLElement | null>,
  from: number,
  delta: 1 | -1,
) {
  const { length } = elements;
  if (length === 0) return null;

  for (let step = 1; step <= length; step++) {
    const index = (((from + delta * step) % length) + length) % length;
    if (!isDisabledElement(elements[index] ?? null)) return index;
  }
  return null;
}

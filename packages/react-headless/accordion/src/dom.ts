export const getEnabledTriggerElements = (rootEl: HTMLElement | null) => {
  if (!rootEl) return [];

  return Array.from(rootEl.children).flatMap((child) => {
    if (!(child instanceof HTMLElement)) return [];

    const value = child.dataset.value;
    if (!value || child.hasAttribute("data-disabled")) return [];

    const trigger = Array.from(
      child.querySelectorAll<HTMLElement>("[aria-controls][data-value]"),
    ).find((candidate) => {
      return candidate.dataset.value === value && candidate.getAttribute("aria-disabled") !== "true";
    });

    return trigger ? [trigger] : [];
  });
};

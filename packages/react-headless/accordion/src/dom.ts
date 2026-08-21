export const getRootId = (id: string) => `accordion:${id}:root`;
export const getTriggerId = (value: string, id: string) => `accordion:${value}:${id}:trigger`;
export const getContentId = (value: string, id: string) => `accordion:${value}:${id}:content`;

function getRootElement(rootId: string) {
  return document.querySelector<HTMLElement>(`[data-accordion-root="${rootId}"]`);
}

function getTriggerElements(rootId: string) {
  const rootEl = getRootElement(rootId);
  if (!rootEl) return [];

  return Array.from(rootEl.querySelectorAll<HTMLElement>(`[data-ownedby="${rootId}"][data-value]`));
}

export const getEnabledTriggerElements = (rootId: string) => {
  return getTriggerElements(rootId).filter((trigger) => {
    return !trigger.hasAttribute("disabled") && trigger.getAttribute("aria-disabled") !== "true";
  });
};

export const getEnabledValues = (rootId: string) => {
  return getEnabledTriggerElements(rootId)
    .map((trigger) => trigger.getAttribute("data-value"))
    .filter((value): value is string => value != null);
};

export const getTriggerByValue = (rootId: string, value: string) => {
  return getEnabledTriggerElements(rootId).find((trigger) => {
    return trigger.getAttribute("data-value") === value;
  });
};

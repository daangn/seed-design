/* ID -----------------------------------------------------------------------
-------------------------------------------------------------------------------- */

export const getRootId = (id: string) => `tabs:${id}:root`;
export const getTabTriggerRootId = (value: string, id: string) =>
  `tabs:${value}:${id}:trigger-root`;
export const getTabTriggerLabelId = (value: string, id: string) =>
  `tabs:${value}:${id}:trigger-label`;
export const getTabTriggerNotificationId = (value: string, id: string) =>
  `tabs:${value}:${id}:trigger-notification`;
export const getTabTriggerListId = (id: string) => `tabs:${id}:trigger-list`;
export const getTabContentId = (value: string, id: string) => `tabs:${value}:${id}:content`;
export const getTabContentListId = (id: string) => `tabs:${id}:content-list`;
export const getTabContentCameraId = (id: string) => `tabs:${id}:content-camera`;
export const getIndicatorId = (id: string) => `tabs:${id}:indicator`;

/* Element -----------------------------------------------------------------------
-------------------------------------------------------------------------------- */

export const getRootEl = (id: string) => document.getElementById(getRootId(id));
export const getTabTriggerListEl = (id: string) => document.getElementById(getTabTriggerListId(id));
export const getTabTriggerEl = (value: string, id: string) =>
  document.getElementById(getTabTriggerRootId(value, id));
export const getTabContentEl = (value: string, id: string) =>
  document.getElementById(getTabContentId(value, id));
export const getTabContentListEl = (id: string) => document.getElementById(getTabContentListId(id));
export const getTabContentCameraEl = (id: string) =>
  document.getElementById(getTabContentCameraId(id));
export const getIndicatorEl = (id: string) => document.getElementById(getIndicatorId(id));

export const getDisabledElements = (id: string) => {
  const triggerListId = getTabTriggerListId(id);
  const triggerListEl = getTabTriggerListEl(id);
  const selector = `[role=tab][data-ownedby='${triggerListId}'][aria-disabled=true]`;
  return queryAll(triggerListEl, selector);
};

/* Utils -----------------------------------------------------------------------
-------------------------------------------------------------------------------- */

type Root = Document | Element | null | undefined;

export function queryAll<T extends Element = HTMLElement>(root: Root, selector: string) {
  return Array.from(root?.querySelectorAll<T>(selector) ?? []);
}

export function query<T extends Element = HTMLElement>(root: Root, selector: string) {
  return root?.querySelector<T>(selector) ?? null;
}

export type ItemToId<T> = (v: T) => string;

export const defaultItemToId = <T extends HTMLElement>(v: T) => v.id;
export function itemById<T extends HTMLElement>(
  v: T[],
  id: string,
  itemToId: ItemToId<T> = defaultItemToId,
) {
  return v.find((item) => itemToId(item) === id);
}

export const getAllValues = (id: string) => {
  const el = getTabTriggerListEl(id);

  if (!el) return [];
  return Array.from(el.children)
    .map((child) => child.getAttribute("data-value"))
    .filter(Boolean);
};

export const getEnabledValues = (id: string) => {
  const el = getTabTriggerListEl(id);

  if (!el) return [];
  return Array.from(el.children)
    .filter((child) => !child.hasAttribute("aria-disabled"))
    .map((child) => child.getAttribute("data-value"))
    .filter(Boolean);
};

export const getTabIndex = (value: string, id: string) => {
  const values = getAllValues(id);
  return values.indexOf(value);
};

export const getTabIndexOnlyEnabled = (value: string, id: string) => {
  const values = getEnabledValues(id);
  return values.indexOf(value);
};

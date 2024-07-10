/* ID */
export const getRootId = (id: string) => `tabs:${id}:root`;
export const getTabContentId = (value: string, id: string) => `tabs:${value}:${id}:content`;
export const getTabContentListId = (id: string) => `tabs:${id}:content-list`;
export const getTabContentCameraId = (id: string) => `tabs:${id}:content-camera`;

/* Element */
export const getRootEl = (id: string) => document.getElementById(getRootId(id));
export const getTabContentEl = (value: string, id: string) =>
  document.getElementById(getTabContentId(value, id));
export const getTabContentListEl = (id: string) => document.getElementById(getTabContentListId(id));
export const getTabContentCameraEl = (id: string) =>
  document.getElementById(getTabContentCameraId(id));

/* Index */
export const getTabIndex = (value: string, id: string) => {
  const el = getTabContentEl(value, id);
  if (!el) return -1;
  return Array.from(el.parentElement.children).indexOf(el);
};

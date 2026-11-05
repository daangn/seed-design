// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/isScrollable.ts

export function isScrollable(node: Element | null, checkForOverflow?: boolean): boolean {
  if (!node) return false;

  const style = window.getComputedStyle(node);
  const root = document.scrollingElement ?? document.documentElement;
  let scrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);

  // Root element has `visible` overflow by default, but is scrollable nonetheless.
  if (node === root && style.overflow !== "hidden") {
    scrollable = true;
  }

  if (scrollable && checkForOverflow) {
    scrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
  }

  return scrollable;
}

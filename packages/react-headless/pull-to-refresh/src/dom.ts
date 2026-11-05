const PREVENT_PULL_ATTRIBUTE = "data-seed-pull-to-refresh-prevent-pull";

export const pullToRefreshPreventPull = {
  [PREVENT_PULL_ATTRIBUTE]: "",
};

export const isPullPrevented = (el: HTMLElement): boolean => {
  return el.closest(`[${PREVENT_PULL_ATTRIBUTE}]`) != null;
};

const isScrollableY = (el: Element) =>
  el.scrollHeight > el.clientHeight && ["auto", "scroll"].includes(getComputedStyle(el).overflowY);

/**
 * The element that will actually absorb vertical scrolling for a touch on `from`,
 * searching up to and including `root`.
 *
 * A pull may only begin when that element sits at its top, and it is often not
 * `root` itself: a layout whose scroller is a descendant leaves `root.scrollTop`
 * pinned at 0, which would read as "at the top" no matter how far the real
 * scroller had travelled. Falls back to `root` when nothing scrolls, where a
 * pull is unambiguous.
 */
export function findScroller(from: Element, root: Element): Element {
  let el: Element | null = from;

  while (el) {
    if (isScrollableY(el)) return el;
    if (el === root) break;

    el = el.parentElement;
  }

  return root;
}

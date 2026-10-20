export function getPrevIndex(index: number, length: number): number {
  if (length <= 0) {
    throw new Error("Length must be a positive number.");
  }
  return (index - 1 + length) % length;
}

export function getNextIndex(index: number, length: number): number {
  if (length <= 0) {
    throw new Error("Length must be a positive number.");
  }
  return (index + 1) % length;
}

// Helper function to scroll tab into view
export function scrollTabIntoView(tabElement: HTMLElement, listElement: HTMLElement) {
  const isHorizontal = listElement.getAttribute("aria-orientation") !== "vertical";

  // The list's CSS `scroll-padding` marks edges that are inside the scrollport but obscured,
  // such as a safe area inset the list extends into; a tab there is not in view. The tab's
  // `scroll-margin` is the room to leave beside it once scrolled into view.
  const listStyle = getComputedStyle(listElement);
  const tabStyle = getComputedStyle(tabElement);
  // FIXME: A percentage `scroll-padding` keeps its `%` in the computed value, so `20%` reads as
  // 20px, and a `calc()` mixing `%` reads as 0. Resolve them against the scrollport size.
  const toPx = (value: string) => Number.parseFloat(value) || 0;

  if (isHorizontal) {
    const tabLeft = tabElement.offsetLeft - toPx(tabStyle.scrollMarginLeft);
    const tabRight =
      tabElement.offsetLeft + tabElement.offsetWidth + toPx(tabStyle.scrollMarginRight);
    const listScrollLeft = listElement.scrollLeft;
    const listWidth = listElement.clientWidth;
    const insetLeft = toPx(listStyle.scrollPaddingLeft);
    const insetRight = toPx(listStyle.scrollPaddingRight);

    if (tabLeft < listScrollLeft + insetLeft) {
      listElement.scrollTo({
        left: Math.max(0, tabLeft - insetLeft),
        behavior: "smooth",
      });
    } else if (tabRight > listScrollLeft + listWidth - insetRight) {
      listElement.scrollTo({
        left: tabRight - listWidth + insetRight,
        behavior: "smooth",
      });
    }
  } else {
    const tabTop = tabElement.offsetTop - toPx(tabStyle.scrollMarginTop);
    const tabBottom =
      tabElement.offsetTop + tabElement.offsetHeight + toPx(tabStyle.scrollMarginBottom);
    const listScrollTop = listElement.scrollTop;
    const listHeight = listElement.clientHeight;
    const insetTop = toPx(listStyle.scrollPaddingTop);
    const insetBottom = toPx(listStyle.scrollPaddingBottom);

    if (tabTop < listScrollTop + insetTop) {
      listElement.scrollTo({
        top: Math.max(0, tabTop - insetTop),
        behavior: "smooth",
      });
    } else if (tabBottom > listScrollTop + listHeight - insetBottom) {
      listElement.scrollTo({
        top: tabBottom - listHeight + insetBottom,
        behavior: "smooth",
      });
    }
  }
}

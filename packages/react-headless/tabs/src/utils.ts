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
export function scrollTabIntoView(
  tabElement: HTMLElement,
  listElement: HTMLElement,
  options?: { scrollPadding?: number },
) {
  const isHorizontal = listElement.getAttribute("aria-orientation") !== "vertical";
  // Default padding is 16px if not specified
  const scrollPadding = options?.scrollPadding ?? 16;

  // The list's CSS `scroll-padding` marks edges that are inside the scrollport but obscured,
  // such as a safe area inset the list extends into; a tab there is not in view.
  const listStyle = getComputedStyle(listElement);
  const toPx = (value: string) => Number.parseFloat(value) || 0;

  if (isHorizontal) {
    const tabLeft = tabElement.offsetLeft;
    const tabRight = tabLeft + tabElement.offsetWidth;
    const listScrollLeft = listElement.scrollLeft;
    const listWidth = listElement.clientWidth;
    const insetLeft = toPx(listStyle.scrollPaddingLeft);
    const insetRight = toPx(listStyle.scrollPaddingRight);

    if (tabLeft < listScrollLeft + insetLeft) {
      // Tab is to the left of the visible area - scroll a bit more to the left
      listElement.scrollTo({
        left: Math.max(0, tabLeft - insetLeft - scrollPadding),
        behavior: "smooth",
      });
    } else if (tabRight > listScrollLeft + listWidth - insetRight) {
      // Tab is to the right of the visible area - scroll a bit more to the right
      listElement.scrollTo({
        left: tabRight - listWidth + insetRight + scrollPadding,
        behavior: "smooth",
      });
    }
  } else {
    const tabTop = tabElement.offsetTop;
    const tabBottom = tabTop + tabElement.offsetHeight;
    const listScrollTop = listElement.scrollTop;
    const listHeight = listElement.clientHeight;
    const insetTop = toPx(listStyle.scrollPaddingTop);
    const insetBottom = toPx(listStyle.scrollPaddingBottom);

    if (tabTop < listScrollTop + insetTop) {
      // Tab is above the visible area - scroll a bit more up
      listElement.scrollTo({
        top: Math.max(0, tabTop - insetTop - scrollPadding),
        behavior: "smooth",
      });
    } else if (tabBottom > listScrollTop + listHeight - insetBottom) {
      // Tab is below the visible area - scroll a bit more down
      listElement.scrollTo({
        top: tabBottom - listHeight + insetBottom + scrollPadding,
        behavior: "smooth",
      });
    }
  }
}

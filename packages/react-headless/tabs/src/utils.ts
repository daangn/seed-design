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

  if (isHorizontal) {
    const tabLeft = tabElement.offsetLeft;
    const tabRight = tabLeft + tabElement.offsetWidth;
    const listScrollLeft = listElement.scrollLeft;
    const listWidth = listElement.clientWidth;
    const listRight = listScrollLeft + listWidth;

    if (tabLeft < listScrollLeft) {
      // Tab is to the left of the visible area - scroll a bit more to the left
      listElement.scrollTo({
        left: Math.max(0, tabLeft - scrollPadding),
        behavior: "smooth",
      });
    } else if (tabRight > listRight) {
      // Tab is to the right of the visible area - scroll a bit more to the right
      listElement.scrollTo({
        left: tabRight - listWidth + scrollPadding,
        behavior: "smooth",
      });
    }
  } else {
    const tabTop = tabElement.offsetTop;
    const tabBottom = tabTop + tabElement.offsetHeight;
    const listScrollTop = listElement.scrollTop;
    const listHeight = listElement.clientHeight;
    const listBottom = listScrollTop + listHeight;

    if (tabTop < listScrollTop) {
      // Tab is above the visible area - scroll a bit more up
      listElement.scrollTo({
        top: Math.max(0, tabTop - scrollPadding),
        behavior: "smooth",
      });
    } else if (tabBottom > listBottom) {
      // Tab is below the visible area - scroll a bit more down
      listElement.scrollTo({
        top: tabBottom - listHeight + scrollPadding,
        behavior: "smooth",
      });
    }
  }
}

import { describe, expect, it, mock } from "bun:test";

import { scrollTabIntoView } from "./utils";

// happy-dom doesn't lay out, so the geometry scrollTabIntoView reads is stubbed.
function setUp({
  tabLeft,
  tabWidth = 100,
  scrollLeft = 0,
  listWidth = 400,
  scrollPaddingLeft,
  scrollPaddingRight,
  scrollMarginInline = "16px",
}: {
  tabLeft: number;
  tabWidth?: number;
  scrollLeft?: number;
  listWidth?: number;
  scrollPaddingLeft?: string;
  scrollPaddingRight?: string;
  scrollMarginInline?: string;
}) {
  const list = document.createElement("div");
  const tab = document.createElement("button");
  list.appendChild(tab);
  document.body.appendChild(list);

  if (scrollPaddingLeft) list.style.scrollPaddingLeft = scrollPaddingLeft;
  if (scrollPaddingRight) list.style.scrollPaddingRight = scrollPaddingRight;
  if (scrollMarginInline) {
    tab.style.scrollMarginLeft = scrollMarginInline;
    tab.style.scrollMarginRight = scrollMarginInline;
  }

  Object.defineProperty(tab, "offsetLeft", { value: tabLeft });
  Object.defineProperty(tab, "offsetWidth", { value: tabWidth });
  Object.defineProperty(list, "scrollLeft", { value: scrollLeft });
  Object.defineProperty(list, "clientWidth", { value: listWidth });

  const scrollTo = mock();
  list.scrollTo = scrollTo;

  return { list, tab, scrollTo };
}

describe("scrollTabIntoView", () => {
  it("should scroll a tab past the end edge to sit its scroll-margin inside it", () => {
    const { list, tab, scrollTo } = setUp({ tabLeft: 350 });

    scrollTabIntoView(tab, list);

    expect(scrollTo).toHaveBeenCalledWith({ left: 66, behavior: "smooth" });
  });

  it("should align a tab without scroll-margin flush with the edge", () => {
    const { list, tab, scrollTo } = setUp({ tabLeft: 350, scrollMarginInline: "" });

    scrollTabIntoView(tab, list);

    expect(scrollTo).toHaveBeenCalledWith({ left: 50, behavior: "smooth" });
  });

  it("should treat the end scroll-padding as outside the visible area", () => {
    const { list, tab, scrollTo } = setUp({ tabLeft: 260, scrollPaddingRight: "84px" });

    scrollTabIntoView(tab, list);

    expect(scrollTo).toHaveBeenCalledWith({ left: 60, behavior: "smooth" });
  });

  it("should treat the start scroll-padding as outside the visible area", () => {
    const { list, tab, scrollTo } = setUp({
      tabLeft: 250,
      scrollLeft: 200,
      scrollPaddingLeft: "84px",
    });

    scrollTabIntoView(tab, list);

    expect(scrollTo).toHaveBeenCalledWith({ left: 150, behavior: "smooth" });
  });

  it("should not scroll a tab that is fully inside the visible area", () => {
    const { list, tab, scrollTo } = setUp({
      tabLeft: 100,
      scrollPaddingLeft: "84px",
      scrollPaddingRight: "84px",
    });

    scrollTabIntoView(tab, list);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});

import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import { ScrollFog } from "./ScrollFog";

function getScrollView(container: HTMLElement): Element {
  const scrollView = container.querySelector("scroll-view");
  if (!scrollView) {
    throw new Error("scroll-view가 렌더되어야 합니다.");
  }
  return scrollView;
}

describe("ScrollFog", () => {
  it("renders a vertical scroll-view with the default fog and scrollbar", () => {
    const { container } = render(
      <ScrollFog>
        <text>Content</text>
      </ScrollFog>,
    );

    const scrollView = getScrollView(container);
    expect(scrollView).toHaveAttribute("scroll-orientation", "vertical");
    expect(scrollView).toHaveAttribute("fading-edge-length", "20px");
    expect(scrollView).toHaveAttribute("scroll-bar-enable", "true");
    expect(scrollView.querySelector("text")?.textContent).toBe("Content");
  });

  it("maps horizontal placement to the horizontal native orientation", () => {
    const { container } = render(<ScrollFog placement={["left", "right"]} />);

    expect(getScrollView(container)).toHaveAttribute("scroll-orientation", "horizontal");
  });

  it("converts numeric sizes to px and preserves string sizes", () => {
    const numeric = render(<ScrollFog size={32} />);
    expect(getScrollView(numeric.container)).toHaveAttribute("fading-edge-length", "32px");

    const string = render(<ScrollFog size="1.5rem" />);
    expect(getScrollView(string.container)).toHaveAttribute("fading-edge-length", "1.5rem");
  });

  it("hides the native scrollbar when requested", () => {
    const { container } = render(<ScrollFog hideScrollBar />);

    expect(getScrollView(container)).toHaveAttribute("scroll-bar-enable", "false");
  });

  it("forwards native props, events, classes, styles, and refs to the same scroll-view", () => {
    const bindscroll = vi.fn();
    const scrollRef = createRef<NodesRef>();
    const { container } = render(
      <ScrollFog
        ref={scrollRef}
        id="scroll-fog"
        bounces={false}
        className="custom-scroll"
        style={{ height: "100px" }}
        bindscroll={bindscroll}
      />,
    );

    const scrollView = getScrollView(container);
    expect(scrollView).toHaveAttribute("id", "scroll-fog");
    expect(scrollView).toHaveAttribute("bounces", "false");
    expect(scrollView).toHaveClass("custom-scroll");
    expect(scrollView).toHaveStyle({ height: "100px" });
    if (!scrollRef.current) {
      throw new Error("scroll-view NodesRef가 연결되어야 합니다.");
    }

    fireEvent.scroll(scrollRef.current as unknown as HTMLElement, {});
    expect(bindscroll).toHaveBeenCalledTimes(1);
  });
});

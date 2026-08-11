import { act, fireEvent, render } from "@testing-library/react";
import { vars } from "@seed-design/css/vars";
import { afterEach, beforeEach, describe, expect, it, jest, mock } from "bun:test";
import * as React from "react";
import { ScrollAutoHide } from "./scroll-auto-hide";

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const originalMatchMedia = window.matchMedia;
const originalResizeObserver = window.ResizeObserver;
const originalGetComputedStyle = window.getComputedStyle;

let prefersReducedMotion = false;
let rootHeight = 100;

class ResizeObserverMock {
  observe = mock();
  unobserve = mock();
  disconnect = mock();
}

function renderScrollAutoHide({
  asChild = false,
  supportsScrollEnd = true,
}: {
  asChild?: boolean;
  supportsScrollEnd?: boolean;
} = {}) {
  const scrollContainerRef: React.RefObject<HTMLDivElement | null> = { current: null };
  const rootRef = React.createRef<HTMLElement>();
  const setScrollContainerRef = (node: HTMLDivElement | null) => {
    scrollContainerRef.current = node;
    if (node) {
      Object.defineProperty(node, "onscrollend", {
        configurable: true,
        value: supportsScrollEnd ? null : undefined,
      });
    }
  };

  const result = render(
    <div ref={setScrollContainerRef} data-testid="scroll-container">
      {asChild ? (
        <ScrollAutoHide ref={rootRef} scrollContainerRef={scrollContainerRef} asChild>
          <nav data-testid="root" aria-label="필터">
            <button type="button">필터</button>
          </nav>
        </ScrollAutoHide>
      ) : (
        <ScrollAutoHide
          ref={rootRef}
          scrollContainerRef={scrollContainerRef}
          data-testid="root"
          aria-label="필터"
          className="consumer-class"
        >
          <button type="button">필터</button>
        </ScrollAutoHide>
      )}
    </div>,
  );

  const scrollContainer = result.getByTestId("scroll-container");
  const root = result.getByTestId("root");
  return { ...result, root, rootRef, scrollContainer };
}

function scrollTo(scrollContainer: HTMLElement, scrollTop: number) {
  scrollContainer.scrollTop = scrollTop;
  fireEvent.scroll(scrollContainer);
}

function partiallyHide(scrollContainer: HTMLElement, hiddenPixels: number) {
  scrollTo(scrollContainer, 200);
  scrollTo(scrollContainer, 100);
  scrollTo(scrollContainer, 100 + hiddenPixels);
}

function endTranslateTransition(root: HTMLElement) {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "translate" });
  fireEvent(root, event);
}

beforeEach(() => {
  prefersReducedMotion = false;
  rootHeight = 100;

  window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  window.matchMedia = mock(() => ({
    matches: prefersReducedMotion,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: mock(),
    removeEventListener: mock(),
    addListener: mock(),
    removeListener: mock(),
    dispatchEvent: mock(() => false),
  }));

  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    const isRoot = this.dataset.testid === "root";
    return {
      bottom: isRoot ? rootHeight : 400,
      height: isRoot ? rootHeight : 400,
      left: 0,
      right: 320,
      top: 0,
      width: 320,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
  };
});

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  window.matchMedia = originalMatchMedia;
  window.ResizeObserver = originalResizeObserver;
  window.getComputedStyle = originalGetComputedStyle;
  jest.useRealTimers();
});

describe("ScrollAutoHide", () => {
  it("표준 HTML 속성, className, ref를 루트 요소에 전달한다", () => {
    const { root, rootRef } = renderScrollAutoHide();

    expect(root.tagName).toBe("DIV");
    expect(root.getAttribute("aria-label")).toBe("필터");
    expect(root.className).toContain("consumer-class");
    expect(rootRef.current).toBe(root);
  });

  it("asChild를 사용하면 자식의 시맨틱 요소와 ref를 유지한다", () => {
    const { root, rootRef } = renderScrollAutoHide({ asChild: true });

    expect(root.tagName).toBe("NAV");
    expect(root.getAttribute("aria-label")).toBe("필터");
    expect(rootRef.current).toBe(root);
  });

  it("스크롤 거리만큼 따라 숨고 역방향에서는 다시 드러난다", () => {
    const { root, scrollContainer } = renderScrollAutoHide();

    scrollTo(scrollContainer, 40);
    expect(root.style.translate).toBe("0px -40px");

    scrollTo(scrollContainer, 15);
    expect(root.style.translate).toBe("0px -15px");
  });

  it("스크롤 종료 시 50%를 기준으로 SEED easing을 적용해 스냅한다", () => {
    const { root, scrollContainer } = renderScrollAutoHide();

    partiallyHide(scrollContainer, 60);
    fireEvent(scrollContainer, new Event("scrollend"));

    expect(root.style.translate).toBe("0px -100px");
    expect(root.style.transition).toContain(`translate 200ms ${vars.$timingFunction.enter}`);

    endTranslateTransition(root);
    expect(root.style.transition).toBe("");
    expect(root.style.willChange).toBe("");

    scrollTo(scrollContainer, 60);
    scrollTo(scrollContainer, 100);
    fireEvent(scrollContainer, new Event("scrollend"));
    expect(root.style.translate).toBe("0px 0px");
  });

  it("모션 감소 설정에서는 전환 없이 즉시 스냅한다", () => {
    prefersReducedMotion = true;
    const { root, scrollContainer } = renderScrollAutoHide();

    partiallyHide(scrollContainer, 60);
    fireEvent(scrollContainer, new Event("scrollend"));

    expect(root.style.translate).toBe("0px -100px");
    expect(root.style.transition).toBe("");
  });

  it("숨겨진 영역으로 포커스가 이동하면 즉시 드러난다", () => {
    const { getByRole, root, scrollContainer } = renderScrollAutoHide();

    scrollTo(scrollContainer, 100);
    fireEvent(scrollContainer, new Event("scrollend"));
    fireEvent.focusIn(getByRole("button"));

    expect(root.style.translate).toBe("0px 0px");
    expect(root.style.transition).toBe("");
  });

  it("키보드 스크롤 뒤에는 전환 없이 즉시 스냅한다", () => {
    const { getByRole, root, scrollContainer } = renderScrollAutoHide();

    scrollTo(scrollContainer, 200);
    fireEvent.keyDown(getByRole("button"), { key: "ArrowUp" });
    scrollTo(scrollContainer, 140);
    fireEvent(scrollContainer, new Event("scrollend"));

    expect(root.style.translate).toBe("0px 0px");
    expect(root.style.transition).toBe("");
  });

  it("진행 중인 스냅을 현재 화면 위치에서 중단하고 새 스크롤을 따른다", () => {
    const { root, scrollContainer } = renderScrollAutoHide();

    partiallyHide(scrollContainer, 60);
    fireEvent(scrollContainer, new Event("scrollend"));

    window.getComputedStyle = ((element: Element) => {
      const styles = originalGetComputedStyle(element);
      return new Proxy(styles, {
        get(target, property, receiver) {
          if (element === root && property === "translate") return "0px -70px";
          return Reflect.get(target, property, receiver);
        },
      });
    }) as typeof window.getComputedStyle;

    scrollTo(scrollContainer, 170);

    expect(root.style.translate).toBe("0px -80px");
    expect(root.style.transition).toBe("");
  });

  it("scrollend를 지원하지 않으면 마지막 스크롤 120ms 뒤 스냅한다", () => {
    jest.useFakeTimers();
    const { root, scrollContainer } = renderScrollAutoHide({ supportsScrollEnd: false });

    partiallyHide(scrollContainer, 60);
    expect(root.style.translate).toBe("0px -60px");

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(root.style.translate).toBe("0px -100px");
  });
});

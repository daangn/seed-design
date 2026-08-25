import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import type * as React from "react";

/**
 * CSS Modules는 테스트 환경에서 빈 객체로 들어오고, happy-dom은 `animation` 단축 속성을
 * `animation-name`으로 펼치지 못한다. `usePresence`가 퇴장 애니메이션을 실제로 감지하도록
 * 클래스 이름과 longhand 스타일을 대신 채워 넣는다.
 */
mock.module("./blur-swap.module.css", () => ({
  default: {
    root: "root",
    inline: "inline",
    content: "content",
    contentAuto: "contentAuto",
    layer: "layer",
  },
}));

const LAYER_STYLES = `
  .layer[data-state="open"] { animation-name: blurSwapEnter; animation-duration: 300ms; }
  .layer[data-state="closed"] { animation-name: blurSwapExit; animation-duration: 300ms; position: absolute; }
  .layer[data-initial][data-state="open"] { animation-name: none; }
`;

const { BlurSwap } = await import("./blur-swap");

const originalResizeObserver = window.ResizeObserver;
let styleElement: HTMLStyleElement;

class ResizeObserverMock {
  observe = mock();
  unobserve = mock();
  disconnect = mock();
}

function renderBlurSwap(props: Partial<React.ComponentProps<typeof BlurSwap>> = {}) {
  const { activeKey = "a", children = <span>A</span>, ...rest } = props;

  const result = render(
    <BlurSwap activeKey={activeKey} {...rest}>
      {children}
    </BlurSwap>,
  );

  const root = result.container.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error("root not rendered");

  return { ...result, root };
}

function swapTo(
  rerender: ReturnType<typeof renderBlurSwap>["rerender"],
  key: string,
  props: Partial<React.ComponentProps<typeof BlurSwap>> = {},
) {
  rerender(
    <BlurSwap activeKey={key} {...props}>
      <span>{key.toUpperCase()}</span>
    </BlurSwap>,
  );
}

function readLayers(root: HTMLElement) {
  return [...root.querySelectorAll(".layer")].map((layer) => ({
    text: layer.textContent,
    state: layer.getAttribute("data-state"),
    inert: layer.hasAttribute("inert"),
  }));
}

function finishExitAnimations(root: HTMLElement) {
  act(() => {
    for (const layer of root.querySelectorAll('.layer[data-state="closed"]')) {
      const event = new Event("animationend", { bubbles: true });
      Object.defineProperty(event, "animationName", { value: "blurSwapExit" });
      layer.dispatchEvent(event);
    }
  });
}

beforeEach(() => {
  window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  styleElement = document.createElement("style");
  styleElement.textContent = LAYER_STYLES;
  document.head.appendChild(styleElement);
});

afterEach(() => {
  window.ResizeObserver = originalResizeObserver;
  styleElement.remove();
});

describe("BlurSwap", () => {
  it("className과 style을 루트 요소에 전달한다", () => {
    const { root } = renderBlurSwap({ className: "consumer-class", style: { margin: "4px" } });

    expect(root.className).toContain("consumer-class");
    expect(root.style.margin).toBe("4px");
  });

  it("blur·offset·duration을 CSS 커스텀 프로퍼티로 내린다", () => {
    const { root } = renderBlurSwap({ blur: 12, offset: -20, duration: 450 });

    expect([
      root.style.getPropertyValue("--blur-swap-blur"),
      root.style.getPropertyValue("--blur-swap-offset"),
      root.style.getPropertyValue("--blur-swap-duration"),
    ]).toEqual(["12px", "-20px", "450ms"]);
  });

  it("마운트 첫 레이어는 등장 애니메이션을 건너뛴다", () => {
    const { root } = renderBlurSwap();
    const layer = root.querySelector(".layer");
    if (!(layer instanceof HTMLElement)) throw new Error("layer not rendered");

    expect(layer.hasAttribute("data-initial")).toBe(true);
    expect(getComputedStyle(layer).animationName).toBe("none");
  });

  it("activeKey가 바뀌면 나가는 콘텐츠를 inert로 남긴 채 새 콘텐츠를 함께 그린다", () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a" });

    swapTo(rerender, "b");

    expect(readLayers(root)).toEqual([
      { text: "A", state: "closed", inert: true },
      { text: "B", state: "open", inert: false },
    ]);
  });

  it("퇴장 애니메이션이 끝나야 나가는 콘텐츠를 DOM에서 뗀다", () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a" });

    swapTo(rerender, "b");
    expect(readLayers(root)).toHaveLength(2);

    finishExitAnimations(root);

    expect(readLayers(root)).toEqual([{ text: "B", state: "open", inert: false }]);
  });

  it("전환이 끝나기 전에 되돌아와도 같은 키를 두 번 그리지 않는다", () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a" });

    swapTo(rerender, "b");
    swapTo(rerender, "a");

    expect(readLayers(root)).toEqual([
      { text: "B", state: "closed", inert: true },
      { text: "A", state: "open", inert: false },
    ]);
  });

  it("size가 따라가기로 정한 축만 루트에 크기로 적는다", () => {
    const auto = renderBlurSwap({ size: "auto" });
    expect([auto.root.style.width, auto.root.style.height]).toEqual(["0px", "0px"]);
    auto.unmount();

    const height = renderBlurSwap({ size: "height" });
    expect([height.root.style.width, height.root.style.height]).toEqual(["", "0px"]);
    height.unmount();

    const none = renderBlurSwap({ size: "none" });
    expect([none.root.style.width, none.root.style.height]).toEqual(["", ""]);
  });
});

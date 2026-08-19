import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { LazyMotion, domAnimation } from "motion/react";
import type * as React from "react";
import { BlurSwap } from "./blur-swap";

const originalResizeObserver = window.ResizeObserver;

class ResizeObserverMock {
  observe = mock();
  unobserve = mock();
  disconnect = mock();
}

function renderBlurSwap(props: Partial<React.ComponentProps<typeof BlurSwap>> = {}) {
  const { activeKey = "a", children = <span data-testid="content">A</span>, ...rest } = props;

  const result = render(
    <LazyMotion features={domAnimation}>
      <BlurSwap activeKey={activeKey} {...rest}>
        {children}
      </BlurSwap>
    </LazyMotion>,
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
    <LazyMotion features={domAnimation}>
      <BlurSwap activeKey={key} {...props}>
        <span data-testid="content">{key.toUpperCase()}</span>
      </BlurSwap>
    </LazyMotion>,
  );
}

function readLayers(root: HTMLElement) {
  return [...root.querySelectorAll("[data-testid='content']")].map((content) => {
    const layer = content.parentElement;
    if (!(layer instanceof HTMLElement)) throw new Error("layer not rendered");

    return {
      text: content.textContent,
      inert: layer.hasAttribute("inert"),
      filter: layer.style.filter,
      transform: layer.style.transform,
    };
  });
}

beforeEach(() => {
  window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterEach(() => {
  window.ResizeObserver = originalResizeObserver;
});

describe("BlurSwap", () => {
  it("className과 style을 루트 요소에 전달한다", () => {
    const { root } = renderBlurSwap({ className: "consumer-class", style: { margin: "4px" } });

    expect(root.className).toContain("consumer-class");
    expect(root.style.margin).toBe("4px");
  });

  it("activeKey가 바뀌면 나가는 콘텐츠를 inert로 남긴 채 새 콘텐츠를 함께 그린다", () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a" });

    swapTo(rerender, "b");

    expect(readLayers(root).map(({ text, inert }) => ({ text, inert }))).toEqual([
      { text: "A", inert: true },
      { text: "B", inert: false },
    ]);
  });

  it("들어오는 콘텐츠는 blur와 이동을 건 상태에서 등장한다", () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a", blur: 12, offset: -20 });

    swapTo(rerender, "b", { blur: 12, offset: -20 });

    expect(readLayers(root).at(-1)).toEqual({
      text: "B",
      inert: false,
      filter: "blur(12px)",
      transform: "translateY(-20px)",
    });
  });

  it("전환이 끝나면 나가는 콘텐츠를 DOM에서 제거한다", async () => {
    const { root, rerender } = renderBlurSwap({ activeKey: "a", duration: 0 });

    swapTo(rerender, "b", { duration: 0 });
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));

    expect(readLayers(root).map(({ text }) => text)).toEqual(["B"]);
  });
});

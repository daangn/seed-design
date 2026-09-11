import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import * as React from "@lynx-js/react";
import { act, render, waitSchedule } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { Icon, IconSlotProvider, InternalIcon, PrefixIcon, SuffixIcon } from "./Icon";

const TestIcon = React.forwardRef<
  MainThread.Element,
  LynxIconElementProps & { children?: React.ReactNode }
>((props, ref) => {
  const { children, ...nativeProps } = props;

  return (
    <image {...nativeProps} {...(ref ? { "main-thread:ref": ref } : {})}>
      {children}
    </image>
  );
});
TestIcon.displayName = "TestIcon";

const MulticolorTestIcon = React.forwardRef<
  MainThread.Element,
  LynxIconElementProps & { children?: React.ReactNode }
>((props, ref) => <TestIcon {...props} ref={ref} />);
MulticolorTestIcon.displayName = "MulticolorTestIcon";
Object.assign(MulticolorTestIcon, {
  [Symbol.for("@seed-design/multicolor-icon")]: true,
});

function getSourceAndImage() {
  const source = elementTree.root?.querySelector<HTMLElement>("view");
  const image = source?.querySelector<HTMLElement>("image");

  if (!source || !image) {
    throw new Error("Expected icon source and image elements to exist.");
  }

  return { source, image };
}

function installMainThreadStyleMocks(getComputedColor: () => string) {
  let nextFrameId = 1;
  const frames = new Map<number, FrameRequestCallback>();

  lynxTestingEnv.mainThread.globalThis["SystemInfo"] = {
    ...SystemInfo,
    lynxSdkVersion: "3.5",
  };
  lynxTestingEnv.mainThread.globalThis["__GetComputedStyleByKey"] = getComputedColor;
  lynxTestingEnv.mainThread.globalThis["requestAnimationFrame"] = (
    callback: FrameRequestCallback,
  ) => {
    const frameId = nextFrameId;
    nextFrameId += 1;
    frames.set(frameId, callback);
    return frameId;
  };
  lynxTestingEnv.mainThread.globalThis["cancelAnimationFrame"] = (frameId: number) => {
    frames.delete(frameId);
  };

  const runNextFrame = (timestamp = 16) => {
    const nextFrame = frames.entries().next().value;
    if (!nextFrame) {
      throw new Error("Expected a scheduled animation frame.");
    }

    const [frameId, callback] = nextFrame;
    frames.delete(frameId);
    lynxTestingEnv.switchToMainThread();
    act(() => {
      callback(timestamp);
    });
    lynxTestingEnv.switchToBackgroundThread();
  };

  return { frames, runNextFrame };
}

describe("InternalIcon", () => {
  it("reads the updated computed color after dependency changes", async () => {
    let computedColor = "rgb(134, 139, 148)";
    const { frames, runNextFrame } = installMainThreadStyleMocks(() => computedColor);

    const renderIcon = (dependency: string) => (
      <InternalIcon icon={<TestIcon />} className={dependency} deps={[dependency]} />
    );
    const { rerender } = render(renderIcon("unchecked"), {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    const { image } = getSourceAndImage();

    rerender(renderIcon("checked"));
    await waitSchedule();

    expect(frames.size).toBe(1);
    // The immediate read uses the old native style; the next frame must refresh it.
    expect(image.getAttribute("tint-color")).toBe("rgb(134, 139, 148)");
    computedColor = "rgb(255, 102, 0)";
    runNextFrame();

    expect(image.getAttribute("tint-color")).toBe("rgb(255, 102, 0)");
  });

  it("coalesces pending frame syncs across rapid dependency changes", async () => {
    let computedColor = "rgb(134, 139, 148)";
    const { frames, runNextFrame } = installMainThreadStyleMocks(() => computedColor);
    const renderIcon = (dependency: string) => (
      <InternalIcon icon={<TestIcon />} className={dependency} deps={[dependency]} />
    );
    const { rerender } = render(renderIcon("unchecked"), {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    rerender(renderIcon("checked"));
    await waitSchedule();
    rerender(renderIcon("unchecked-again"));
    await waitSchedule();

    expect(frames.size).toBe(1);

    computedColor = "rgb(73, 80, 88)";
    runNextFrame();

    expect(getSourceAndImage().image.getAttribute("tint-color")).toBe("rgb(73, 80, 88)");
  });
});

describe("PrefixIcon", () => {
  it("does not tint marked multicolor icons", async () => {
    const { frames } = installMainThreadStyleMocks(() => "rgb(31, 35, 40)");

    render(<PrefixIcon icon={<MulticolorTestIcon />} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    expect(frames.size).toBe(0);
    expect(getSourceAndImage().image.getAttribute("tint-color")).toBeNull();
  });
});

describe("icon recipe ownership", () => {
  it.each([
    [Icon, "icon", "seed-icon"],
    [PrefixIcon, "prefixIcon", "seed-prefix-icon"],
    [SuffixIcon, "suffixIcon", "seed-suffix-icon"],
  ] as const)("keeps fallback styles exclusive to unbound %s", (Component, slot, baseClass) => {
    const { container, rerender } = render(<Component icon={<TestIcon />} />);
    expect(container.querySelector(`.${baseClass}`)).not.toBeNull();
    rerender(
      <IconSlotProvider value={{ classNames: { [slot]: "test-recipe-icon" }, deps: [] }}>
        <Component size={28} color="#2475e8" className="user-icon" icon={<TestIcon />} />
      </IconSlotProvider>,
    );
    const wrapper = container.querySelector(".test-recipe-icon")!;
    expect(wrapper.classList.contains(`${baseClass}-slot`)).toBe(true);
    expect(wrapper.classList.contains("user-icon")).toBe(true);
    expect(wrapper.classList.contains(baseClass)).toBe(false);
    expect(wrapper.getAttribute("style")).toContain("28px");
  });
});

// This checks generated CSS cascade only; native state/theme invalidation is verified separately.
describe("generated icon CSS import order", () => {
  const { JSDOM } = createRequire(`${process.cwd()}/package.json`)("jsdom") as {
    JSDOM: new (html: string) => { window: Window & typeof globalThis };
  };
  const base = readFileSync("../lynx-css/base.css", "utf8");
  const recipe = readFileSync("../lynx-css/recipes/callout.css", "utf8");

  it("keeps the legacy standalone fallback selectors", () => {
    const dom = new JSDOM(`<style>${base}</style><div class="seed-suffix-icon"></div>`);
    const style = dom.window.getComputedStyle(dom.window.document.querySelector("div")!);
    expect(style.width).toBe("var(--seed-suffix-icon-size)");
    expect(style.height).toBe("var(--seed-suffix-icon-size)");
    expect(style.color).toBe("var(--seed-suffix-icon-color, currentcolor)");
    dom.window.close();
  });

  it.each(["base-first", "recipe-first"])("preserves Callout slot styles with %s", (order) => {
    const dom = new JSDOM(`<style>${order === "base-first" ? base + recipe : recipe + base}</style>
      <div class="seed-suffix-icon-slot seed-callout__suffixIcon seed-callout__suffixIcon--tone_neutral"></div>`);
    const icon = dom.window.document.querySelector("div")!;
    const style = dom.window.getComputedStyle(icon);
    expect(style.width).toBe("var(--seed-dimension-x4)");
    expect(style.height).toBe("var(--seed-dimension-x4)");
    expect(style.color).toBe("var(--seed-color-fg-neutral)");
    expect(style.flexShrink).toBe("0");
    dom.window.close();
  });
});

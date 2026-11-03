import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { NextAppBarBackground, type NextAppBarRootProps } from "../src";
import { makeActivity } from "./fixtures";
import { getPart, getScreen, renderStack, settle } from "./harness";

const ACCESSORY_CLASS = "seed-next-app-bar__accessory";

const getAccessory = (screen: HTMLElement) =>
  getPart(screen, "app-bar")?.querySelector(`:scope > .${ACCESSORY_CLASS}`) ?? null;

const rectList = (rects: DOMRect[]) =>
  Object.assign(rects, { item: (index: number) => rects[index] ?? null });

// happy-dom has no layout, so the accessory reports the box a browser would; `visible: false` is
// how a browser reports it under a `display: none` ancestor.
function stubAccessoryBox({ height, visible = true }: { height: number; visible?: boolean }) {
  const rects = spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (
    this: HTMLElement,
  ) {
    return rectList(
      visible && this.classList.contains(ACCESSORY_CLASS) ? [new DOMRect(0, 0, 100, height)] : [],
    );
  });
  const box = spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, 0, 100, height),
  );

  return () => {
    rects.mockRestore();
    box.mockRestore();
  };
}

/**
 * happy-dom never calls back. Browsers deliver the first observation before the first paint;
 * a microtask stands in for that.
 */
class FirstObservationResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}

  observe() {
    queueMicrotask(() => this.callback([], this));
  }

  unobserve() {}

  disconnect() {}
}

function stubResizeObserver() {
  const original = window.ResizeObserver;
  window.ResizeObserver = FirstObservationResizeObserver;

  return () => {
    window.ResizeObserver = original;
  };
}

const renderWithAppBar = (appBarProps: NextAppBarRootProps) =>
  renderStack({
    activities: { A: makeActivity({ testId: "a", withAppBar: true, appBarProps }) },
    initialActivity: "A",
  });

describe("NextAppBar structure", () => {
  let restore: (() => void) | undefined;
  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it("제목 줄은 row slot 안에 있고, accessory가 없으면 accessory slot을 그리지 않는다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a", withAppBar: true }) },
      initialActivity: "A",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(getPart(screen, "app-bar-main")?.parentElement?.className).toContain(
      "seed-next-app-bar__row",
    );
    expect(getAccessory(screen)).toBeNull();
    expect(screen.style.getPropertyValue("--app-bar-accessory-height")).toBe("");
  });

  it("accessory 높이를 화면 root의 --app-bar-accessory-height에 쓰고, 없어지면 지운다", async () => {
    const restoreBox = stubAccessoryBox({ height: 48 });
    const restoreObserver = stubResizeObserver();
    restore = () => {
      restoreBox();
      restoreObserver();
    };

    const { container, unmount } = renderWithAppBar({ accessory: <div>tabs</div> });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(getAccessory(screen)?.textContent).toBe("tabs");
    expect(screen.style.getPropertyValue("--app-bar-accessory-height")).toBe("48px");

    unmount();
    expect(screen.style.getPropertyValue("--app-bar-accessory-height")).toBe("");
  });

  it("보이지 않는 accessory(getClientRects가 빈 경우)는 높이를 쓰지 않는다", async () => {
    restore = stubAccessoryBox({ height: 0, visible: false });

    const { container } = renderWithAppBar({ accessory: <div>tabs</div> });
    await settle(container);

    expect(getScreen(container, "a").style.getPropertyValue("--app-bar-accessory-height")).toBe("");
  });

  it("backgroundElement가 tone 배경을 대신한다", async () => {
    const { container } = renderWithAppBar({
      backgroundElement: <NextAppBarBackground material="translucent" />,
    });
    await settle(container);

    const background = getPart(getScreen(container, "a"), "app-bar-background");
    expect(background?.className).toContain("seed-next-app-bar-background__root");
    expect(background?.className).not.toContain("seed-next-app-bar__background");
  });
});

describe("NextAppBarBackground", () => {
  it.each([
    ["progressiveBlur", 8],
    ["transparent", 8],
    ["translucent", 1],
  ] as const)("material=%s는 blur 레이어 %d장과 tint 한 장을 그린다", async (material, layers) => {
    const { container } = renderWithAppBar({
      backgroundElement: <NextAppBarBackground material={material} />,
    });
    await settle(container);

    const background = getPart(getScreen(container, "a"), "app-bar-background");
    expect(background?.querySelectorAll(".seed-next-app-bar-background__blur")).toHaveLength(
      layers,
    );
    expect(background?.querySelectorAll(".seed-next-app-bar-background__tint")).toHaveLength(1);
    expect(background?.getAttribute("aria-hidden")).toBe("true");
  });
});

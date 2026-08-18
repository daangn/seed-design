import { describe, expect, it } from "bun:test";
import { makeActivity } from "./fixtures";
import { getPart, getScreen, renderStack, settle } from "./harness";

describe("NextAppScreen anatomy", () => {
  it("screen/screen-dim/screen-layer/screen-content 파츠를 렌더한다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(screen.dataset["part"]).toBe("screen");
    expect(getPart(screen, "screen-dim")).not.toBeNull();
    expect(getPart(screen, "screen-layer")).not.toBeNull();
    expect(getPart(screen, "screen-content")).not.toBeNull();

    // dim/layer/edge는 transition 상태 셀렉터(`[state] > &`)가 동작하도록 root의 직계 자식이다
    expect(getPart(screen, "screen-dim")?.parentElement).toBe(screen);
    expect(getPart(screen, "screen-layer")?.parentElement).toBe(screen);
  });

  it("recipe classname이 각 슬롯에 적용된다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a", withAppBar: true }) },
      initialActivity: "A",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(screen.className).toContain("seed-next-app-screen__root");
    expect(getPart(screen, "screen-layer")?.className).toContain("seed-next-app-screen__layer");
    expect(getPart(screen, "screen-content")?.className).toContain("seed-next-app-screen__content");
    expect(getPart(screen, "app-bar")?.className).toContain("seed-next-app-bar__root");
    expect(getPart(screen, "app-bar-background")?.className).toContain(
      "seed-next-app-bar__background",
    );
    expect(getPart(screen, "app-bar-main")?.className).toContain("seed-next-app-bar-main__root");
  });

  it("edge 파츠는 swipeBackArea=edge에서만 렌더된다", async () => {
    const { container } = renderStack({
      activities: {
        Edge: makeActivity({ testId: "edge", swipeBackArea: "edge" }),
      },
      initialActivity: "Edge",
    });
    await settle(container);
    expect(getPart(getScreen(container, "edge"), "screen-edge")).not.toBeNull();

    const { container: fullContainer } = renderStack({
      activities: { Full: makeActivity({ testId: "full", swipeBackArea: "full" }) },
      initialActivity: "Full",
    });
    await settle(fullContainer);
    expect(getPart(getScreen(fullContainer, "full"), "screen-edge")).toBeNull();

    const { container: noneContainer } = renderStack({
      activities: { None: makeActivity({ testId: "none", swipeBackArea: "none" }) },
      initialActivity: "None",
    });
    await settle(noneContainer);
    expect(getPart(getScreen(noneContainer, "none"), "screen-edge")).toBeNull();
  });

  it("AppBar는 layer 내부(transition unit)에 있다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a", withAppBar: true }) },
      initialActivity: "A",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    const layer = getPart(screen, "screen-layer");
    const appBar = getPart(screen, "app-bar");
    expect(appBar?.parentElement).toBe(layer);
  });

  it("root에 --z-index-base가 설정된다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(screen.style.getPropertyValue("--z-index-base")).toBe("0");
  });

  it("clipRadius를 root의 clip radius var로 내려보낸다 (number는 px)", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a", clipRadius: 55 }) },
      initialActivity: "A",
    });
    await settle(container);

    expect(
      getScreen(container, "a").style.getPropertyValue("--seed-next-app-screen-clip-radius"),
    ).toBe("55px");
  });

  it("clipRadius가 없으면 var를 쓰지 않는다 (recipe fallback인 0px = 클립 없음)", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
    });
    await settle(container);

    expect(
      getScreen(container, "a").style.getPropertyValue("--seed-next-app-screen-clip-radius"),
    ).toBe("");
  });

  it("plugin clipRadius가 stack 전역 기본값이 되고, 화면 prop이 이를 이긴다", async () => {
    const { container } = renderStack({
      activities: { Default: makeActivity({ testId: "default" }) },
      initialActivity: "Default",
      clipRadius: 55,
    });
    await settle(container);
    expect(
      getScreen(container, "default").style.getPropertyValue("--seed-next-app-screen-clip-radius"),
    ).toBe("55px");

    const { container: ownContainer } = renderStack({
      activities: { Own: makeActivity({ testId: "own", clipRadius: "2rem" }) },
      initialActivity: "Own",
      clipRadius: 55,
    });
    await settle(ownContainer);
    expect(
      getScreen(ownContainer, "own").style.getPropertyValue("--seed-next-app-screen-clip-radius"),
    ).toBe("2rem");
  });

  it("legacy 앱스크린 anatomy와 완전히 분리되어 있다 (legacy 엔진이 Next 파츠를 관측할 수 없다)", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a", withAppBar: true }),
        B: makeActivity({ testId: "b", withAppBar: true }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);

    // legacy findTransitionTargets / readTransitionStyle의 진입점들이 아무것도 찾지 못해야 한다
    expect(container.querySelector("[data-activity-is-top]")).toBeNull();
    expect(container.querySelector("[data-activity-id]")).toBeNull();
    expect(container.querySelector("[data-transition-state]")).toBeNull();
    expect(container.querySelector("[data-transition-style]")).toBeNull();
    for (const legacyPart of [
      "activity",
      "dim",
      "layer",
      "edge",
      "appBar",
      "appBarBackground",
      "appBarMain",
      "appBarIcon",
      "appBarCustom",
    ]) {
      expect(container.querySelector(`[data-part="${legacyPart}"]`)).toBeNull();
    }
  });

  it("휴지 상태에서 layer/content에 transform 계열 inline style이 없다 (fixed containing-block 보장)", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);

    const screen = getScreen(container, "b");
    const layer = getPart(screen, "screen-layer");
    const content = getPart(screen, "screen-content");

    for (const el of [screen, layer, content]) {
      expect(el?.style.transform).toBeFalsy();
      expect(el?.style.willChange).toBeFalsy();
      expect(el?.style.getPropertyValue("--seed-swipe-back-displacement")).toBe("");
    }
    expect(screen.dataset["screenState"]).toBe("idle");
  });
});

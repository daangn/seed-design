import type { ActivityComponentType } from "@stackflow/react";
import { describe, expect, it } from "bun:test";
import { makeActivity } from "./fixtures";
import { getScreen, poll, renderStack, settle } from "./harness";

describe("data-screen-state derivation", () => {
  it("push 직후: 새 화면은 push, 이전 화면은 push-behind", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      transitionDuration: 250,
    });
    await settle(container);

    await push("B");

    expect(getScreen(container, "b").dataset["screenState"]).toBe("push");
    await poll(() => {
      expect(getScreen(container, "a").dataset["screenState"]).toBe("push-behind");
    });
  });

  it("push 완료 후: top은 idle, 이전 화면은 idle-behind", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);

    expect(getScreen(container, "b").dataset["screenState"]).toBe("idle");
    expect(getScreen(container, "a").dataset["screenState"]).toBe("idle-behind");
  });

  it("pop 직후: 나가는 화면은 pop, 남는 화면은 pop-behind", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      transitionDuration: 250,
    });
    await push("B");
    await settle(container);

    await pop();

    expect(getScreen(container, "b").dataset["screenState"]).toBe("pop");
    expect(getScreen(container, "a").dataset["screenState"]).toBe("pop-behind");
  });

  it("pop 완료 후: 남은 화면이 idle로 돌아온다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);
    await pop();
    await poll(() => {
      expect(container.querySelector('[data-testid="b"]')).toBeNull();
    });

    expect(getScreen(container, "a").dataset["screenState"]).toBe("idle");
  });

  it("data-screen-ready: 마운트 직후에는 없고, 프레임이 지나면 붙는다", async () => {
    const { container } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
      },
      initialActivity: "A",
    });

    expect(getScreen(container, "a").dataset["screenReady"]).toBeUndefined();
    await poll(() => {
      expect(getScreen(container, "a").dataset["screenReady"]).toBeDefined();
    });
  });

  it("pop 중 pop: 나가는 화면들이 병렬로 pop 상태를 가진다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
        C: makeActivity({ testId: "c" }),
      },
      initialActivity: "A",
      transitionDuration: 250,
    });
    await push("B");
    await settle(container);
    await push("C");
    await settle(container);

    await pop();
    await pop();

    expect(getScreen(container, "c").dataset["screenState"]).toBe("pop");
    expect(getScreen(container, "b").dataset["screenState"]).toBe("pop");
    expect(getScreen(container, "a").dataset["screenState"]).toBe("pop-behind");

    await poll(() => {
      expect(container.querySelector('[data-testid="b"]')).toBeNull();
      expect(container.querySelector('[data-testid="c"]')).toBeNull();
    });
    expect(getScreen(container, "a").dataset["screenState"]).toBe("idle");
  });

  it("비-Next top 아래라도 자기 자신이 exit 중이면 pop 상태를 가진다", async () => {
    const PlainActivity: ActivityComponentType = () => <div data-testid="plain" />;
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
        C: PlainActivity,
      },
      initialActivity: "A",
      transitionDuration: 250,
    });
    await push("B");
    await settle(container);
    await push("C");
    // 비-Next top 아래의 화면은 idle이라 settle로는 C의 enter 완료를 알 수
    // 없다 — transitionDuration 경과를 직접 기다린다.
    await new Promise((resolve) => setTimeout(resolve, 300));

    await pop();
    await pop();

    expect(getScreen(container, "b").dataset["screenState"]).toBe("pop");
  });

  it("3-깊이 스택: 모든 비-top 화면이 behind 상태를 가진다", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
        C: makeActivity({ testId: "c" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);
    await push("C");
    await settle(container);

    expect(getScreen(container, "c").dataset["screenState"]).toBe("idle");
    expect(getScreen(container, "b").dataset["screenState"]).toBe("idle-behind");
    expect(getScreen(container, "a").dataset["screenState"]).toBe("idle-behind");
  });
});

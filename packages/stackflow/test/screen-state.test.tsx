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

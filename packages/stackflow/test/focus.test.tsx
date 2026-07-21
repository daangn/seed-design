import { describe, expect, it } from "bun:test";
import { makeActivity } from "./fixtures";
import { getPart, getScreen, poll, renderStack, settle } from "./harness";

describe("focus 관리", () => {
  it("enter 완료 후 top 화면의 layer로 포커스가 이동한다", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);

    const layerB = getPart(getScreen(container, "b"), "screen-layer");
    await poll(() => {
      expect(document.activeElement).toBe(layerB);
    });
  });

  it("behind 화면은 enter-done이어도 포커스를 훔치지 않고, top 복귀 시 다시 포커스된다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await push("B");
    await settle(container);

    // A는 enter-done 상태로 남아 있지만 top이 아니므로 포커스를 가지면 안 된다
    const layerA = getPart(getScreen(container, "a"), "screen-layer");
    expect(document.activeElement).not.toBe(layerA);

    await pop();
    await poll(() => {
      expect(container.querySelector('[data-testid="b"]')).toBeNull();
    });

    // A가 top으로 복귀하면 layer가 다시 포커스된다
    await poll(() => {
      expect(document.activeElement).toBe(getPart(getScreen(container, "a"), "screen-layer"));
    });
  });
});

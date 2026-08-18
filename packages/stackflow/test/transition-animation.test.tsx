/**
 * The WAAPI side of the transition: which element gets animated, with which
 * keyframes, for how long. The resting positions those keyframes land on are
 * the recipe's job and are asserted from CSS state in `screen-state.test.tsx`.
 */
import { describe, expect, it } from "bun:test";
import { fireEvent } from "@testing-library/react";
import { makeActivity } from "./fixtures";
import {
  createClock,
  getPart,
  getScreen,
  nextFrame,
  poll,
  renderStack,
  settle,
  touchInit,
} from "./harness";
import { isPlaying } from "../src/primitive/private/waapi";
import { animationsOn, finishAnimations, runningAnimationsOn } from "./waapi";

const HORIZONTAL_EASING = "cubic-bezier(0.2, 0.1, 0.21, 0.99)";
const ANDROID_ENTER_EASING = "cubic-bezier(0.23, 0.1, 0.32, 1)";

const layerOf = (container: HTMLElement, testId: string) =>
  getPart(getScreen(container, testId), "screen-layer") as HTMLElement;

const dimOf = (container: HTMLElement, testId: string) =>
  getPart(getScreen(container, testId), "screen-dim") as HTMLElement;

/** The animation a state change just started on `el`, with its options folded in. */
function latestAnimation(el: HTMLElement) {
  const all = animationsOn(el);
  const last = all[all.length - 1];
  if (!last) throw new Error("no animation recorded");

  return { keyframes: last.keyframes, ...last.options };
}

describe("horizontalSlide WAAPI", () => {
  it("push: top layer는 100%에서 제자리로, dim은 0에서 1로 350ms 동안", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [{ transform: "translate3d(100%, 0, 0)" }, { transform: "translate3d(0, 0, 0)" }],
      duration: 350,
      easing: HORIZONTAL_EASING,
      fill: "none",
    });
    expect(latestAnimation(dimOf(container, "b"))).toEqual({
      keyframes: [{ opacity: "0" }, { opacity: "1" }],
      duration: 350,
      easing: HORIZONTAL_EASING,
      fill: "none",
    });
  });

  it("push: behind layer는 제자리에서 -30%로 밀린다 (dim은 움직이지 않는다)", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");

    expect(latestAnimation(layerOf(container, "a")).keyframes).toEqual([
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(-30%, 0, 0)" },
    ]);
    expect(animationsOn(dimOf(container, "a"))).toHaveLength(0);
  });

  it("pop: 나가는 화면은 100%로, 남는 화면은 -30%에서 제자리로", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");
    await settle(container);
    await pop();

    expect(latestAnimation(layerOf(container, "b")).keyframes).toEqual([
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(100%, 0, 0)" },
    ]);
    expect(latestAnimation(dimOf(container, "b")).keyframes).toEqual([
      { opacity: "1" },
      { opacity: "0" },
    ]);
    expect(latestAnimation(layerOf(container, "a")).keyframes).toEqual([
      { transform: "translate3d(-30%, 0, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ]);
  });

  it("모든 상태 애니메이션은 fill: none이다 (취소돼도 CSS 정지 위치로 떨어지도록)", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");
    await settle(container);
    await pop();

    const fills = animationsOn(layerOf(container, "a")).map((record) => record.options.fill);
    expect(fills).toEqual(["none", "none"]);
  });
});

describe("verticalSlide / crossfade WAAPI", () => {
  it("verticalSlide push는 layer/dim을 반대 방향으로 300ms 동안 움직인다", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      theme: "android",
    });
    await settle(container);
    await push("B");

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [
        { opacity: "0", transform: "translate3d(0, 8vh, 0)" },
        { opacity: "1", transform: "translate3d(0, 0, 0)" },
      ],
      duration: 300,
      easing: ANDROID_ENTER_EASING,
      fill: "none",
    });
    expect(latestAnimation(dimOf(container, "b")).keyframes).toEqual([
      { opacity: "0", transform: "translate3d(0, -8vh, 0)" },
      { opacity: "1", transform: "translate3d(0, 0, 0)" },
    ]);
  });

  it("verticalSlide pop은 150ms linear로 나간다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      theme: "android",
    });
    await settle(container);
    await push("B");
    await settle(container);
    await pop();

    const { duration, easing } = latestAnimation(layerOf(container, "b"));
    expect({ duration, easing }).toEqual({ duration: 150, easing: "linear" });
  });

  it("verticalSlide / crossfade의 behind 화면은 아무 애니메이션도 받지 않는다", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b", transitionStyle: "crossfade" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");

    expect(getScreen(container, "a").dataset["screenState"]).toBe("push-behind");
    expect(animationsOn(layerOf(container, "a"))).toHaveLength(0);
  });

  it("crossfade는 layer opacity만 다룬다 (dim은 숨겨져 있어 대상이 아니다)", async () => {
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b", transitionStyle: "crossfade" }),
      },
      initialActivity: "A",
    });
    await settle(container);
    await push("B");

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [{ opacity: "0" }, { opacity: "1" }],
      duration: 300,
      easing: "ease-out",
      fill: "none",
    });
    expect(animationsOn(dimOf(container, "b"))).toHaveLength(0);
  });
});

describe("애니메이션 수명", () => {
  it("휴지 상태 진입은 애니메이션을 시작하지도, 진행 중인 것을 끊지도 않는다", async () => {
    // transitionDuration(80ms)이 모션(350ms)보다 짧다 — enter는 그래도 완주해야 한다
    const { container, push } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      transitionDuration: 80,
    });
    await settle(container);
    await push("B");

    const layer = layerOf(container, "b");
    expect(runningAnimationsOn(layer)).toHaveLength(1);

    await poll(() => {
      expect(getScreen(container, "b").dataset["screenState"]).toBe("idle");
    });

    expect(runningAnimationsOn(layer)).toHaveLength(1);
    expect(animationsOn(layer)).toHaveLength(1);
  });

  it("전환 도중 새 전환이 오면 이전 애니메이션을 취소하고 하나만 남긴다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({ testId: "b" }),
      },
      initialActivity: "A",
      transitionDuration: 80,
    });
    await settle(container);
    await push("B");

    const layer = layerOf(container, "b");
    await pop();

    expect(animationsOn(layer)).toHaveLength(2);
    expect(animationsOn(layer)[0].cancelled).toBe(true);
    expect(runningAnimationsOn(layer)).toHaveLength(1);
  });
});

describe("시작 keyframe 샘플링 조건", () => {
  // 이 판정이 틀리면 상태가 이미 목적지를 가리킨 뒤의 computed를 읽어,
  // "화면 밖에서 화면 밖으로" 가는 움직이지 않는 애니메이션이 만들어진다.
  const withState = (playState: AnimationPlayState) => ({ playState });

  it("재생 중일 때만 참이다", () => {
    expect(isPlaying(withState("running"))).toBe(true);
  });

  it("끝났거나 취소됐거나 아예 없으면 거짓이다", () => {
    expect(isPlaying(null)).toBe(false);
    expect(isPlaying(withState("finished"))).toBe(false);
    expect(isPlaying(withState("idle"))).toBe(false);
  });
});

describe("swipe back release WAAPI", () => {
  /**
   * Drag the top screen to `x` and let go. The clock is advanced by 1s first
   * so the release is judged on displacement alone — an unmeasured elapsed
   * time reads as an arbitrarily fast flick and always crosses velocity.
   */
  async function swipeTo(
    x: number,
    {
      popOnSwiped = false,
      transitionStyle,
    }: {
      popOnSwiped?: boolean;
      transitionStyle?: "horizontalSlide" | "verticalSlide" | "crossfade";
    } = {},
  ) {
    const stack = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }),
        B: makeActivity({
          testId: "b",
          transitionStyle,
          ...(popOnSwiped && {
            onSwipeBackEnd: ({ swiped }: { swiped: boolean }) => {
              if (swiped) stack.actions.pop();
            },
          }),
        }),
      },
      initialActivity: "A",
    });
    await settle(stack.container);
    await stack.push("B");
    await settle(stack.container);

    const clock = createClock();
    const edge = getPart(getScreen(stack.container, "b"), "screen-edge") as HTMLElement;
    fireEvent.touchStart(edge, touchInit(10, 300));
    clock.advance(1000);
    fireEvent.touchMove(edge, touchInit(x, 300));
    await nextFrame();
    fireEvent.touchEnd(edge, touchInit(x, 300));
    clock.restore();

    return stack;
  }

  it("임계값 미달 릴리즈는 손가락이 남긴 위치에서 제자리로 되돌린다", async () => {
    const { container } = await swipeTo(110);

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [{ transform: "translate3d(100px, 0, 0)" }, { transform: "translate3d(0, 0, 0)" }],
      duration: 350,
      easing: HORIZONTAL_EASING,
      fill: "none",
    });
    expect(latestAnimation(layerOf(container, "a")).keyframes[1]).toEqual({
      transform: "translate3d(-30%, 0, 0)",
    });

    finishAnimations();
  });

  it("임계값 초과 릴리즈는 top을 화면 밖으로, behind를 제자리로 보낸다", async () => {
    const { container } = await swipeTo(610);

    expect(latestAnimation(layerOf(container, "b")).keyframes).toEqual([
      { transform: "translate3d(600px, 0, 0)" },
      { transform: "translate3d(100%, 0, 0)" },
    ]);
    expect(latestAnimation(layerOf(container, "a")).keyframes[1]).toEqual({
      transform: "translate3d(0, 0, 0)",
    });
    expect(latestAnimation(dimOf(container, "b")).keyframes[1]).toEqual({ opacity: "0" });

    finishAnimations();
  });

  it("verticalSlide 완료 릴리즈는 그 스타일의 exit 위치·타이밍으로 마무리한다", async () => {
    const { container } = await swipeTo(610, { transitionStyle: "verticalSlide" });
    const ratio = 600 / 1024;

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [
        { opacity: `${1 - ratio}`, transform: `translate3d(0, calc(${ratio} * 8vh), 0)` },
        { opacity: "0", transform: "translate3d(0, 8vh, 0)" },
      ],
      duration: 150,
      easing: "linear",
      fill: "none",
    });
    expect(latestAnimation(dimOf(container, "b")).keyframes[1]).toEqual({
      opacity: "0",
      transform: "translate3d(0, -8vh, 0)",
    });
    // 이 스타일의 behind 화면은 제자리에 있으므로 릴리즈 대상도 아니다
    expect(animationsOn(layerOf(container, "a"))).toHaveLength(0);

    finishAnimations();
  });

  it("crossfade 취소 릴리즈는 opacity만 enter 타이밍으로 되돌린다", async () => {
    const { container } = await swipeTo(110, { transitionStyle: "crossfade" });
    const ratio = 100 / 1024;

    expect(latestAnimation(layerOf(container, "b"))).toEqual({
      keyframes: [{ opacity: `${1 - ratio}` }, { opacity: "1" }],
      duration: 300,
      easing: "ease-out",
      fill: "none",
    });
    expect(animationsOn(dimOf(container, "b"))).toHaveLength(0);

    finishAnimations();
  });

  it("제스처 중에는 상태 전환이 애니메이션을 겹쳐 걸지 않는다", async () => {
    const { container } = await swipeTo(610, { popOnSwiped: true });

    const behindLayer = layerOf(container, "a");
    // 릴리즈 애니메이션 1개뿐 — pop-behind 상태 전환이 두 번째를 걸면 안 된다
    expect(runningAnimationsOn(behindLayer)).toHaveLength(1);

    await poll(() => {
      expect(getScreen(container, "b").dataset["screenState"]).toBe("pop");
    });
    expect(runningAnimationsOn(behindLayer)).toHaveLength(1);

    finishAnimations();
  });
});

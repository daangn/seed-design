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
import type { NextAppScreenTransitionStyle } from "../src/primitive/NextAppScreen/types";
import { animationsOn, finishAnimations, runningAnimationsOn } from "./waapi";

const HORIZONTAL_EASING = "cubic-bezier(0.2, 0.1, 0.21, 0.99)";
const ANDROID_ENTER_EASING = "cubic-bezier(0.23, 0.1, 0.32, 1)";
const SCALE_SLIDE_SHRINK_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const RESTING = "translate3d(0, 0, 0)";

/** scaleSlide alone spells the top screen with the individual properties. */
const SCALE_SLIDE_RESTING = "0% 0 0";
const SCALE_SLIDE_OFFSCREEN_X = "100% 0 0";

/** 350ms 중 각 구간이 차지하는 몫 — shrink [0,.4] / travel [.3,1] / fade [.4,1] */
const SHRINK_MS = 140;
const TRAVEL_MS = 245;
const TRAVEL_DELAY_MS = 105;
const FADE_MS = 210;
const FADE_DELAY_MS = 140;

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

/** 방금 걸린 leg들 — 한 slot이 property별로 여러 개를 걸 수 있다. */
function recentAnimations(el: HTMLElement, count: number) {
  return animationsOn(el)
    .slice(-count)
    .map((record) => ({ keyframes: record.keyframes, ...record.options }));
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
  it("verticalSlide push는 layer를 300ms 동안 올리고 dim은 자리에서 띄운다", async () => {
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
      { opacity: "0" },
      { opacity: "1" },
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

describe("experimental_scaleSlide WAAPI", () => {
  const renderPair = () =>
    renderStack({
      activities: {
        A: makeActivity({ testId: "a", transitionStyle: "experimental_scaleSlide" }),
        B: makeActivity({ testId: "b", transitionStyle: "experimental_scaleSlide" }),
      },
      initialActivity: "A",
    });

  const contentOf = (container: HTMLElement, testId: string) =>
    getPart(getScreen(container, testId), "screen-content") as HTMLElement;

  it("pop: 축소가 먼저 시작하고, 축소가 끝나기 전에 이동이 출발한다 (구간이 겹친다)", async () => {
    const { container, push, pop } = renderPair();
    await settle(container);
    await push("B");
    await settle(container);
    await pop();

    // 카드째 줄어든다 — 축소·이동·페이드가 모두 layer 하나에 걸리고, 서로 다른
    // property라 덮어쓰지 않고 각자 자기 지연과 길이를 갖는다
    expect(recentAnimations(layerOf(container, "b"), 3)).toEqual([
      {
        keyframes: [{ translate: SCALE_SLIDE_RESTING }, { translate: SCALE_SLIDE_OFFSCREEN_X }],
        // 축소(0~140ms)가 끝나기 전인 105ms에 출발한다
        delay: TRAVEL_DELAY_MS,
        duration: TRAVEL_MS,
        easing: HORIZONTAL_EASING,
        // 지연 구간 동안 CSS의 목적지가 아니라 출발 keyframe을 붙잡는다
        fill: "backwards",
      },
      {
        keyframes: [{ opacity: "1" }, { opacity: "0" }],
        delay: FADE_DELAY_MS,
        duration: FADE_MS,
        easing: "linear",
        fill: "backwards",
      },
      {
        keyframes: [{ scale: "1" }, { scale: "0.9" }],
        duration: SHRINK_MS,
        easing: SCALE_SLIDE_SHRINK_EASING,
        fill: "none",
      },
    ]);
    // content는 더 이상 자기 모션을 갖지 않는다 — 앱바와 함께 카드에 실려 간다
    expect(animationsOn(contentOf(container, "b"))).toHaveLength(0);
  });

  it("push: pop의 모든 구간을 뒤집어 쓴다", async () => {
    const { container, push } = renderPair();
    await settle(container);
    await push("B");

    expect(recentAnimations(layerOf(container, "b"), 3)).toEqual([
      {
        keyframes: [{ translate: SCALE_SLIDE_OFFSCREEN_X }, { translate: SCALE_SLIDE_RESTING }],
        duration: TRAVEL_MS,
        easing: HORIZONTAL_EASING,
        fill: "none",
      },
      {
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
        duration: FADE_MS,
        easing: "linear",
        fill: "none",
      },
      {
        keyframes: [{ scale: "0.9" }, { scale: "1" }],
        delay: 350 - SHRINK_MS,
        duration: SHRINK_MS,
        easing: SCALE_SLIDE_SHRINK_EASING,
        fill: "backwards",
      },
    ]);
  });

  it("behind 화면은 horizontalSlide와 완전히 같다 (전 구간, 같은 타이밍)", async () => {
    const { container, push, pop } = renderPair();
    await settle(container);
    await push("B");

    expect(latestAnimation(layerOf(container, "a"))).toEqual({
      keyframes: [{ transform: RESTING }, { transform: "translate3d(-30%, 0, 0)" }],
      duration: 350,
      easing: HORIZONTAL_EASING,
      fill: "none",
    });

    await settle(container);
    await pop();
    expect(latestAnimation(layerOf(container, "a")).keyframes).toEqual([
      { transform: "translate3d(-30%, 0, 0)" },
      { transform: RESTING },
    ]);
  });

  it("전환이 끊기면 slot의 leg를 모두 취소하고 새 leg만 남긴다", async () => {
    const { container, push, pop } = renderPair();
    await settle(container);
    await push("B");

    const layer = layerOf(container, "b");
    await pop();

    expect(animationsOn(layer)).toHaveLength(6);
    expect(
      animationsOn(layer)
        .slice(0, 3)
        .map((record) => record.cancelled),
    ).toEqual([true, true, true]);
    expect(runningAnimationsOn(layer)).toHaveLength(3);
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
      transitionStyle?: NextAppScreenTransitionStyle;
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
    expect(latestAnimation(dimOf(container, "b")).keyframes[1]).toEqual({ opacity: "0" });
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

  describe("experimental_scaleSlide", () => {
    it("축소가 끝난 뒤 완료하면 이동/페이드만 남은 만큼 달리고 축소는 할 일이 없다", async () => {
      const { container } = await swipeTo(610, { transitionStyle: "experimental_scaleSlide" });
      const ratio = 600 / 1024;

      expect(recentAnimations(layerOf(container, "b"), 3)).toEqual([
        {
          keyframes: [
            { translate: `${((ratio - 0.3) / 0.7) * 100}% 0 0` },
            { translate: SCALE_SLIDE_OFFSCREEN_X },
          ],
          duration: 350,
          easing: HORIZONTAL_EASING,
          fill: "none",
        },
        {
          keyframes: [{ opacity: `${1 - (ratio - 0.4) / 0.6}` }, { opacity: "0" }],
          duration: 350,
          easing: HORIZONTAL_EASING,
          fill: "none",
        },
        // 손가락이 이미 지나온 구간은 0ms로 접힌다 — 되감지 않는다
        {
          keyframes: [{ scale: "0.9" }, { scale: "0.9" }],
          duration: 0,
          easing: HORIZONTAL_EASING,
          fill: "none",
        },
      ]);

      finishAnimations();
    });

    it("축소 도중 취소하면 축소만 되돌리고, 아직 시작도 안 한 이동/페이드는 0ms다", async () => {
      const { container } = await swipeTo(110, { transitionStyle: "experimental_scaleSlide" });
      const ratio = 100 / 1024;

      const legs = recentAnimations(layerOf(container, "b"), 3);
      expect(legs.map((leg) => leg.duration)).toEqual([0, 0, 350]);
      expect(legs[2]).toEqual({
        keyframes: [{ scale: `${1 - (ratio / 0.4) * 0.1}` }, { scale: "1" }],
        duration: 350,
        easing: HORIZONTAL_EASING,
        fill: "none",
      });

      finishAnimations();
    });

    it("전 구간을 되짚는 릴리즈는 각 구간이 제 몫의 시간을 가져간다", async () => {
      // exit guard: 완료했는데 consumer가 pop하지 않아 ratio 1에서 되돌아오는 경우
      const { container } = await swipeTo(610, { transitionStyle: "experimental_scaleSlide" });
      const layer = layerOf(container, "b");
      const before = animationsOn(layer).length;

      finishAnimations();
      await poll(() => {
        expect(animationsOn(layer).length).toBeGreaterThan(before);
      });

      // 이동이 먼저 제자리로, 페이드가 그 뒤를 따르고, 축소 복귀는 마지막에 — 나갈 때의 역순
      expect(
        recentAnimations(layer, 3).map(({ delay, duration }) => ({ delay, duration })),
      ).toEqual([
        { delay: undefined, duration: TRAVEL_MS },
        { delay: undefined, duration: FADE_MS },
        { delay: 350 - SHRINK_MS, duration: SHRINK_MS },
      ]);

      finishAnimations();
    });
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

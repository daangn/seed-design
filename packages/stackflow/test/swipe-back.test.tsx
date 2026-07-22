import { describe, expect, it, mock, spyOn } from "bun:test";
import { fireEvent } from "@testing-library/react";
import { makeActivity } from "./fixtures";
import { getPart, getScreen, getScreens, poll, renderStack, settle } from "./harness";

const DISPLACEMENT_VAR = "--seed-swipe-back-displacement";
const RATIO_VAR = "--seed-swipe-back-displacement-ratio";

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

/** Deterministic Date.now so velocity is controllable. */
function createClock() {
  let value = 100_000;
  const spy = spyOn(Date, "now").mockImplementation(() => value);

  return {
    advance: (ms: number) => {
      value += ms;
    },
    restore: () => spy.mockRestore(),
  };
}

const touchInit = (x: number, y: number) => ({
  touches: [{ clientX: x, clientY: y }],
  changedTouches: [{ clientX: x, clientY: y }],
});

function fireTransitionEnd(el: HTMLElement) {
  fireEvent.transitionEnd(el, { propertyName: "transform" });
}

interface SwipeSetupOptions {
  swipeBackArea?: "edge" | "full" | "none";
  transitionStyle?: "horizontalSlide" | "verticalSlide" | "crossfade";
  onSwipeBackStart?: () => void;
  onSwipeBackMove?: (props: { displacement: number; displacementRatio: number }) => void;
  onSwipeBackEnd?: (props: { swiped: boolean }) => void;
  popOnSwiped?: boolean;
  screens?: number;
}

async function setupSwipe(options: SwipeSetupOptions = {}) {
  const { screens = 2, popOnSwiped, ...screenProps } = options;

  // 스와이프 대상(top) activity에만 커스텀 props를 붙인다
  const topProps = {
    ...screenProps,
    ...(popOnSwiped && {
      onSwipeBackEnd: (payload: { swiped: boolean }) => {
        if (payload.swiped) stack.actions.pop();
        screenProps.onSwipeBackEnd?.(payload);
      },
    }),
  };

  const stack = renderStack({
    activities: {
      A: makeActivity({ testId: "a" }),
      B: makeActivity({ testId: "b", ...(screens === 2 ? topProps : {}) }),
      C: makeActivity({ testId: "c", ...(screens >= 3 ? topProps : {}) }),
    },
    initialActivity: "A",
  });

  if (screens >= 2) {
    await stack.push("B");
    await settle(stack.container);
  }
  if (screens >= 3) {
    await stack.push("C");
    await settle(stack.container);
  }

  const top = getScreen(stack.container, screens >= 3 ? "c" : "b");
  const behind = getScreen(stack.container, screens >= 3 ? "b" : "a");

  return {
    ...stack,
    top,
    behind,
    topLayer: getPart(top, "screen-layer") as HTMLElement,
    topDim: getPart(top, "screen-dim") as HTMLElement,
    behindLayer: getPart(behind, "screen-layer") as HTMLElement,
    edge: getPart(top, "screen-edge"),
  };
}

describe("swipe back — edge 모드", () => {
  it("스와이프 중 두 참여 화면 root에만 swiping 상태가 붙고, vars는 소비 element에 직접 써진다", async () => {
    const clock = createClock();
    const onSwipeBackMove = mock((_: { displacement: number; displacementRatio: number }) => {});
    try {
      const { container, edge, top, behind, topLayer, topDim, behindLayer } = await setupSwipe({
        screens: 3,
        transitionStyle: "horizontalSlide",
        onSwipeBackMove,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(16);
      fireEvent.touchMove(edge as HTMLElement, touchInit(110, 300));
      await nextFrame();

      expect(top.dataset["swipeBackState"]).toBe("swiping");
      expect(behind.dataset["swipeBackState"]).toBe("swiping");

      // 참여하지 않는 세 번째(최하단) 화면에는 아무것도 붙지 않는다
      const screenA = getScreen(container, "a");
      expect(screenA.dataset["swipeBackState"]).toBeUndefined();

      // vars: top layer / behind layer / top dim에 직접
      expect(topLayer.style.getPropertyValue(DISPLACEMENT_VAR)).toBe("100px");
      expect(behindLayer.style.getPropertyValue(DISPLACEMENT_VAR)).toBe("100px");
      expect(topDim.style.getPropertyValue(DISPLACEMENT_VAR)).toBe("100px");
      expect(Number(topLayer.style.getPropertyValue(RATIO_VAR))).toBeCloseTo(100 / 1024, 3);

      // stack root(GlobalInteraction 요소)에는 var가 없어야 한다 (legacy cascade 회귀 방지)
      const stackRoot = getScreens(container)[0].parentElement as HTMLElement;
      expect(stackRoot.style.getPropertyValue(DISPLACEMENT_VAR)).toBe("");

      // onSwipeBackMove payload
      expect(onSwipeBackMove).toHaveBeenCalledWith({
        displacement: 100,
        displacementRatio: 100 / 1024,
      });
    } finally {
      clock.restore();
    }
  });

  it("임계값 미달 릴리즈: canceling → transitionend 후 상태/vars 정리, swiped=false", async () => {
    const clock = createClock();
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    try {
      const { edge, top, behind, topLayer, topDim, behindLayer } = await setupSwipe({
        transitionStyle: "horizontalSlide",
        onSwipeBackEnd,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(200);
      fireEvent.touchMove(edge as HTMLElement, touchInit(110, 300)); // ratio 0.097, velocity 0.5
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(110, 300));

      expect(onSwipeBackEnd).toHaveBeenCalledWith({ swiped: false });
      expect(top.dataset["swipeBackState"]).toBe("canceling");
      expect(behind.dataset["swipeBackState"]).toBe("canceling");

      fireTransitionEnd(topLayer);

      expect(top.dataset["swipeBackState"]).toBeUndefined();
      expect(behind.dataset["swipeBackState"]).toBeUndefined();
      for (const el of [topLayer, topDim, behindLayer]) {
        expect(el.style.getPropertyValue(DISPLACEMENT_VAR)).toBe("");
        expect(el.style.getPropertyValue(RATIO_VAR)).toBe("");
      }
    } finally {
      clock.restore();
    }
  });

  it("ratio 임계값 초과 릴리즈: completing, swiped=true, pop 후에도 completing이 유지된다 (exit 애니메이션 억제)", async () => {
    const clock = createClock();
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    try {
      const { container, edge, top, behind } = await setupSwipe({
        transitionStyle: "horizontalSlide",
        onSwipeBackEnd,
        popOnSwiped: true,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(1000);
      fireEvent.touchMove(edge as HTMLElement, touchInit(510, 300)); // ratio 0.488 > 0.4
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(510, 300));

      expect(onSwipeBackEnd).toHaveBeenCalledWith({ swiped: true });
      expect(top.dataset["swipeBackState"]).toBe("completing");
      expect(behind.dataset["swipeBackState"]).toBe("completing");

      // 소비자가 pop → 나가는 화면은 pop 상태가 되지만 completing은 유지되어야 한다
      clock.restore();
      await poll(() => {
        expect(top.dataset["screenState"]).toBe("pop");
      });
      expect(top.dataset["swipeBackState"]).toBe("completing");

      // pop이 끝나면 뒤 화면이 idle top이 되고, 남은 swipe 상태는 self-clean된다
      await poll(() => {
        expect(container.querySelector('[data-testid="b"]')).toBeNull();
      });
      await poll(() => {
        expect(behind.dataset["screenState"]).toBe("idle");
        expect(behind.dataset["swipeBackState"]).toBeUndefined();
      });
    } finally {
      clock.restore();
    }
  });

  it("velocity 임계값 초과 릴리즈: 이동량이 작아도 swiped=true", async () => {
    const clock = createClock();
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    try {
      const { edge } = await setupSwipe({
        transitionStyle: "horizontalSlide",
        onSwipeBackEnd,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(50);
      fireEvent.touchMove(edge as HTMLElement, touchInit(210, 300)); // 200px/50ms = 4 px/ms
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(210, 300));

      expect(onSwipeBackEnd).toHaveBeenCalledWith({ swiped: true });
    } finally {
      clock.restore();
    }
  });

  it("transitionend가 안 와도 타임아웃으로 정리된다", async () => {
    const clock = createClock();
    try {
      const { edge, top, behind } = await setupSwipe({ transitionStyle: "horizontalSlide" });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(200);
      fireEvent.touchMove(edge as HTMLElement, touchInit(110, 300));
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(110, 300));
      clock.restore();

      expect(top.dataset["swipeBackState"]).toBe("canceling");
      await poll(
        () => {
          expect(top.dataset["swipeBackState"]).toBeUndefined();
          expect(behind.dataset["swipeBackState"]).toBeUndefined();
        },
        { timeout: 2000 },
      );
    } finally {
      clock.restore();
    }
  });

  it("release 중 re-grab: canceling에서 다시 잡으면 swiping으로 복귀한다", async () => {
    const clock = createClock();
    const onSwipeBackStart = mock(() => {});
    try {
      const { edge, top, behind } = await setupSwipe({
        transitionStyle: "horizontalSlide",
        onSwipeBackStart,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(200);
      fireEvent.touchMove(edge as HTMLElement, touchInit(110, 300));
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(110, 300));

      expect(top.dataset["swipeBackState"]).toBe("canceling");
      expect(onSwipeBackStart).toHaveBeenCalledTimes(1);

      // release가 끝나기 전 다시 터치
      fireEvent.touchStart(edge as HTMLElement, touchInit(30, 300));
      expect(top.dataset["swipeBackState"]).toBe("swiping");
      expect(behind.dataset["swipeBackState"]).toBe("swiping");
      expect(onSwipeBackStart).toHaveBeenCalledTimes(2);

      // re-grab 후에도 move/end가 정상 동작
      clock.advance(200);
      fireEvent.touchMove(edge as HTMLElement, touchInit(80, 300));
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(80, 300));
      expect(top.dataset["swipeBackState"]).toBe("canceling");
    } finally {
      clock.restore();
    }
  });

  it("gesture-start transitionStyle이 horizontalSlide가 아니면 제스처 자체가 없다 (swiped 보고도 없음)", async () => {
    const clock = createClock();
    const onSwipeBackStart = mock(() => {});
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    try {
      const { edge, top } = await setupSwipe({
        transitionStyle: "verticalSlide",
        onSwipeBackStart,
        onSwipeBackEnd,
      });

      fireEvent.touchStart(edge as HTMLElement, touchInit(10, 300));
      clock.advance(16);
      fireEvent.touchMove(edge as HTMLElement, touchInit(500, 300));
      await nextFrame();
      fireEvent.touchEnd(edge as HTMLElement, touchInit(500, 300));

      expect(onSwipeBackStart).not.toHaveBeenCalled();
      expect(onSwipeBackEnd).not.toHaveBeenCalled();
      expect(top.dataset["swipeBackState"]).toBeUndefined();
    } finally {
      clock.restore();
    }
  });
});

describe("swipe back — full 모드", () => {
  it("10px slop + 10° 이내 수평 우향 이동으로만 제스처를 claim한다", async () => {
    const clock = createClock();
    const onSwipeBackStart = mock(() => {});
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "full",
        transitionStyle: "horizontalSlide",
        onSwipeBackStart,
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      // slop 미만: claim 없음
      fireEvent.touchMove(button, touchInit(205, 300));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();
      expect(onSwipeBackStart).not.toHaveBeenCalled();

      // slop 초과 + 수평(각도 ~3.8°): claim
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(215, 301));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBe("swiping");
      expect(onSwipeBackStart).toHaveBeenCalledTimes(1);
    } finally {
      clock.restore();
    }
  });

  it("기울기가 10°를 넘으면 reject되고 이후 움직임도 무시한다", async () => {
    const clock = createClock();
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "full",
        transitionStyle: "horizontalSlide",
        onSwipeBackEnd,
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(215, 310)); // dy 10 > 15 * tan(10°)
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();

      // reject 후 유효해 보이는 이동이 와도 claim하지 않는다
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(400, 310));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();

      fireEvent.touchEnd(button, touchInit(400, 310));
      expect(onSwipeBackEnd).not.toHaveBeenCalled();
    } finally {
      clock.restore();
    }
  });

  it("좌향 이동은 claim하지 않는다", async () => {
    const clock = createClock();
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "full",
        transitionStyle: "horizontalSlide",
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(180, 300));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();
    } finally {
      clock.restore();
    }
  });

  it("탭은 그대로 통과한다 (클릭 동작 유지, 콜백 없음)", async () => {
    const onSwipeBackEnd = mock((_: { swiped: boolean }) => {});
    const onClick = mock(() => {});
    const { container, top } = await setupSwipe({
      swipeBackArea: "full",
      transitionStyle: "horizontalSlide",
      onSwipeBackEnd,
    });
    const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;
    button.addEventListener("click", onClick);

    fireEvent.touchStart(button, touchInit(200, 300));
    fireEvent.touchEnd(button, touchInit(200, 300));
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSwipeBackEnd).not.toHaveBeenCalled();
    expect(top.dataset["swipeBackState"]).toBeUndefined();
  });

  it("수평 스크롤 가능한 조상이 있으면 콘텐츠가 이긴다", async () => {
    const clock = createClock();
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "full",
        transitionStyle: "horizontalSlide",
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;
      const scroller = button.parentElement as HTMLElement; // screen-content
      scroller.style.overflowX = "auto";
      Object.defineProperty(scroller, "scrollWidth", { value: 2000, configurable: true });
      Object.defineProperty(scroller, "clientWidth", { value: 400, configurable: true });

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(300, 300));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();
    } finally {
      clock.restore();
    }
  });

  it("data-swipe-back-block 조상이 있으면 제스처를 시작하지 않는다", async () => {
    const clock = createClock();
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "full",
        transitionStyle: "horizontalSlide",
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;
      (button.parentElement as HTMLElement).dataset["swipeBackBlock"] = "";

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(300, 300));
      await nextFrame();
      expect(top.dataset["swipeBackState"]).toBeUndefined();
    } finally {
      clock.restore();
    }
  });
});

describe("swipe back — none 모드", () => {
  it("아무 리스너도 동작하지 않는다", async () => {
    const clock = createClock();
    const onSwipeBackStart = mock(() => {});
    try {
      const { container, top } = await setupSwipe({
        swipeBackArea: "none",
        transitionStyle: "horizontalSlide",
        onSwipeBackStart,
      });
      const button = container.querySelector('[data-testid="b-button"]') as HTMLElement;

      fireEvent.touchStart(button, touchInit(200, 300));
      clock.advance(16);
      fireEvent.touchMove(button, touchInit(400, 300));
      await nextFrame();
      fireEvent.touchEnd(button, touchInit(400, 300));

      expect(top.dataset["swipeBackState"]).toBeUndefined();
      expect(onSwipeBackStart).not.toHaveBeenCalled();
    } finally {
      clock.restore();
    }
  });
});

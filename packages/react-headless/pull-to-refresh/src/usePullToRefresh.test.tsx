import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";

import { pullToRefreshPreventPull } from "./dom";
import {
  usePullToRefresh,
  type UsePullToRefreshProps,
  type UsePullToRefreshReturn,
} from "./usePullToRefresh";

type PullContext = Parameters<NonNullable<UsePullToRefreshProps["onPtrPullMove"]>>[0];

type IndicatorRenderProps = ReturnType<UsePullToRefreshReturn["getIndicatorRenderProps"]>;

interface HarnessProps extends UsePullToRefreshProps {
  onRender: (api: UsePullToRefreshReturn, indicator: IndicatorRenderProps) => void;
}

function Harness({ onRender, ...hookProps }: HarnessProps) {
  const api = usePullToRefresh(hookProps);
  const indicator = api.getIndicatorRenderProps();
  onRender(api, indicator);

  return (
    <div data-testid="root" ref={api.refs.root} {...api.rootProps}>
      <div data-testid="indicator" {...api.indicatorProps} />
      <div data-testid="content" {...api.contentProps}>
        <div data-testid="inner-scroller" style={{ overflowY: "auto" }}>
          <span data-testid="inner-item">item</span>
        </div>
        <span data-testid="no-pull" {...pullToRefreshPreventPull}>
          <span data-testid="no-pull-inner">inner</span>
        </span>
      </div>
    </div>
  );
}

function setup(props: UsePullToRefreshProps = {}) {
  const snapshots: Array<{ api: UsePullToRefreshReturn; indicator: IndicatorRenderProps }> = [];
  const record = (api: UsePullToRefreshReturn, indicator: IndicatorRenderProps) => {
    snapshots.push({ api, indicator });
  };
  const utils = render(<Harness {...props} onRender={record} />);

  return {
    ...utils,
    root: utils.getByTestId("root"),
    last: () => snapshots[snapshots.length - 1],
    rerenderWith: (next: UsePullToRefreshProps) =>
      utils.rerender(<Harness {...next} onRender={record} />),
  };
}

/**
 * happy-dom reports no touch support, so the hook binds the pointer handlers and
 * `isLeftPress` needs `buttons === 1`.
 *
 * A gesture always opens with `press`: the hook takes the pull origin from the
 * contact, so a bare `movePointer` is a move with no gesture behind it.
 */
function press(
  root: HTMLElement,
  clientY: number,
  { scrollTop = 0, buttons = 1, target = root as HTMLElement } = {},
) {
  root.scrollTop = scrollTop;
  fireEvent.pointerDown(target, { buttons, clientY });
}

function movePointer(
  root: HTMLElement,
  clientY: number,
  { scrollTop = 0, buttons = 1, target = root as HTMLElement } = {},
) {
  root.scrollTop = scrollTop;
  fireEvent.pointerMove(target, { buttons, clientY });
}

const releasePointer = (root: HTMLElement) => fireEvent.pointerUp(root);

const cancelPointer = (root: HTMLElement) => fireEvent.pointerCancel(root);

const displacementVar = (root: HTMLElement) => root.style.getPropertyValue("--ptr-displacement");

/**
 * Makes an element report itself as a real vertical scroller. happy-dom lays
 * nothing out, so `scrollHeight` and `clientHeight` are both 0 and no element
 * would ever qualify on its own.
 */
function makeScrollable(el: HTMLElement, { scrollTop = 0 } = {}) {
  Object.defineProperty(el, "scrollHeight", { value: 5000, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: 500, configurable: true });
  el.scrollTop = scrollTop;
}

/**
 * A deferred `onPtrRefresh` so the `loading` state can be observed before it settles.
 */
function createDeferredRefresh() {
  let settle = () => {};
  let reject = () => {};
  const onPtrRefresh = mock(
    () =>
      new Promise<void>((resolve, rejectPromise) => {
        settle = () => resolve();
        reject = () => rejectPromise(new Error("refresh failed"));
      }),
  );

  return {
    onPtrRefresh,
    finish: () => act(async () => settle()),
    fail: () => act(async () => reject()),
  };
}

describe("usePullToRefresh state machine", () => {
  it("starts in idle", () => {
    const { root, last } = setup();

    expect(last().api.state).toBe("idle");
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("walks idle → pulling → ready → loading → idle across one gesture", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    expect(last().api.state).toBe("idle");

    movePointer(root, 110);
    expect(last().api.state).toBe("pulling");

    movePointer(root, 250);
    expect(last().api.state).toBe("ready");

    releasePointer(root);
    expect(last().api.state).toBe("loading");

    await finish();
    expect(last().api.state).toBe("idle");
    expect(onPtrRefresh).toHaveBeenCalledTimes(1);
  });

  it("returns to idle on release from ready when no onPtrRefresh is given", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("returns to idle on release from pulling even when onPtrRefresh is given", () => {
    const onPtrRefresh = mock(() => Promise.resolve());
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    releasePointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrRefresh).not.toHaveBeenCalled();
  });

  it("drops back from ready to pulling when the pull shrinks below the threshold", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    movePointer(root, 150);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("treats displacement exactly at the threshold as not ready", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 210);

    expect(displacementVar(root)).toBe("100px");
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("defaults to an 88px threshold and a 0.75 displacement multiplier", () => {
    const { root } = setup();

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 300);

    // (300 - 110) * 0.75 = 142.5, which clears the default 88px threshold.
    expect(displacementVar(root)).toBe("142.5px");
    expect(root).toHaveAttribute("data-ptr-state", "ready");
  });

  it("ignores moves and releases while loading", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(last().api.state).toBe("loading");

    press(root, 100);
    movePointer(root, 400);
    releasePointer(root);
    expect(last().api.state).toBe("loading");
    expect(displacementVar(root)).toBe("100px");

    await finish();
    expect(last().api.state).toBe("idle");
  });
});

describe("usePullToRefresh callbacks", () => {
  it("calls onPtrPullStart once on entry and skips onPtrPullMove for that same move", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
      onPtrPullMove,
    });

    press(root, 100);
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(onPtrPullMove).not.toHaveBeenCalled();

    movePointer(root, 110);
    expect(onPtrPullStart).toHaveBeenCalledTimes(1);
    expect(onPtrPullStart).toHaveBeenCalledWith({
      y0: 110,
      y: 110,
      displacement: 0,
      displacementRatio: 0,
    });
    expect(onPtrPullMove).not.toHaveBeenCalled();

    movePointer(root, 150);
    expect(onPtrPullStart).toHaveBeenCalledTimes(1);
    expect(onPtrPullMove).toHaveBeenCalledTimes(1);
  });

  it("calls onPtrPullMove on every move while pulling and while ready", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    movePointer(root, 250);
    movePointer(root, 260);

    expect(onPtrPullMove).toHaveBeenCalledTimes(3);
  });

  it("calls onPtrReady on every move that sits above the threshold", () => {
    const onPtrReady = mock(() => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrReady });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    expect(onPtrReady).not.toHaveBeenCalled();

    movePointer(root, 250);
    expect(onPtrReady).toHaveBeenCalledTimes(1);

    movePointer(root, 260);
    expect(onPtrReady).toHaveBeenCalledTimes(2);
  });

  it("calls onPtrReady with no arguments", () => {
    const onPtrReady = mock(() => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrReady });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);

    expect(onPtrReady).toHaveBeenCalledWith();
  });

  it("calls onPtrPullEnd with the context captured before the reset", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);

    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).toHaveBeenCalledWith({
      y0: 110,
      y: 250,
      displacement: 140,
      displacementRatio: 1,
    });
  });

  it("calls onPtrPullEnd on release from pulling too", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    releasePointer(root);

    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).toHaveBeenCalledWith({
      y0: 110,
      y: 150,
      displacement: 40,
      displacementRatio: 0.4,
    });
  });

  it("does not call onPtrPullEnd when the gesture never left idle", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    press(root, 100);
    releasePointer(root);

    expect(onPtrPullEnd).not.toHaveBeenCalled();
  });

  it("keeps the state loading until the onPtrRefresh promise settles", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);

    // While loading the context is pinned to the threshold, so the indicator stays full.
    expect(last().api.state).toBe("loading");
    expect(displacementVar(root)).toBe("100px");

    await finish();
    expect(last().api.state).toBe("idle");
    expect(displacementVar(root)).toBe("0px");
  });

  it("returns to idle when the onPtrRefresh promise rejects", async () => {
    const { onPtrRefresh, fail } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(last().api.state).toBe("loading");

    await fail();
    expect(last().api.state).toBe("idle");
    expect(displacementVar(root)).toBe("0px");

    // A rejected refresh must not wedge the hook: the next gesture still works.
    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(last().api.state).toBe("ready");
  });
});

describe("usePullToRefresh entry guards", () => {
  it("does not start pulling while the container is scrolled", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 100, { scrollTop: 10 });
    movePointer(root, 110, { scrollTop: 10 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("does not start pulling on a move that no contact opened", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 100);
    movePointer(root, 400);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(displacementVar(root)).toBe("");
  });

  it("takes the pull origin from the contact, not from the previous move", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 400);
    movePointer(root, 410);

    expect(onPtrPullStart).toHaveBeenCalledWith({
      y0: 410,
      y: 410,
      displacement: 0,
      displacementRatio: 0,
    });
  });

  it("does not start pulling when the finger does not move downwards", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 100);

    movePointer(root, 100);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 90);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("does nothing at all while disabled", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      disabled: true,
      onPtrPullStart,
      onPtrPullMove,
      onPtrPullEnd,
    });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(onPtrPullMove).not.toHaveBeenCalled();
    expect(onPtrPullEnd).not.toHaveBeenCalled();
  });
});

describe("usePullToRefresh nested scroller", () => {
  it("reads the position of the scroller the touch belongs to, not the root", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root, getByTestId } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
    });
    const inner = getByTestId("inner-scroller");
    const item = getByTestId("inner-item");

    // The root never scrolls in this layout, so its own scrollTop stays 0 and
    // would read as "at the top" however far the real scroller had travelled.
    makeScrollable(inner, { scrollTop: 5000 });

    press(root, 100, { target: item });
    movePointer(root, 200, { target: item });
    movePointer(root, 300, { target: item });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("starts pulling once that scroller is back at its top", () => {
    const { root, getByTestId } = setup({ threshold: 100, displacementMultiplier: 1 });
    const inner = getByTestId("inner-scroller");
    const item = getByTestId("inner-item");

    makeScrollable(inner, { scrollTop: 0 });

    press(root, 100, { target: item });
    movePointer(root, 110, { target: item });

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("falls back to the root when nothing in the subtree scrolls", () => {
    const { root, getByTestId } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100, { target: getByTestId("content") });
    movePointer(root, 110, { target: getByTestId("content") });

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh rootProps filters", () => {
  it("ignores an event whose default is already prevented", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 100);

    const prevented = new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      buttons: 1,
      clientY: 110,
    });
    prevented.preventDefault();
    fireEvent(root, prevented);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("ignores a contact whose default is already prevented", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    const prevented = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      buttons: 1,
      clientY: 100,
    });
    prevented.preventDefault();
    fireEvent(root, prevented);

    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("ignores an event without the primary button held", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 100, { buttons: 0 });
    movePointer(root, 110, { buttons: 0 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("ignores a contact that started inside a preventPull subtree", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root, getByTestId } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
    });

    press(root, 100, { target: getByTestId("no-pull-inner") });
    movePointer(root, 110);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("ignores a move that crossed into a preventPull subtree", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root, getByTestId } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
    });

    press(root, 100);
    movePointer(root, 110, { target: getByTestId("no-pull-inner") });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();

    // The filtered move never reached the state machine, so the origin still stands.
    movePointer(root, 101);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("still starts pulling for events outside the preventPull subtree", () => {
    const { root, getByTestId } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100, { target: getByTestId("content") });
    movePointer(root, 110, { target: getByTestId("content") });

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh displacement", () => {
  it("scales the raw travel by displacementMultiplier", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 0.25, onPtrPullMove });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 210);

    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 210,
      displacement: 25,
      displacementRatio: 0.25,
    });
  });

  it("clamps displacementRatio at 1", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 610);

    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 610,
      displacement: 500,
      displacementRatio: 1,
    });
  });

  it("writes --ptr-displacement onto the root element on every context update", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    expect(displacementVar(root)).toBe("");

    movePointer(root, 110);
    expect(displacementVar(root)).toBe("0px");

    movePointer(root, 160);
    expect(displacementVar(root)).toBe("50px");

    releasePointer(root);
    expect(displacementVar(root)).toBe("0px");
  });
});

describe("usePullToRefresh disabled transition", () => {
  it("forces pulling back to idle and resets the context", () => {
    const { root, last, rerenderWith } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
    expect(displacementVar(root)).toBe("40px");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, disabled: true });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(displacementVar(root)).toBe("0px");
    expect(last().indicator.value).toBe(0);
    expect(last().indicator.style.opacity).toBe(0);
  });

  it("forces ready back to idle and resets the context", () => {
    const { root, rerenderWith } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, disabled: true });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(displacementVar(root)).toBe("0px");
  });

  it("leaves loading alone and lets onPtrRefresh finish the transition", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, rerenderWith } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrRefresh,
    });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, onPtrRefresh, disabled: true });
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("calls onPtrPullEnd so the interrupted pull is still paired with its start", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root, rerenderWith } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
      onPtrPullEnd,
    });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    expect(onPtrPullStart).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).not.toHaveBeenCalled();

    rerenderWith({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
      onPtrPullEnd,
      disabled: true,
    });

    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).toHaveBeenCalledWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
  });

  it("resumes normally once disabled goes back to false", () => {
    const { root, rerenderWith } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      disabled: true,
    });

    press(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, disabled: false });
    press(root, 200);
    movePointer(root, 210);

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("drops the origin of a gesture that was released while disabled", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const base = { threshold: 100, displacementMultiplier: 1, onPtrPullStart };
    const { root, rerenderWith } = setup({ ...base, disabled: false });

    // A contact lands, then `disabled` flips on before the gesture goes anywhere.
    // The release still has to drop the origin, or the next gesture would measure
    // its very first move against it.
    press(root, 100);
    rerenderWith({ ...base, disabled: true });
    releasePointer(root);
    rerenderWith({ ...base, disabled: false });

    movePointer(root, 200);
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("drops the origin of a gesture that was cancelled while disabled", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const base = { threshold: 100, displacementMultiplier: 1, onPtrPullStart };
    const { root, rerenderWith } = setup({ ...base, disabled: false });

    press(root, 100);
    rerenderWith({ ...base, disabled: true });
    cancelPointer(root);
    rerenderWith({ ...base, disabled: false });

    movePointer(root, 200);
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });
});

describe("usePullToRefresh props output", () => {
  it("exposes the state and dragging data attributes", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });
    const content = root.ownerDocument.querySelector("[data-testid='content']");
    const indicator = root.ownerDocument.querySelector("[data-testid='indicator']");

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(content).toHaveAttribute("data-ptr-state", "idle");
    expect(indicator).toHaveAttribute("data-ptr-state", "idle");

    press(root, 100);
    movePointer(root, 110);

    expect(root).toHaveAttribute("data-ptr-dragging", "");
    expect(content).toHaveAttribute("data-ptr-dragging", "");
    expect(indicator).toHaveAttribute("data-ptr-dragging", "");
  });

  it("always carries both state keys in stateProps and locks the root scroll styles", () => {
    const { last } = setup();

    // `data-ptr-dragging` is always a key; only its value drops to undefined.
    expect(Object.keys(last().api.stateProps)).toEqual(["data-ptr-state", "data-ptr-dragging"]);
    expect(last().api.rootProps.style).toEqual({
      overscrollBehaviorY: "none",
      overflowY: "auto",
    });
  });

  it("marks dragging for pulling and ready but not for idle or loading", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    expect(root).not.toHaveAttribute("data-ptr-dragging");

    press(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-dragging", "");

    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-dragging", "");

    releasePointer(root);
    expect(root).not.toHaveAttribute("data-ptr-dragging");

    await finish();
    expect(root).not.toHaveAttribute("data-ptr-dragging");
  });

  it("drops the content transform while idle and transitions only when not dragging", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    expect(last().api.contentProps.style).toEqual({
      transform: undefined,
      transition: "transform var(--ptr-transition-duration, 0.3s)",
    });

    press(root, 100);
    movePointer(root, 110);
    expect(last().api.contentProps.style).toEqual({
      transform: "translateY(var(--ptr-displacement, 0))",
      transition: "none",
    });

    movePointer(root, 250);
    releasePointer(root);
    expect(last().api.contentProps.style).toEqual({
      transform: "translateY(var(--ptr-displacement, 0))",
      transition: "transform var(--ptr-transition-duration, 0.3s)",
    });

    await finish();
    expect(last().api.contentProps.style).toEqual({
      transform: undefined,
      transition: "transform var(--ptr-transition-duration, 0.3s)",
    });
  });

  it("sizes the indicator from the threshold and pulls it out of flow", () => {
    const { last } = setup({ threshold: 72 });

    expect(last().api.indicatorProps.style).toMatchObject({
      height: "var(--ptr-size, 72px)",
      marginBottom: "calc(var(--ptr-size, 72px) * -1)",
      position: "relative",
      pointerEvents: "none",
    });
  });

  it("reports the indicator render props as a 0-100 progress value", () => {
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1 });

    expect(last().indicator).toEqual({
      minValue: 0,
      maxValue: 100,
      value: 0,
      style: { opacity: 0 },
    });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);

    expect(last().indicator).toEqual({
      minValue: 0,
      maxValue: 100,
      value: 40,
      style: { opacity: 0.4 },
    });
  });

  it("reports an undefined indicator value while loading", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);

    expect(last().indicator).toEqual({
      minValue: 0,
      maxValue: 100,
      value: undefined,
      style: { opacity: 1 },
    });

    await finish();
  });
});

describe("usePullToRefresh gesture isolation", () => {
  it("does not carry the origin across a release", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 300);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    // Without a contact of its own, the next move has no origin to measure against.
    movePointer(root, 301);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("does not carry the origin across a cancel", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    press(root, 300);
    cancelPointer(root);

    movePointer(root, 301);
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("drops the origin even when the gesture was blocked by scrollTop", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 300, { scrollTop: 10 });
    releasePointer(root);

    movePointer(root, 301);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("starts pulling on the first downward move of a fresh gesture", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 300);
    releasePointer(root);

    press(root, 301);
    movePointer(root, 311);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh negative displacement", () => {
  it("stays in the pull and clamps the displacement at zero", () => {
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
    expect(displacementVar(root)).toBe("0px");
    expect(last().indicator).toEqual({
      minValue: 0,
      maxValue: 100,
      value: 0,
      style: { opacity: 0 },
    });
  });

  it("reports the clamped context to onPtrPullMove instead of a negative one", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);

    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 60,
      y: 60,
      displacement: 0,
      displacementRatio: 0,
    });
  });

  it("does not end the pull, so the release still reports it once", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);
    expect(onPtrPullEnd).not.toHaveBeenCalled();

    releasePointer(root);
    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
  });

  it("resumes on the very next downward move, with no travel to retrace", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);

    // The origin tracked the finger down to 60, so 10px of travel is 10px of pull.
    movePointer(root, 70);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
    expect(displacementVar(root)).toBe("10px");
  });

  it("never writes a negative --ptr-displacement while the finger travels up", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    press(root, 400);
    movePointer(root, 410);

    for (const y of [390, 350, 300, 250, 200]) {
      movePointer(root, y);
      expect(Number.parseFloat(displacementVar(root))).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("usePullToRefresh cancelled gestures", () => {
  it("returns to idle when a pull is cancelled", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    cancelPointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(displacementVar(root)).toBe("0px");
    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).toHaveBeenCalledWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
  });

  it("does not refresh when a ready gesture is cancelled", () => {
    const onPtrRefresh = mock(() => Promise.resolve());
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    cancelPointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrRefresh).not.toHaveBeenCalled();
  });

  it("leaves loading alone", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    cancelPointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });
});

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

// happy-dom reports no touch support, so the hook binds the pointer handlers and
// `isLeftPress` needs `buttons === 1`.
function movePointer(root: HTMLElement, clientY: number, { scrollTop = 0, buttons = 1 } = {}) {
  root.scrollTop = scrollTop;
  fireEvent.pointerMove(root, { buttons, clientY });
}

const releasePointer = (root: HTMLElement) => fireEvent.pointerUp(root);

const cancelPointer = (root: HTMLElement) => fireEvent.pointerCancel(root);

const displacementVar = (root: HTMLElement) => root.style.getPropertyValue("--ptr-displacement");

/**
 * A deferred `onPtrRefresh` so the `loading` state can be observed before it settles.
 */
function createDeferredRefresh() {
  let settle = () => {};
  const onPtrRefresh = mock(
    () =>
      new Promise<void>((resolve) => {
        settle = () => resolve();
      }),
  );

  return { onPtrRefresh, finish: () => act(async () => settle()) };
}

describe("usePullToRefresh state machine", () => {
  it("starts in idle", () => {
    const { root, last } = setup();

    expect(last().api.state).toBe("idle");
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("walks idle → pulling → ready → loading → idle across one gesture", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    // The first move of a gesture only records y.
    movePointer(root, 100);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    movePointer(root, 150);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");
    expect(onPtrRefresh).toHaveBeenCalledTimes(1);

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("returns to idle on release from ready when no onPtrRefresh is given", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("returns to idle on release from pulling even when onPtrRefresh is given", () => {
    const { onPtrRefresh } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    movePointer(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrRefresh).not.toHaveBeenCalled();
  });

  it("drops back from ready to pulling when the pull shrinks below the threshold", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    movePointer(root, 150);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("treats displacement exactly at the threshold as not ready", () => {
    // `displacement > threshold` is a strict comparison.
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
    movePointer(root, 110);

    movePointer(root, 210);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    movePointer(root, 211);
    expect(root).toHaveAttribute("data-ptr-state", "ready");
  });

  it("defaults to a 44px threshold and a 0.5 displacement multiplier", () => {
    const { root } = setup();

    movePointer(root, 100);
    movePointer(root, 110);

    movePointer(root, 198);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    movePointer(root, 200);
    expect(root).toHaveAttribute("data-ptr-state", "ready");
  });

  it("resets the gesture origin after a pull ends, so the next gesture needs two moves", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
    movePointer(root, 110);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 500);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 510);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("ignores moves and releases while loading", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrRefresh,
      onPtrPullStart,
      onPtrPullEnd,
    });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    onPtrPullStart.mockClear();
    onPtrPullEnd.mockClear();
    movePointer(root, 400);
    movePointer(root, 500);
    releasePointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "loading");
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(onPtrPullEnd).not.toHaveBeenCalled();
    expect(onPtrRefresh).toHaveBeenCalledTimes(1);

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
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

    movePointer(root, 100);
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
    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 150,
      displacement: 40,
      displacementRatio: 0.4,
    });
  });

  it("calls onPtrPullMove on every move while pulling and while ready", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    movePointer(root, 250);
    movePointer(root, 260);

    expect(onPtrPullMove).toHaveBeenCalledTimes(3);
    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 260,
      displacement: 150,
      displacementRatio: 1,
    });
  });

  it("calls onPtrReady on every move that sits above the threshold", () => {
    const onPtrReady = mock(() => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrReady });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);
    expect(onPtrReady).not.toHaveBeenCalled();

    movePointer(root, 250);
    expect(onPtrReady).toHaveBeenCalledTimes(1);

    movePointer(root, 260);
    expect(onPtrReady).toHaveBeenCalledTimes(2);

    movePointer(root, 150);
    expect(onPtrReady).toHaveBeenCalledTimes(2);

    movePointer(root, 250);
    expect(onPtrReady).toHaveBeenCalledTimes(3);
  });

  it("calls onPtrReady with no arguments", () => {
    const onPtrReady = mock(() => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrReady });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);

    expect(onPtrReady).toHaveBeenCalledWith();
  });

  it("calls onPtrPullEnd with the context captured before the reset", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    movePointer(root, 100);
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

    movePointer(root, 100);
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

    movePointer(root, 100);
    releasePointer(root);

    expect(onPtrPullEnd).not.toHaveBeenCalled();
  });

  it("keeps the state loading until the onPtrRefresh promise settles", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    movePointer(root, 100);
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
});

describe("usePullToRefresh entry guards", () => {
  it("does not start pulling while the container is scrolled", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 100, { scrollTop: 10 });
    movePointer(root, 110, { scrollTop: 10 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("only records y on the first move of a gesture", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 400);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(displacementVar(root)).toBe("");
  });

  it("does not start pulling when the finger does not move downwards", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 100);

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

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
    expect(onPtrPullMove).not.toHaveBeenCalled();
    expect(onPtrPullEnd).not.toHaveBeenCalled();
  });
});

describe("usePullToRefresh rootProps filters", () => {
  it("ignores an event whose default is already prevented", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 100);

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

  it("ignores an event without the primary button held", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 100, { buttons: 0 });
    movePointer(root, 110, { buttons: 0 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("ignores an event that started inside a preventPull subtree", () => {
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root, getByTestId } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      onPtrPullStart,
    });

    movePointer(root, 100);
    fireEvent.pointerMove(getByTestId("no-pull-inner"), { buttons: 1, clientY: 110 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();

    // The filtered event never reached the state machine, so y is still 100.
    movePointer(root, 101);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("still starts pulling for events outside the preventPull subtree", () => {
    const { root, getByTestId } = setup({ threshold: 100, displacementMultiplier: 1 });

    fireEvent.pointerMove(getByTestId("content"), { buttons: 1, clientY: 100 });
    fireEvent.pointerMove(getByTestId("content"), { buttons: 1, clientY: 110 });

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh displacement", () => {
  it("scales the raw travel by displacementMultiplier", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 0.25, onPtrPullMove });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 210);

    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 210,
      displacement: 25,
      displacementRatio: 0.25,
    });
    expect(displacementVar(root)).toBe("25px");
  });

  it("clamps displacementRatio at 1", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 610);

    expect(onPtrPullMove).toHaveBeenLastCalledWith({
      y0: 110,
      y: 610,
      displacement: 500,
      displacementRatio: 1,
    });
    expect(last().indicator.value).toBe(100);
    expect(displacementVar(root)).toBe("500px");
  });

  it("writes --ptr-displacement onto the root element on every context update", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    expect(displacementVar(root)).toBe("");

    movePointer(root, 100);
    expect(displacementVar(root)).toBe("");

    movePointer(root, 110);
    expect(displacementVar(root)).toBe("0px");

    movePointer(root, 150);
    expect(displacementVar(root)).toBe("40px");

    releasePointer(root);
    expect(displacementVar(root)).toBe("0px");
  });
});

describe("usePullToRefresh disabled transition", () => {
  it("forces pulling back to idle and resets the context", () => {
    const { root, last, rerenderWith } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
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

    movePointer(root, 100);
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

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, onPtrRefresh, disabled: true });
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("resumes normally once disabled goes back to false", () => {
    const { root, rerenderWith } = setup({
      threshold: 100,
      displacementMultiplier: 1,
      disabled: true,
    });

    movePointer(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    rerenderWith({ threshold: 100, displacementMultiplier: 1, disabled: false });
    movePointer(root, 200);
    movePointer(root, 210);

    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh props output", () => {
  it("exposes the state and dragging data attributes", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });
    const content = root.ownerDocument.querySelector("[data-testid='content']");
    const indicator = root.ownerDocument.querySelector("[data-testid='indicator']");

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(root).not.toHaveAttribute("data-ptr-dragging");
    expect(content).toHaveAttribute("data-ptr-state", "idle");
    expect(indicator).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 100);
    movePointer(root, 110);

    expect(root).toHaveAttribute("data-ptr-dragging", "");
    expect(content).toHaveAttribute("data-ptr-dragging", "");
    expect(indicator).toHaveAttribute("data-ptr-dragging", "");
  });

  it("always carries both state keys in stateProps and locks the root scroll styles", () => {
    const { last } = setup({ threshold: 100, displacementMultiplier: 1 });

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

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(root).not.toHaveAttribute("data-ptr-dragging");

    movePointer(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
    expect(root).toHaveAttribute("data-ptr-dragging", "");

    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");
    expect(root).toHaveAttribute("data-ptr-dragging", "");

    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");
    expect(root).not.toHaveAttribute("data-ptr-dragging");

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(root).not.toHaveAttribute("data-ptr-dragging");
  });

  it("drops the content transform while idle and transitions only when not dragging", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    expect(last().api.contentProps.style).toEqual({
      transform: undefined,
      transition: "transform var(--ptr-transition-duration, 0.3s)",
    });

    movePointer(root, 100);
    movePointer(root, 110);
    expect(last().api.contentProps.style).toEqual({
      transform: "translateY(var(--ptr-displacement, 0))",
      transition: "none",
    });

    movePointer(root, 250);
    expect(last().api.contentProps.style).toEqual({
      transform: "translateY(var(--ptr-displacement, 0))",
      transition: "none",
    });

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
    const { last } = setup({ threshold: 60 });

    expect(last().api.indicatorProps.style).toEqual({
      pointerEvents: "none",
      touchAction: "none",
      position: "relative",
      top: 0,
      left: 0,
      width: "100%",
      height: "var(--ptr-size, 60px)",
      marginBottom: "calc(var(--ptr-size, 60px) * -1)",
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

    movePointer(root, 100);
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

    movePointer(root, 100);
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
    expect(last().indicator.value).toBe(0);
  });
});

describe("usePullToRefresh gesture isolation", () => {
  it("does not start pulling on the first move of a new gesture", () => {
    // A gesture that ends in idle must not leave its last y behind: the next
    // gesture would compare its first move against that stale y and start
    // pulling without the finger ever having moved down.
    const onPtrPullStart = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullStart });

    movePointer(root, 300);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 301);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrPullStart).not.toHaveBeenCalled();
  });

  it("clears the recorded y even when the idle gesture was blocked by scrollTop", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 300, { scrollTop: 10 });
    releasePointer(root);

    movePointer(root, 301);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("still starts pulling on a downward move within the same gesture", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 300);
    releasePointer(root);

    movePointer(root, 301);
    movePointer(root, 311);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });
});

describe("usePullToRefresh negative displacement", () => {
  it("returns to idle when the finger moves back above the pull origin", () => {
    const onPtrPullMove = mock((_ctx: PullContext) => {});
    const { root, last } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullMove });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(displacementVar(root)).toBe("0px");
    expect(last().indicator).toEqual({
      minValue: 0,
      maxValue: 100,
      value: 0,
      style: { opacity: 0 },
    });
    expect(last().api.contentProps.style).toEqual({
      transform: undefined,
      transition: "transform var(--ptr-transition-duration, 0.3s)",
    });
    expect(onPtrPullMove).not.toHaveBeenCalled();
  });

  it("ends the pull with a zeroed context instead of a negative one", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);

    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    expect(onPtrPullEnd).toHaveBeenCalledWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
  });

  it("does not end the pull twice when the finger is lifted afterwards", () => {
    const onPtrPullEnd = mock((_ctx: PullContext) => {});
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrPullEnd });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);
    releasePointer(root);

    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
  });

  it("lets a new pull start later in the same gesture", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 60);
    expect(root).toHaveAttribute("data-ptr-state", "idle");

    movePointer(root, 200);
    movePointer(root, 210);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    movePointer(root, 220);
    expect(displacementVar(root)).toBe("10px");
  });

  it("never writes a negative --ptr-displacement while the finger travels up", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 400);
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

    movePointer(root, 100);
    movePointer(root, 110);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");

    cancelPointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(displacementVar(root)).toBe("0px");
    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
  });

  it("does not refresh when a ready gesture is cancelled", () => {
    const { onPtrRefresh } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");

    cancelPointer(root);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(onPtrRefresh).not.toHaveBeenCalled();
  });

  it("clears the recorded y so the next gesture starts fresh", () => {
    const { root } = setup({ threshold: 100, displacementMultiplier: 1 });

    movePointer(root, 300);
    cancelPointer(root);

    movePointer(root, 301);
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("leaves loading alone", async () => {
    const { onPtrRefresh, finish } = createDeferredRefresh();
    const { root } = setup({ threshold: 100, displacementMultiplier: 1, onPtrRefresh });

    movePointer(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    releasePointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");

    cancelPointer(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");
    expect(displacementVar(root)).toBe("100px");

    await finish();
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });
});

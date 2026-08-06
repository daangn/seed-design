import { aggregate, makeEvent, type DomainEvent, type Stack } from "@stackflow/core";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { appBarAnatomy } from "../AppBar/anatomy";
import { appScreenAnatomy } from "../AppScreen/anatomy";

// `useGlobalInteraction` (and the `useTopActivity` it calls) only consume
// `useStack` from @stackflow/react. Mocking just that lets the test feed real
// Stack snapshots — built by @stackflow/core's own reducer — without pulling in
// a renderer plugin. Registered before the dynamic import below so the hook
// picks it up.
let currentStack: Stack;
mock.module("@stackflow/react", () => ({ useStack: () => currentStack }));

const { useGlobalInteraction } = await import("./useGlobalInteraction");
const { findTransitionTargets, setIdlePositions } = await import("./dom");

// happy-dom ships no WAAPI. A `finished` that never settles models an
// animation that is still in flight, which is all these tests need.
const animateSpy = mock(() => ({
  finished: new Promise<void>(() => {}),
  cancel() {},
}));
Element.prototype.animate = animateSpy as Element["animate"];

/** Await `n` animation frames, always landing after callbacks queued earlier. */
function frames(n: number): Promise<void> {
  return new Promise((resolve) => {
    let left = n;
    const tick = () => (left-- > 0 ? requestAnimationFrame(tick) : resolve());
    requestAnimationFrame(tick);
  });
}

// ─── Real stack snapshots ───────────────────────────────────────────────────

const T0 = 1_000_000;
const TRANSITION_DURATION = 350;

/** Zero-padded so the reducer's lexicographic sort by id matches insertion order. */
function evt<T extends DomainEvent["name"]>(
  seq: number,
  name: T,
  params: Omit<Extract<DomainEvent, { name: T }>, "id" | "name" | "eventDate">,
) {
  return makeEvent(name, {
    ...params,
    id: String(seq).padStart(4, "0"),
    eventDate: T0 + seq,
  });
}

const BASE_EVENTS: DomainEvent[] = [
  evt(1, "Initialized", { transitionDuration: TRANSITION_DURATION }),
  evt(2, "ActivityRegistered", { activityName: "Screen" }),
  evt(3, "Pushed", { activityId: "a1", activityName: "Screen", activityParams: {} }),
  evt(4, "Pushed", { activityId: "a2", activityName: "Screen", activityParams: {} }),
];

/** Far enough past every eventDate that both pushes have settled. */
const SETTLED_AT = T0 + TRANSITION_DURATION * 10;

const POP_SEQ = 5;

function stackAfter(...extraEvents: DomainEvent[]): Stack {
  return aggregate([...BASE_EVENTS, ...extraEvents], SETTLED_AT);
}

/** `pop({ animate: false })` — stackflow maps it to `skipExitActiveState`. */
const POP_WITHOUT_ANIMATION = evt(POP_SEQ, "Popped", { skipExitActiveState: true });

/** A plain animated `pop()`, still mid-flight at `SETTLED_AT`. */
const POP_WITH_ANIMATION = makeEvent("Popped", {
  id: String(POP_SEQ).padStart(4, "0"),
  eventDate: SETTLED_AT,
});

/** A third `push()`, still in `enter-active` at `SETTLED_AT`. */
const PUSH_A3 = makeEvent("Pushed", {
  id: String(POP_SEQ + 1).padStart(4, "0"),
  eventDate: SETTLED_AT,
  activityId: "a3",
  activityName: "Screen",
  activityParams: {},
});

// ─── Harness ────────────────────────────────────────────────────────────────

function ActivityMarkup({ id, isTop }: { id: string; isTop: boolean }) {
  return (
    <section
      data-part={appScreenAnatomy.activity}
      data-activity-id={id}
      data-transition-style="slideFromRightIOS"
      {...(isTop ? { "data-activity-is-top": "" } : {})}
    >
      <div data-part={appScreenAnatomy.layer} data-testid={`${id}-layer`} />
      <div data-part={appScreenAnatomy.dim} />
      <div data-part={appBarAnatomy.root}>
        <div data-part={appBarAnatomy.background} />
        <div data-part={appBarAnatomy.main} data-testid={`${id}-title`} />
        <div data-part={appBarAnatomy.icon} data-testid={`${id}-icon`} />
      </div>
    </section>
  );
}

/**
 * `hideTop` models an AppScreen held back by a gate or a Suspense boundary:
 * the activity exists in the stack, but nothing of it is in the DOM yet.
 */
function Harness({ hideTop = false }: { hideTop?: boolean }) {
  const { stackRef } = useGlobalInteraction();

  // Mirrors the core's `visibleActivities` filter — exit-done is unmounted.
  const visible = currentStack.activities.filter((a) => a.transitionState !== "exit-done");

  return (
    <div ref={stackRef} data-testid="stack">
      {visible.map((activity) =>
        hideTop && activity.isTop ? null : (
          <ActivityMarkup key={activity.id} id={activity.id} isTop={activity.isTop} />
        ),
      )}
    </div>
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("useGlobalInteraction — settle safety-net", () => {
  beforeEach(() => {
    currentStack = stackAfter();
  });

  it("leaves the behind layer pinned at its idle offset while a2 is on top", () => {
    // Premise check: a settled push is idle, with a2 on top.
    expect(currentStack.globalTransitionState).toBe("idle");
    expect(currentStack.activities.find((a) => a.isTop)?.id).toBe("a2");

    const { getByTestId, rerender } = render(<Harness />);

    // Exactly what the push's finished handler leaves behind.
    setIdlePositions(findTransitionTargets(getByTestId("stack")), "slideFromRightIOS");
    rerender(<Harness />);

    expect(getByTestId("a1-layer").style.transform).toBe("translate3d(-30%, 0, 0)");
  });

  it("clears the landing activity when pop({ animate: false }) skips exit-active", () => {
    const { getByTestId, rerender } = render(<Harness />);
    setIdlePositions(findTransitionTargets(getByTestId("stack")), "slideFromRightIOS");

    currentStack = stackAfter(POP_WITHOUT_ANIMATION);

    // Premise: the transition state machine never moves — a1 just becomes top.
    expect(currentStack.globalTransitionState).toBe("idle");
    expect(currentStack.activities.find((a) => a.isTop)?.id).toBe("a1");

    rerender(<Harness />);

    expect(getByTestId("a1-layer").style.transform).toBe("");
    expect(getByTestId("a1-title").style.transform).toBe("");
    expect(getByTestId("a1-title").style.opacity).toBe("");
    expect(getByTestId("a1-icon").style.opacity).toBe("");
  });

  it("does not touch inline styles while a transition is still in flight", () => {
    const { getByTestId, rerender } = render(<Harness />);
    setIdlePositions(findTransitionTargets(getByTestId("stack")), "slideFromRightIOS");

    currentStack = stackAfter(POP_WITH_ANIMATION);

    // Premise: an animated pop parks a2 in exit-active, so the stack is loading.
    expect(currentStack.globalTransitionState).toBe("loading");
    expect(currentStack.activities.find((a) => a.id === "a2")?.transitionState).toBe("exit-active");

    rerender(<Harness />);

    // The WAAPI pop animation owns the unwind from here — the safety-net must
    // stay out of the way until everything settles.
    expect(getByTestId("a1-layer").style.transform).toBe("translate3d(-30%, 0, 0)");
  });
});

describe("useGlobalInteraction — late-mounting AppScreen", () => {
  beforeEach(() => {
    currentStack = stackAfter();
    animateSpy.mockClear();
  });

  it("animates the push once the top AppScreen mounts a few frames late", async () => {
    // The push branch only fires on a transition *into* enter-active, so the
    // first render has to sit outside it.
    const { rerender } = render(<Harness />);

    currentStack = stackAfter(PUSH_A3);

    // Premise: a3 is on top and still entering.
    expect(currentStack.activities.find((a) => a.isTop)?.id).toBe("a3");
    expect(currentStack.activities.find((a) => a.isTop)?.transitionState).toBe("enter-active");

    rerender(<Harness hideTop />);
    await frames(3);
    expect(animateSpy).not.toHaveBeenCalled();

    // The gate resolves — a3's markup finally lands, still within enter-active.
    rerender(<Harness />);
    await frames(2);
    expect(animateSpy).toHaveBeenCalled();
  });

  it("stops retrying once the enter phase ends without the AppScreen", async () => {
    const realWarn = console.warn;
    const warnSpy = mock(() => {});
    console.warn = warnSpy;

    try {
      const { rerender } = render(<Harness />);
      currentStack = stackAfter(PUSH_A3);
      rerender(<Harness hideTop />);
      await frames(3);

      // The enter phase runs out with a3 still unmounted.
      currentStack = aggregate([...BASE_EVENTS, PUSH_A3], SETTLED_AT + TRANSITION_DURATION * 2);
      expect(currentStack.globalTransitionState).toBe("idle");

      rerender(<Harness hideTop />);
      expect(warnSpy).toHaveBeenCalled();

      // Mounting now must not resurrect the transition.
      rerender(<Harness />);
      await frames(3);
      expect(animateSpy).not.toHaveBeenCalled();
    } finally {
      console.warn = realWarn;
    }
  });
});

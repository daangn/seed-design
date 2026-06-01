import { describe, expect, it, mock } from "bun:test";
import { seedPlugin } from "./plugin";

type SeedPluginInstance = ReturnType<ReturnType<typeof seedPlugin>>;
type OnBeforePopArgs = Parameters<NonNullable<SeedPluginInstance["onBeforePop"]>>[0];
type GlobalTransitionState = ReturnType<
  OnBeforePopArgs["actions"]["getStack"]
>["globalTransitionState"];

function createActions(
  globalTransitionState: GlobalTransitionState,
  preventDefault = mock(() => {}),
): OnBeforePopArgs["actions"] {
  return {
    getStack: () => ({
      activities: [],
      registeredActivities: [],
      transitionDuration: 0,
      globalTransitionState,
      events: [],
    }),
    dispatchEvent: () => {},
    push: () => {},
    replace: () => {},
    pop: () => {},
    stepPush: () => {},
    stepReplace: () => {},
    stepPop: () => {},
    pause: () => {},
    resume: () => {},
    preventDefault,
    overrideActionParams: () => {},
  };
}

describe("seedPlugin", () => {
  it("allows pop while stack transition state is idle", () => {
    const preventDefault = mock(() => {});
    const plugin = seedPlugin({ theme: "cupertino" })();

    plugin.onBeforePop?.({
      actionParams: {},
      actions: createActions("idle", preventDefault),
    });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("prevents pop while stack transition state is loading", () => {
    const preventDefault = mock(() => {});
    const plugin = seedPlugin({ theme: "cupertino" })();

    plugin.onBeforePop?.({
      actionParams: {},
      actions: createActions("loading", preventDefault),
    });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("allows pop while stack transition state is paused", () => {
    const preventDefault = mock(() => {});
    const plugin = seedPlugin({ theme: "cupertino" })();

    plugin.onBeforePop?.({
      actionParams: {},
      actions: createActions("paused", preventDefault),
    });

    expect(preventDefault).not.toHaveBeenCalled();
  });
});

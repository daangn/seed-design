import { describe, expect, it, mock } from "bun:test";
import { seedPlugin } from "./plugin";

type SeedPluginInstance = ReturnType<ReturnType<typeof seedPlugin>>;
type OnBeforePopArgs = Parameters<NonNullable<SeedPluginInstance["onBeforePop"]>>[0];
type Actions = OnBeforePopArgs["actions"];
type ActionParams = OnBeforePopArgs["actionParams"];
type Stack = ReturnType<Actions["getStack"]>;
type Activity = Stack["activities"][number];
type TransitionState = Activity["transitionState"];

function createActivity(transitionState: TransitionState, id = "activity-1"): Activity {
  return {
    id,
    name: "Sample",
    transitionState,
    params: {},
    enteredBy: {
      id: `pushed-${id}`,
      name: "Pushed",
      eventDate: 0,
      activityId: id,
      activityName: "Sample",
      activityParams: {},
    },
    steps: [],
    isTop: true,
    isActive: true,
    isRoot: false,
    zIndex: 0,
  };
}

function createActions(
  activities: Activity[],
  preventDefault: Actions["preventDefault"],
  overrideActionParams: Actions["overrideActionParams"],
): Actions {
  return {
    getStack: () => ({
      activities,
      registeredActivities: [],
      transitionDuration: 0,
      // 가드는 globalTransitionState 가 아니라 activities 의 exit-active 여부를 본다.
      globalTransitionState: "loading",
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
    overrideActionParams,
  };
}

function runOnBeforePop(activities: Activity[], actionParams: ActionParams) {
  const preventDefault = mock(() => {});
  const overrideActionParams = mock((_params: ActionParams) => {});
  const plugin = seedPlugin({ theme: "cupertino" })();
  plugin.onBeforePop?.({
    actionParams,
    actions: createActions(activities, preventDefault, overrideActionParams),
  });
  return { preventDefault, overrideActionParams };
}

describe("seedPlugin onBeforePop", () => {
  it("진행 중인 exit transition 이 없으면 pop 을 그대로 둔다", () => {
    const { overrideActionParams } = runOnBeforePop([createActivity("enter-done")], {});

    expect(overrideActionParams).not.toHaveBeenCalled();
  });

  it("activity 가 없어도 pop 을 그대로 둔다", () => {
    const { overrideActionParams } = runOnBeforePop([], {});

    expect(overrideActionParams).not.toHaveBeenCalled();
  });

  it("exit-active 가 진행 중이면 이번 pop 을 즉시 제거(skipExitActiveState)로 강등한다", () => {
    const { preventDefault, overrideActionParams } = runOnBeforePop(
      [createActivity("exit-active")],
      {},
    );

    // pop 을 막지 않는다 → 화면은 그대로 닫힌다(개수 유지).
    expect(preventDefault).not.toHaveBeenCalled();
    // 대신 애니메이션 없이 즉시 제거되도록 강등한다 → exit 애니메이션이 겹치지 않는다.
    expect(overrideActionParams).toHaveBeenCalledTimes(1);
    expect(overrideActionParams).toHaveBeenCalledWith({ skipExitActiveState: true });
  });

  it("여러 activity 중 하나라도 exit-active 면 강등한다", () => {
    const { overrideActionParams } = runOnBeforePop(
      [createActivity("enter-done", "below"), createActivity("exit-active", "top")],
      {},
    );

    expect(overrideActionParams).toHaveBeenCalledTimes(1);
    expect(overrideActionParams).toHaveBeenCalledWith({ skipExitActiveState: true });
  });

  it("skipExitActiveState 가 true 면(예: pop(count) 내부 반복 / animate:false) 손대지 않는다", () => {
    const { overrideActionParams } = runOnBeforePop([createActivity("exit-active")], {
      skipExitActiveState: true,
    });

    expect(overrideActionParams).not.toHaveBeenCalled();
  });

  it("push(enter-active) 만 진행 중이면 pop 을 그대로 둔다", () => {
    const { overrideActionParams } = runOnBeforePop([createActivity("enter-active")], {});

    expect(overrideActionParams).not.toHaveBeenCalled();
  });
});

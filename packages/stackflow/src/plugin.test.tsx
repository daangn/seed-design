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

function createActions(activities: Activity[], preventDefault = mock(() => {})): Actions {
  return {
    getStack: () => ({
      activities,
      registeredActivities: [],
      transitionDuration: 0,
      // 새 가드는 globalTransitionState 가 아니라 activities 의 exit-active 여부를 본다.
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
    overrideActionParams: () => {},
  };
}

function runOnBeforePop(activities: Activity[], actionParams: ActionParams) {
  const preventDefault = mock(() => {});
  const plugin = seedPlugin({ theme: "cupertino" })();
  plugin.onBeforePop?.({ actionParams, actions: createActions(activities, preventDefault) });
  return preventDefault;
}

describe("seedPlugin onBeforePop", () => {
  it("진행 중인 exit transition 이 없으면 pop 을 허용한다", () => {
    const preventDefault = runOnBeforePop([createActivity("enter-done")], {});

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("activity 가 없어도 pop 을 허용한다", () => {
    const preventDefault = runOnBeforePop([], {});

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("이미 exit-active 인 pop 이 진행 중이면 중복 pop 을 막는다", () => {
    const preventDefault = runOnBeforePop([createActivity("exit-active")], {});

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("여러 activity 중 하나라도 exit-active 면 막는다", () => {
    const preventDefault = runOnBeforePop(
      [createActivity("enter-done", "below"), createActivity("exit-active", "top")],
      {},
    );

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("skipExitActiveState 가 true 면 exit-active 중이어도 막지 않는다 (pop(count) 내부 반복 / animate:false 보호)", () => {
    const preventDefault = runOnBeforePop([createActivity("exit-active")], {
      skipExitActiveState: true,
    });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("push(enter-active) 만 진행 중이면 pop 을 허용한다", () => {
    const preventDefault = runOnBeforePop([createActivity("enter-active")], {});

    expect(preventDefault).not.toHaveBeenCalled();
  });
});

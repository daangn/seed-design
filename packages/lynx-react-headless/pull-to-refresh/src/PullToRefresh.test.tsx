import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runWorkletCtx, type Worklet } from "@lynx-js/react/worklet-runtime/bindings";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  PullToRefresh,
  usePullToRefreshContext,
  usePullToRefreshPreventPull,
  type PullToRefreshRootProps,
} from "./index";

let frames = new Map<number, () => void>();
let invokeUiMethod: ReturnType<typeof vi.fn>;
let now = 0;
let stateRenders = 0;
beforeEach(() => {
  frames = new Map();
  now = 0;
  stateRenders = 0;
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
  let next = 1;
  const mt = lynxTestingEnv.mainThread.globalThis as Record<string, unknown>;
  mt.requestAnimationFrame = (callback: () => void) => {
    const id = next++;
    frames.set(id, callback);
    return id;
  };
  mt.cancelAnimationFrame = (id: number) => frames.delete(id);
  invokeUiMethod = vi.fn(
    (
      _element: unknown,
      _method: string,
      _params: Record<string, unknown>,
      callback: (result: { code: number; data: null }) => void,
    ) => callback({ code: 0, data: null }),
  );
  mt.__InvokeUIMethod = invokeUiMethod;
});
afterEach(() => vi.useRealTimers());

function get(selector: string): HTMLElement {
  const element = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(selector);
  return element;
}
function State() {
  stateRenders++;
  const { state } = usePullToRefreshContext();
  return <text className="state">{state}</text>;
}
function Protected() {
  const props = usePullToRefreshPreventPull();
  return (
    <view className="protected" {...props}>
      <text>보호 영역</text>
    </view>
  );
}
type SceneProps = PullToRefreshRootProps & { contentProps?: PullToRefresh.ContentProps };

function Scene({ contentProps, ...props }: SceneProps) {
  return (
    <PullToRefresh.Root className="root" {...props}>
      <PullToRefresh.Indicator className="indicator">
        {() => <text>진행률</text>}
      </PullToRefresh.Indicator>
      <PullToRefresh.Content className="content" {...contentProps}>
        <State />
        <Protected />
      </PullToRefresh.Content>
    </PullToRefresh.Root>
  );
}
async function mount(props: SceneProps = {}) {
  const result = render(<Scene {...props} />, {
    enableMainThread: true,
    enableBackgroundThread: true,
  });
  await waitSchedule();
  return result;
}
async function flush() {
  await waitSchedule();
  await waitSchedule();
}
async function frame(ms: number) {
  now += ms;
  vi.setSystemTime(now);
  const pending = [...frames];
  for (const [id, callback] of pending) {
    frames.delete(id);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await flush();
}
const consume = vi.fn();
function registerGesture() {
  const element = get(".content") as HTMLElement & {
    gesture: { config: { callbacks: { name: string; callback: Worklet }[] } };
  };
  // 처음 등록된 worklet을 고정해 BG callback 재등록 없이 native 입력을 재현합니다.
  const callbacks = new Map(
    element.gesture.config.callbacks.map(({ name, callback }) => [name, callback]),
  );
  return (name: string, y: number, x = 100) => {
    const callback = callbacks.get(name);
    if (!callback) throw new Error(name);
    lynxTestingEnv.switchToMainThread();
    try {
      runWorkletCtx(callback, [
        { params: { clientY: y, clientX: x }, currentTarget: { element: null } },
        { __ConsumeGesture: consume },
      ]);
    } finally {
      lynxTestingEnv.switchToBackgroundThread();
    }
  };
}
function gesture(name: string, y: number, x = 100) {
  registerGesture()(name, y, x);
}
function touch(selector: string, name: string, eventType: string) {
  const target = get(selector);
  const payload = { eventType, eventName: name };
  const event = createEvent(`${eventType}:${name}`, target, payload);
  Object.assign(event, payload);
  fireEvent(target, event);
}
function displacement() {
  return Number(/translateY\(([^p]+)px\)/.exec(get(".content").style.transform)?.[1] ?? 0);
}
function pull(y = 250) {
  gesture("onBegin", 100);
  gesture("onUpdate", 110);
  gesture("onUpdate", y);
}

describe("PullToRefresh MT", () => {
  it("손가락 변위를 같은 MT frame에 적용하고 짧은 release를 ease로 복귀한다", async () => {
    const onPtrRefresh = vi.fn(async () => {});
    await mount({ onPtrRefresh });
    pull(150);
    expect(displacement()).toBe(30);
    expect(get(".indicator").style.transform).toBe("translateY(-58px)");
    expect(Number(get(".indicator").style.opacity)).toBeCloseTo(30 / 88);
    gesture("onEnd", 150);
    await flush();
    await frame(150);
    expect(displacement()).toBeCloseTo(30 * (1 - 0.8024), 2);
    await frame(150);
    expect(displacement()).toBe(0);
    expect(onPtrRefresh).not.toHaveBeenCalled();
    expect(get(".state")).toHaveTextContent("idle");
  });

  it("받아들인 당김은 native 스크롤을 끄지 않고 경계 이탈만 즉시 되돌린다", async () => {
    await mount();
    const native = registerGesture();
    native("onBegin", 100);
    native("onUpdate", 110);
    expect(get(".content")).toHaveAttribute("enable-scroll", "true");

    const content = get(".content");
    const payload = {
      eventType: "bindEvent",
      eventName: "scroll",
      detail: { scrollTop: 12 },
    };
    const scroll = createEvent("bindEvent:scroll", content, payload);
    Object.assign(scroll, payload);
    content.dispatchEvent(scroll);

    expect(invokeUiMethod).toHaveBeenCalledWith(
      expect.anything(),
      "scrollTo",
      { offset: 0, index: 0, smooth: false },
      expect.any(Function),
    );
    native("onUpdate", 120);
    expect(displacement()).toBeGreaterThan(0);
  });

  it("자연 높이를 측정한 Indicator는 threshold와 별개로 당김 위치를 계산한다", async () => {
    await mount();
    const indicator = get(".indicator");
    function layout(height: number) {
      const payload = { eventType: "bindEvent", eventName: "layoutchange", detail: { height } };
      const event = createEvent("bindEvent:layoutchange", indicator, payload);
      Object.assign(event, payload);
      indicator.dispatchEvent(event);
    }
    layout(88);
    pull(190);
    expect(displacement()).toBe(60);
    expect(indicator.style.transform).toBe("translateY(-28px)");
    layout(24);
    expect(displacement()).toBe(60);
    expect(indicator.style.transform).toBe("translateY(0px)");
    layout(176);
    gesture("onUpdate", 286);
    expect(displacement()).toBe(132);
    expect(indicator.style.transform).toBe("translateY(-44px)");
  });

  it("end·refresh 순서를 지키고 loading 동안 88px에 머물며 실패 settle도 복귀한다", async () => {
    let reject: (error: Error) => void = () => {};
    const promise = new Promise<void>((_, r) => {
      reject = r;
    });
    const calls: string[] = [];
    const props = {
      onPtrPullStart: () => calls.push("start"),
      onPtrPullMove: () => calls.push("move"),
      onPtrReady: () => calls.push("ready"),
      onPtrPullEnd: () => calls.push("end"),
      onPtrRefresh: () => {
        calls.push("refresh");
        return promise;
      },
    };
    const result = await mount(props);
    pull();
    gesture("onEnd", 250);
    await flush();
    await frame(300);
    expect(calls).toEqual(["start", "move", "ready", "end", "refresh"]);
    expect(displacement()).toBe(88);
    expect(get(".state")).toHaveTextContent("loading");
    result.rerender(<Scene {...props} disabled />);
    await flush();
    expect(get(".state")).toHaveTextContent("loading");
    pull(300);
    gesture("onTouchesCancel", 300);
    gesture("onEnd", 300);
    await flush();
    expect(displacement()).toBe(88);
    expect(calls).toEqual(["start", "move", "ready", "end", "refresh"]);
    reject(new Error("실패"));
    await flush();
    await frame(300);
    expect(displacement()).toBe(0);
    expect(get(".state")).toHaveTextContent("idle");
  });

  it("cancel·disabled 중단 콜백에는 리셋 context를 주고 handler를 유지한다", async () => {
    const onPtrPullEnd = vi.fn();
    const result = await mount({ onPtrPullEnd });
    pull();
    gesture("onTouchesCancel", 250);
    await flush();
    expect(onPtrPullEnd).toHaveBeenLastCalledWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
    pull();
    await flush();
    result.rerender(<Scene disabled onPtrPullEnd={onPtrPullEnd} />);
    await flush();
    expect(onPtrPullEnd).toHaveBeenCalledTimes(2);
    expect(onPtrPullEnd).toHaveBeenLastCalledWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
    gesture("onBegin", 100);
    gesture("onUpdate", 200);
    await flush();
    expect(get(".state")).toHaveTextContent("idle");
  });

  it("처음 등록된 native worklet에도 disabled 변경과 진행 중 abort를 적용한다", async () => {
    const previousEnd = vi.fn();
    const onPtrPullEnd = vi.fn();
    const result = await mount({ onPtrPullEnd: previousEnd });
    const native = registerGesture();
    native("onBegin", 100);
    native("onUpdate", 110);
    native("onUpdate", 200);
    await flush();
    expect(get(".content")).toHaveAttribute("enable-scroll", "true");
    result.rerender(<Scene disabled onPtrPullEnd={onPtrPullEnd} />);
    await flush();
    expect(get(".content")).toHaveAttribute("enable-scroll", "true");
    expect(onPtrPullEnd).toHaveBeenCalledExactlyOnceWith({
      y0: 0,
      y: -1,
      displacement: 0,
      displacementRatio: 0,
    });
    expect(previousEnd).not.toHaveBeenCalled();
    await frame(300);
    native("onBegin", 100);
    native("onUpdate", 110);
    native("onUpdate", 200);
    await flush();
    expect(displacement()).toBe(0);
    expect(get(".state")).toHaveTextContent("idle");
    expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
  });

  it("처음 등록된 worklet은 최신 배율·threshold·콜백 추가와 최신 BG 클로저를 사용한다", async () => {
    const calls: string[] = [];
    const result = await mount({
      onPtrPullStart: () => calls.push("이전 start"),
      onPtrPullEnd: () => calls.push("이전 end"),
    });
    const native = registerGesture();
    let complete: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      complete = resolve;
    });
    result.rerender(
      <Scene
        threshold={40}
        displacementMultiplier={0.5}
        onPtrPullStart={() => calls.push("최신 start")}
        onPtrPullMove={() => calls.push("최신 move")}
        onPtrPullEnd={() => calls.push("최신 end")}
        onPtrReady={() => calls.push("최신 ready")}
        onPtrRefresh={() => {
          calls.push("최신 refresh");
          return pending;
        }}
      />,
    );
    await flush();
    native("onBegin", 100);
    native("onUpdate", 110);
    native("onUpdate", 180);
    await flush();
    expect(displacement()).toBe(35);
    expect(get(".state")).toHaveTextContent("pulling");
    native("onUpdate", 192);
    native("onEnd", 192);
    await flush();
    expect(calls).toEqual([
      "최신 start",
      "최신 move",
      "최신 move",
      "최신 ready",
      "최신 end",
      "최신 refresh",
    ]);
    expect(get(".state")).toHaveTextContent("loading");
    await frame(300);
    expect(displacement()).toBe(40);
    complete();
    await flush();
    await frame(300);
    expect(displacement()).toBe(0);
    expect(get(".state")).toHaveTextContent("idle");
  });

  it("같은 pulling 상태의 연속 이동은 BG render 없이 변위만 갱신한다", async () => {
    await mount();
    pull(150);
    await flush();
    expect(get(".state")).toHaveTextContent("pulling");
    const renders = stateRenders;
    gesture("onUpdate", 170);
    await flush();
    gesture("onUpdate", 180);
    await flush();
    expect(displacement()).toBe(52.5);
    expect(stateRenders).toBe(renders);
  });

  it("성공 settle은 idle로 복귀하고 다음 contact를 다시 받아들인다", async () => {
    let resolve: () => void = () => {};
    const pending = new Promise<void>((r) => {
      resolve = r;
    });
    await mount({ onPtrRefresh: () => pending });
    pull();
    gesture("onEnd", 250);
    await flush();
    await frame(300);
    expect(get(".state")).toHaveTextContent("loading");
    resolve();
    await flush();
    await frame(300);
    expect(displacement()).toBe(0);
    expect(get(".state")).toHaveTextContent("idle");
    pull(150);
    await flush();
    expect(displacement()).toBe(30);
    expect(get(".state")).toHaveTextContent("pulling");
  });

  it("위 이동·가로 이동·스크롤 중·보호 contact는 native 중재를 해제한다", async () => {
    await mount();
    for (const [y, x] of [
      [90, 100],
      [110, 200],
    ]) {
      consume.mockClear();
      gesture("onBegin", 100);
      gesture("onUpdate", y, x);
      expect(consume).toHaveBeenLastCalledWith(null, expect.any(Number), {
        consume: false,
        inner: false,
      });
    }
    const content = get(".content");
    const scrollPayload = {
      eventType: "bindEvent",
      eventName: "scroll",
      detail: { scrollTop: 20 },
    };
    const scroll = createEvent("bindEvent:scroll", content, scrollPayload);
    Object.assign(scroll, scrollPayload);
    content.dispatchEvent(scroll);
    consume.mockClear();
    pull();
    expect(consume).toHaveBeenLastCalledWith(null, expect.any(Number), {
      consume: false,
      inner: false,
    });
    scrollPayload.detail.scrollTop = 0;
    const top = createEvent("bindEvent:scroll", content, scrollPayload);
    Object.assign(top, scrollPayload);
    content.dispatchEvent(top);
    touch(".root", "touchstart", "bindEvent");
    touch(".protected", "touchstart", "bindEvent");
    consume.mockClear();
    pull();
    expect(consume).toHaveBeenLastCalledWith(null, expect.any(Number), {
      consume: false,
      inner: false,
    });
    expect(displacement()).toBe(0);
  });
});

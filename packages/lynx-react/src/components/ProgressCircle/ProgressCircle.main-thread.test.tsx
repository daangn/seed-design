import { useMainThreadRef, runOnBackground, useState } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runWorkletCtx, type Worklet } from "@lynx-js/react/worklet-runtime/bindings";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { ProgressCircle } from "./index";
import { PullToRefresh } from "../PullToRefresh";

let frames = new Map<number, () => void>();
let now = 0;
beforeEach(() => {
  frames = new Map();
  now = 0;
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
  let next = 1;
  const mt = lynxTestingEnv.mainThread.globalThis as Record<string, unknown>;
  mt["requestAnimationFrame"] = (callback: () => void) => {
    const id = next++;
    frames.set(id, callback);
    return id;
  };
  mt["cancelAnimationFrame"] = (id: number) => frames.delete(id);
});
afterEach(() => vi.useRealTimers());
function get(selector: string): HTMLElement {
  const element = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(selector);
  return element;
}
async function flush() {
  await waitSchedule();
  await waitSchedule();
}
async function frame(ms: number) {
  now += ms;
  vi.setSystemTime(now);
  for (const [id, callback] of [...frames]) {
    frames.delete(id);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await flush();
}
function Scene({
  next,
  loading = false,
  mounted = true,
  minValue = 10,
  maxValue = 30,
}: {
  next: number;
  loading?: boolean;
  mounted?: boolean;
  minValue?: number;
  maxValue?: number;
}) {
  const channel = useMainThreadRef<{ value: number; onChange?: (value: number) => void }>({
    value: 10,
  });
  const [subscribed, setSubscribed] = useState(false);
  function update() {
    "main thread";
    channel.current.value = next;
    channel.current.onChange?.(next);
    runOnBackground(setSubscribed)(!!channel.current.onChange);
  }
  const buttonProps: Record<string, unknown> = {
    className: "update",
    "main-thread:bindtap": update,
  };
  return (
    <>
      <view {...buttonProps}>
        <text>갱신</text>
      </view>
      <text className="subscribed">{String(subscribed)}</text>
      {mounted && (
        <ProgressCircle.Root
          value={loading ? undefined : 10}
          minValue={minValue}
          maxValue={maxValue}
          mainThreadProgress={channel}
        >
          <ProgressCircle.Range />
        </ProgressCircle.Root>
      )}
    </>
  );
}

describe("ProgressCircle MT 진행률", () => {
  it("value와 같은 척도를 즉시 원호에 적용하고 범위 밖 값·빈 범위를 clamp한다", async () => {
    const result = render(<Scene next={20} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    const range = get(".seed-progress-circle__range");
    expect(range.style.clipPath).toMatch(/ A 21 21 0 0 1 /);
    const cap = elementTree.root?.querySelectorAll<HTMLElement>(".seed-progress-circle__cap")[1];
    expect(Number.parseFloat(cap?.style.top ?? "0")).toBeGreaterThan(30);
    expect(frames.size).toBe(0);
    result.rerender(<Scene next={40} />);
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(range.style.clipPath).toBe("none");
    result.rerender(<Scene next={-10} />);
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(range.style.clipPath).toBe('path("M 0 0 Z")');
    result.rerender(<Scene next={20} minValue={10} maxValue={10} />);
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(range.style.clipPath).toBe('path("M 0 0 Z")');
  });

  it("indeterminate·unmount에서 구독을 해제하고 determinate 재진입은 최신 MT 값을 적용한다", async () => {
    const result = render(<Scene next={20} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(get(".subscribed").textContent).toBe("true");
    result.rerender(<Scene next={30} loading />);
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(get(".subscribed").textContent).toBe("false");
    const initial = get(".seed-progress-circle__range").style.clipPath;
    await frame(100);
    expect(get(".seed-progress-circle__range").style.clipPath).not.toBe(initial);
    result.rerender(<Scene next={30} />);
    await flush();
    expect(get(".seed-progress-circle__range").style.clipPath).toBe("none");
    result.rerender(<Scene next={20} mounted={false} />);
    await flush();
    fireEvent.tap(get(".update"));
    await flush();
    expect(get(".subscribed").textContent).toBe("false");
  });

  it("실제 PullToRefresh의 변위와 원호를 BG flush 전에 같은 MT update로 반영한다", async () => {
    render(
      <PullToRefresh.Root>
        <PullToRefresh.Indicator>
          {(progress) => (
            <ProgressCircle.Root {...progress}>
              <ProgressCircle.Range />
            </ProgressCircle.Root>
          )}
        </PullToRefresh.Indicator>
        <PullToRefresh.Content className="ptr-content">
          <text>콘텐츠</text>
        </PullToRefresh.Content>
      </PullToRefresh.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await flush();
    const content = get(".ptr-content") as HTMLElement & {
      gesture: { config: { callbacks: { name: string; callback: Worklet }[] } };
    };
    function drag(name: string, y: number) {
      const callback = content.gesture.config.callbacks.find(
        (entry) => entry.name === name,
      )?.callback;
      if (!callback) throw new Error(name);
      lynxTestingEnv.switchToMainThread();
      try {
        runWorkletCtx(callback, [
          { params: { clientY: y, clientX: 100 }, currentTarget: { element: null } },
          { __ConsumeGesture: vi.fn() },
        ]);
      } finally {
        lynxTestingEnv.switchToBackgroundThread();
      }
    }
    drag("onBegin", 100);
    drag("onUpdate", 110);
    await flush();
    const range = get(".seed-progress-circle__range");
    expect(range.style.clipPath).toBe('path("M 0 0 Z")');
    drag("onUpdate", 150);
    expect(content.style.transform).toBe("translateY(30px)");
    expect(range.style.clipPath).not.toBe('path("M 0 0 Z")');
    drag("onUpdate", 105);
    expect(content.style.transform).toBe("translateY(0px)");
    expect(range.style.clipPath).toBe('path("M 0 0 Z")');
  });

  it("MT 입력이 없으면 기존 BG value의 300ms 보간을 유지한다", async () => {
    const result = render(
      <ProgressCircle.Root value={0}>
        <ProgressCircle.Range />
      </ProgressCircle.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await flush();
    result.rerender(
      <ProgressCircle.Root value={100}>
        <ProgressCircle.Range />
      </ProgressCircle.Root>,
    );
    await flush();
    await frame(150);
    expect(get(".seed-progress-circle__range").style.clipPath).not.toBe("none");
    await frame(150);
    expect(get(".seed-progress-circle__range").style.clipPath).toBe("none");
  });
});

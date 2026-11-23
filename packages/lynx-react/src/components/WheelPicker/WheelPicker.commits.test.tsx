import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as WheelPicker from "./WheelPicker.namespace";

const OPTIONS = {
  4: createOptions(4),
  16: createOptions(16),
};

function createOptions(count: number): WheelPicker.Option[] {
  return Array.from({ length: count }, (_, index) => ({
    value: `item-${index}`,
    label: `항목 ${index}`,
  }));
}

// WheelPicker.test.tsx와 같이 Main Thread 정착 frame을 직접 돌린다.
let now = 0;
let frames = new Map<number, () => void>();

beforeEach(() => {
  now = 0;
  frames = new Map();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
  let nextFrame = 1;
  const mainThread = lynxTestingEnv.mainThread.globalThis as Record<string, unknown>;
  mainThread["requestAnimationFrame"] = (callback: () => void) => {
    const frame = nextFrame++;
    frames.set(frame, callback);
    return frame;
  };
  mainThread["cancelAnimationFrame"] = (frame: number) => frames.delete(frame);
});

afterEach(() => {
  vi.useRealTimers();
});

function advance(ms: number) {
  now += ms;
  vi.setSystemTime(now);
}

async function runFrames() {
  await waitSchedule();
  for (const [frame, callback] of frames) {
    advance(16);
    frames.delete(frame);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await waitSchedule();
}

function fireTouch(target: Element, type: string, name: string, y: number) {
  const init = { eventType: type, eventName: name, detail: { x: 100, y } };
  const event = createEvent(`${type}:${name}`, target, init);
  Object.assign(event, init);
  fireEvent(target, event);
}

function Example({ count }: { count: keyof typeof OPTIONS }) {
  return (
    <WheelPicker.Root accessibility-label="단계 선택">
      <WheelPicker.Column
        className="column"
        accessibility-label="단계"
        options={OPTIONS[count]}
        defaultValue="item-1"
      />
    </WheelPicker.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: keyof typeof OPTIONS) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

async function rerenderWithSameProps() {
  const { view } = await mount(4);
  return measureCommits(() => view.rerender(<Example count={4} />));
}

describe("WheelPicker commits", () => {
  it.each([4, 16] as const)("commits once when %i options mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  // 같은 props로 rerender할 때마다 LoopScroll 항목마다 `main-thread:bindtouchstart` worklet을 새 실행
  // id로 다시 보낸다 (lynx-react-headless/loop-scroll/src/LoopScroll.tsx LoopScrollTrackItem의
  // handleTouchStart). useCallback으로 고정한 handler라 handler 재생성 때문은 아니며, 원인은 확인하지 못했다.
  it.fails("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("currently sends a patch when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it.each([4, 16] as const)("commits tapping a visible item among %i options", async (count) => {
    const { view } = await mount(count);
    const column = view.container.querySelector(".column");
    const item = view.container.querySelector(".seed-wheel-picker__track")?.firstElementChild
      ?.children[2];
    if (!column || !item) throw new Error("Missing column or item");
    const commits = await measureCommits(async () => {
      fireTouch(item, "bindEvent", "touchstart", 300);
      fireTouch(column, "catchEvent", "touchstart", 300);
      advance(30);
      fireTouch(column, "catchEvent", "touchend", 300);
      await runFrames();
    });
    expect(column.getAttribute("accessibility-value")).toBe("항목 2");
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

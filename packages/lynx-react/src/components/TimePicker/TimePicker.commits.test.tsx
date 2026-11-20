import type * as React from "@lynx-js/react";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as WheelPicker from "../WheelPicker/WheelPicker.namespace";
import { type TimePickerColumnType, useTimePicker } from "./index";
import * as TimePicker from "./TimePicker.namespace";

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

// 문서 registry의 TimePicker처럼 renderLabel을 모듈에서 한 번 만든다.
const renderLabels: Record<TimePickerColumnType, (option: WheelPicker.Option) => React.ReactNode> =
  {
    period: (option) => (
      <TimePicker.ItemLabel columnType="period">{option.label}</TimePicker.ItemLabel>
    ),
    hour: (option) => <TimePicker.ItemLabel columnType="hour">{option.label}</TimePicker.ItemLabel>,
    minute: (option) => (
      <TimePicker.ItemLabel columnType="minute">{option.label}</TimePicker.ItemLabel>
    ),
  };

function Example() {
  const api = useTimePicker({ defaultValue: { hour: 9, minute: 30 } });
  return (
    <WheelPicker.Root accessibility-label="시간 선택">
      {api.columnOrder.map((type) => {
        const column = api.columns[type];
        return (
          <WheelPicker.Column
            key={type}
            className={type}
            accessibility-label={type}
            options={column.options}
            value={column.value}
            onValueChange={column.onValueChange}
            loop={column.loop}
            renderLabel={renderLabels[type]}
          />
        );
      })}
    </WheelPicker.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("TimePicker commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  // WheelPicker와 같이 Preact 10에서는 같은 props로 rerender할 때마다 LoopScroll 항목마다
  // `main-thread:bindtouchstart` worklet을 새 실행 id로 다시
  // 보낸다(lynx-react-headless/loop-scroll/src/LoopScroll.tsx LoopScrollTrackItem의 handleTouchStart).
  // 원인은 확인하지 못했다. 현재: Preact 10은 1회 중 patch 있는 commit 1회, 0.126 이상은 빈 commit 1회.
  (usesPreact10 ? it.fails : it)(
    "sends only empty commits when rerendered with the same props",
    async () => {
      const { view } = await mount();
      const commits = await measureCommits(() => view.rerender(<Example />));
      expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
    },
  );

  it("commits tapping a visible hour", async () => {
    const { view } = await mount();
    const column = view.container.querySelector(".hour");
    const item = column?.querySelector(".seed-wheel-picker__track")?.firstElementChild?.children[2];
    if (!column || !item) throw new Error("Missing hour column or item");
    const before = column.getAttribute("accessibility-value");
    const commits = await measureCommits(async () => {
      fireTouch(item, "bindEvent", "touchstart", 300);
      fireTouch(column, "catchEvent", "touchstart", 300);
      advance(30);
      fireTouch(column, "catchEvent", "touchend", 300);
      await runFrames();
    });
    expect(column.getAttribute("accessibility-value")).not.toBe(before);
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 5, nonEmpty: 3 } : { total: 3, nonEmpty: 3 },
    );
  });
});

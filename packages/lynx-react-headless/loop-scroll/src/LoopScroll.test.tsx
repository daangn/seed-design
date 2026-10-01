import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoopScroll, type LoopScrollRootProps } from "./index.js";

const ITEM_SIZE = 40;
const LOOP_CLONE_COUNT = 3;

let now = 0;
let frames = new Map<number, () => void>();

beforeEach(() => {
  now = 0;
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
  frames = new Map();
  let nextFrame = 1;
  const mainThread = lynxTestingEnv.mainThread.globalThis as Record<string, unknown>;
  mainThread["requestAnimationFrame"] = (callback: () => void) => {
    const frame = nextFrame;
    nextFrame += 1;
    frames.set(frame, callback);
    return frame;
  };
  mainThread["cancelAnimationFrame"] = (frame: number) => {
    frames.delete(frame);
  };
});

afterEach(() => {
  vi.useRealTimers();
});

function advance(ms: number) {
  now += ms;
  vi.setSystemTime(now);
}

async function runFrames(limit = Number.POSITIVE_INFINITY) {
  let count = 0;
  // Frames scheduled while running are appended to the Map and visited by the same loop.
  for (const [frame, callback] of frames) {
    if (count >= limit) break;
    if (count >= 1000) throw new Error("The animation did not settle.");
    count += 1;
    advance(16);
    frames.delete(frame);
    // Background work requested by the frame runs later in waitSchedule, on the background thread.
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await waitSchedule();
  await waitSchedule();
}

function get(selector: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function mover() {
  return get(".track").firstElementChild as HTMLElement;
}

function touch(name: "touchstart" | "touchmove" | "touchend", x: number, y: number) {
  const target = get(".root");
  const payload = { eventType: "catchEvent", eventName: name, detail: { x, y } };
  const event = createEvent(`catchEvent:${name}`, target, payload);
  Object.assign(event, payload);
  fireEvent(target, event);
}

/** 가운데에 놓인 위치를 항목 단위로 읽습니다. loop에서는 `0` 이상 `itemCount` 미만으로 감긴 값입니다. */
function centeredPosition(cloneCount = LOOP_CLONE_COUNT, itemSize = ITEM_SIZE) {
  const translate = /translateY\((-?[\d.]+)px\)/.exec(mover().style.transform)?.[1];
  if (translate === undefined) throw new Error(`Unexpected transform ${mover().style.transform}`);
  return -Number(translate) / itemSize - (cloneCount + 0.5);
}

/** 손가락을 `distance`만큼 위로 `duration` 동안 끌고, 바로 놓습니다. */
function flick(distance: number, duration: number) {
  touch("touchstart", 100, 400);
  const steps = 3;
  for (let step = 1; step <= steps; step += 1) {
    advance(duration / steps);
    touch("touchmove", 100, 400 - (distance * step) / steps);
  }
  advance(5);
  touch("touchend", 100, 400 - distance);
}

function Wheel(props: Partial<LoopScrollRootProps>) {
  return (
    <LoopScroll.Root
      className="root"
      itemCount={10}
      itemSize={ITEM_SIZE}
      visibleItemCount={5}
      {...props}
    >
      <LoopScroll.Track className="track">
        {(item) => <text className="label">{String(item.index)}</text>}
      </LoopScroll.Track>
    </LoopScroll.Root>
  );
}

async function renderWheel(props: Partial<LoopScrollRootProps> = {}) {
  const result = render(<Wheel {...props} />, {
    enableMainThread: true,
    enableBackgroundThread: true,
  });
  await waitSchedule();
  return result;
}

describe("LoopScroll", () => {
  it("loop 모드는 앞뒤 복제로 원본 순서를 잇고 첫 화면에 기본 항목을 가운데 둔다", async () => {
    await renderWheel({ defaultIndex: 4 });

    const labels = Array.from(get(".track").querySelectorAll(".label"), (node) => node.textContent);
    expect(labels).toEqual(["7", "8", "9", ..."0123456789", "0", "1", "2"]);
    const hidden = Array.from(mover().children, (node) =>
      node.hasAttribute("accessibility-elements-hidden"),
    );
    expect(hidden).toEqual([true, true, true, ...Array(10).fill(false), true, true, true]);
    expect(get(".root")).toHaveStyle({ height: "200px", overflow: "hidden" });
    expect(centeredPosition()).toBe(4);
  });

  it("끌어 놓으면 가장 가까운 항목에 정착하고 지나간 항목과 정착 결과를 알린다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    await renderWheel({ onIndexChange, onActiveIndexChange });

    touch("touchstart", 100, 300);
    for (const y of [290, 250, 210]) {
      advance(16);
      touch("touchmove", 100, y);
    }
    expect(centeredPosition()).toBeCloseTo(90 / ITEM_SIZE);

    advance(200);
    touch("touchend", 100, 210);
    await runFrames();

    expect(centeredPosition()).toBe(2);
    expect(onActiveIndexChange.mock.calls).toEqual([[1], [2]]);
    expect(onIndexChange.mock.calls).toEqual([[2, { stepDelta: 2 }]]);
  });

  it("loop 모드는 첫 항목에서 앞으로 넘기면 마지막 항목으로 이어진다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    await renderWheel({ onIndexChange, onActiveIndexChange });

    touch("touchstart", 100, 300);
    for (const y of [320, 340]) {
      advance(16);
      touch("touchmove", 100, y);
    }
    expect(centeredPosition()).toBeCloseTo(9);

    advance(200);
    touch("touchend", 100, 340);
    await runFrames();

    expect(centeredPosition()).toBe(9);
    expect(onActiveIndexChange.mock.calls).toEqual([[9]]);
    expect(onIndexChange.mock.calls).toEqual([[9, { stepDelta: -1 }]]);
  });

  it("빠르게 튕기면 손가락보다 멀리 이동하며 지나간 항목을 빠짐없이 알리고 감긴 위치에 정착한다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    await renderWheel({ onIndexChange, onActiveIndexChange });

    flick(100, 40);
    await runFrames();

    const passed = onActiveIndexChange.mock.calls.map(([index]) => index);
    const steps = passed.length;
    expect(steps).toBeGreaterThan(100 / ITEM_SIZE);
    expect(passed).toEqual(Array.from({ length: steps }, (_, step) => (step + 1) % 10));
    expect(centeredPosition()).toBe(steps % 10);
    // 한 바퀴 단위로 돌아 처음 항목에 서면 index가 바뀌지 않았으므로 알리지 않는다.
    expect(onIndexChange.mock.calls).toEqual(
      steps % 10 === 0 ? [] : [[steps % 10, { stepDelta: steps }]],
    );
  });

  it("튕긴 뒤 다시 누르면 그 자리에서 멈추고 놓은 위치에서 가장 가까운 항목에 정착한다", async () => {
    const onIndexChange = vi.fn();
    await renderWheel({ onIndexChange });

    flick(100, 30);
    await runFrames(2);
    const stopped = centeredPosition();
    expect(stopped).toBeLessThan(10);

    touch("touchstart", 100, 300);
    expect(frames.size).toBe(0);
    expect(centeredPosition()).toBe(stopped);

    touch("touchend", 100, 300);
    await runFrames();

    const nearest = Math.round(stopped);
    expect(centeredPosition()).toBe(nearest % 10);
    expect(onIndexChange.mock.calls).toEqual([[nearest % 10, { stepDelta: nearest }]]);
  });

  it("loop가 꺼지면 양 끝에서 멈추고 끝을 넘겨 끈 만큼 저항한 뒤 되돌아온다", async () => {
    const onIndexChange = vi.fn();
    await renderWheel({ loop: false, onIndexChange });
    expect(mover().children).toHaveLength(10);

    touch("touchstart", 100, 300);
    for (const y of [360, 420]) {
      advance(16);
      touch("touchmove", 100, y);
    }
    const pulled = centeredPosition(0);
    expect(pulled).toBeLessThan(0);
    expect(pulled).toBeGreaterThan(-120 / ITEM_SIZE);

    advance(200);
    touch("touchend", 100, 420);
    await runFrames();
    expect(centeredPosition(0)).toBe(0);
    expect(onIndexChange).not.toHaveBeenCalled();

    flick(240, 30);
    await runFrames();
    expect(centeredPosition(0)).toBe(9);
    expect(onIndexChange.mock.calls).toEqual([[9, { stepDelta: 9 }]]);
  });

  it("index를 바꾸면 콜백 없이 이동하고, 조작 중 바뀐 index는 손을 뗀 뒤 반영한다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    const callbacks = { onIndexChange, onActiveIndexChange };
    const { rerender } = await renderWheel({ index: 0, ...callbacks });

    rerender(<Wheel index={6} {...callbacks} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(6);

    touch("touchstart", 100, 300);
    rerender(<Wheel index={2} {...callbacks} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(6);

    touch("touchend", 100, 300);
    await runFrames();
    await waitSchedule();
    expect(centeredPosition()).toBe(2);
    expect(onIndexChange).not.toHaveBeenCalled();
    expect(onActiveIndexChange).not.toHaveBeenCalled();
  });

  it("smooth로 이동하는 중 index가 처음 값으로 돌아오면 그 자리에서 바로 되돌아간다", async () => {
    const { rerender } = await renderWheel({ index: 0, indexChangeBehavior: "smooth" });

    rerender(<Wheel index={4} indexChangeBehavior="smooth" />);
    await waitSchedule();
    await runFrames(2);
    const turnedAt = centeredPosition();
    expect(turnedAt).toBeGreaterThan(0);
    expect(turnedAt).toBeLessThan(4);

    rerender(<Wheel index={0} indexChangeBehavior="smooth" />);
    await waitSchedule();
    const positions: number[] = [];
    for (let count = 0; count < 200 && frames.size > 0; count += 1) {
      await runFrames(1);
      positions.push(centeredPosition());
    }
    expect(Math.max(...positions)).toBeLessThanOrEqual(turnedAt);
    expect(centeredPosition()).toBe(0);
  });

  it("항목 크기와 index가 함께 바뀌어도 바뀐 크기로 요청한 index에 선다", async () => {
    const { rerender } = await renderWheel({ index: 0, indexChangeBehavior: "smooth" });

    rerender(<Wheel index={5} itemSize={50} indexChangeBehavior="smooth" />);
    await waitSchedule();
    await runFrames();
    expect(centeredPosition(LOOP_CLONE_COUNT, 50)).toBe(5);

    rerender(<Wheel index={2} itemSize={ITEM_SIZE} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(2);
  });

  it("가로로 끄는 터치와 disabled에서는 움직이지 않는다", async () => {
    const onActiveIndexChange = vi.fn();
    const { rerender } = await renderWheel({ onActiveIndexChange });

    touch("touchstart", 100, 300);
    advance(16);
    touch("touchmove", 140, 305);
    advance(16);
    touch("touchmove", 140, 200);
    touch("touchend", 140, 200);
    await runFrames();
    expect(centeredPosition()).toBe(0);

    rerender(<Wheel disabled onActiveIndexChange={onActiveIndexChange} />);
    await waitSchedule();
    touch("touchstart", 100, 300);
    advance(16);
    touch("touchmove", 100, 200);
    touch("touchend", 100, 200);
    await runFrames();
    expect(centeredPosition()).toBe(0);
    expect(onActiveIndexChange).not.toHaveBeenCalled();
  });
});

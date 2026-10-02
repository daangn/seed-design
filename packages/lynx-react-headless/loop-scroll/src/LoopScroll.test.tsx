import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoopScroll, type LoopScrollRootProps } from "./index.js";

const ITEM_SIZE = 40;

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
  await waitSchedule();
  await waitSchedule();
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

/** 끝없는 track에서 가운데 위치를 항목 단위로 읽습니다. */
function centeredPosition(itemSize = ITEM_SIZE) {
  const translate = /translateY\((-?[\d.]+)px\)/.exec(mover().style.transform)?.[1];
  if (translate === undefined) throw new Error(`Unexpected transform ${mover().style.transform}`);
  return -Number(translate) / itemSize - 0.5;
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

/** 가상 위치 항목을 누릅니다. 항목의 touchstart가 Root보다 먼저 실행됩니다. */
function pressItem(virtualIndex: number, y = 300) {
  const item = Array.from(mover().children).find(
    (node) => (node as HTMLElement).style.top === `${virtualIndex * ITEM_SIZE}px`,
  ) as HTMLElement | undefined;
  if (!item) throw new Error(`Missing virtual item ${virtualIndex}`);
  const payload = { eventType: "bindEvent", eventName: "touchstart", detail: { x: 100, y } };
  const event = createEvent("bindEvent:touchstart", item, payload);
  Object.assign(event, payload);
  fireEvent(item, event);
  touch("touchstart", 100, y);
}

function selectedLabels() {
  return Array.from(
    get(".track").querySelectorAll(".seed-loop-scroll__item--selected"),
    (node) => node.textContent,
  );
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
  it("loop 모드는 화면 주변 항목을 이어서 배치하고 같은 index를 접근성 탐색에 중복 노출하지 않는다", async () => {
    await renderWheel({ defaultIndex: 4 });

    const accessible = Array.from(mover().children)
      .filter((node) => !node.hasAttribute("accessibility-elements-hidden"))
      .map((node) => node.textContent);
    expect([...accessible].sort()).toEqual([..."0123456789"]);
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
    expect(centeredPosition()).toBeCloseTo(-1);

    advance(200);
    touch("touchend", 100, 340);
    await runFrames();

    expect(centeredPosition()).toBe(-1);
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
    expect(centeredPosition()).toBe(steps);
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
    expect(centeredPosition()).toBe(nearest);
    expect(onIndexChange.mock.calls).toEqual([[nearest % 10, { stepDelta: nearest }]]);
  });

  it("loop가 꺼지면 양 끝에서 멈추고 끝을 넘겨 끈 만큼 저항한 뒤 되돌아온다", async () => {
    const onIndexChange = vi.fn();
    await renderWheel({ loop: false, onIndexChange });

    touch("touchstart", 100, 300);
    for (const y of [360, 420]) {
      advance(16);
      touch("touchmove", 100, y);
    }
    const pulled = centeredPosition();
    expect(pulled).toBeLessThan(0);
    expect(pulled).toBeGreaterThan(-120 / ITEM_SIZE);

    advance(200);
    touch("touchend", 100, 420);
    await runFrames();
    expect(centeredPosition()).toBe(0);
    expect(onIndexChange).not.toHaveBeenCalled();

    flick(240, 30);
    await runFrames();
    expect(centeredPosition()).toBe(9);
    expect(onIndexChange.mock.calls).toEqual([[9, { stepDelta: 9 }]]);
  });

  it("index를 바꾸면 콜백 없이 이동하고, 조작 중 바뀐 index는 손을 뗀 뒤 반영한다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    const callbacks = { onIndexChange, onActiveIndexChange };
    const { rerender } = await renderWheel({ index: 0, ...callbacks });

    rerender(<Wheel index={6} {...callbacks} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(-4);

    touch("touchstart", 100, 300);
    rerender(<Wheel index={2} {...callbacks} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(-4);

    touch("touchend", 100, 300);
    await runFrames();
    await waitSchedule();
    expect(centeredPosition()).toBe(-8);
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
    expect(centeredPosition(50)).toBe(5);

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

  it("끌지 않고 항목을 눌렀다 놓으면 그 항목으로 이동해 선택하고, 복제 항목은 보이는 방향으로 이동한다", async () => {
    const onIndexChange = vi.fn();
    const onActiveIndexChange = vi.fn();
    await renderWheel({ onIndexChange, onActiveIndexChange });
    expect(new Set(selectedLabels())).toEqual(new Set(["0"]));

    // 가운데(0) 아래 두 번째 항목입니다.
    pressItem(2);
    advance(16);
    touch("touchmove", 100, 304);
    touch("touchend", 100, 304);
    await runFrames();

    expect(centeredPosition()).toBe(2);
    expect(onActiveIndexChange.mock.calls).toEqual([[1], [2]]);
    expect(onIndexChange.mock.calls).toEqual([[2, { stepDelta: 2 }]]);
    expect(new Set(selectedLabels())).toEqual(new Set(["2"]));

    // 가운데(2) 위 세 번째 항목(9)은 가상 위치 -1입니다.
    pressItem(-1);
    touch("touchend", 100, 300);
    await runFrames();

    expect(centeredPosition()).toBe(-1);
    expect(onIndexChange.mock.calls.at(-1)).toEqual([9, { stepDelta: -3 }]);
    expect(new Set(selectedLabels())).toEqual(new Set(["9"]));
  });

  it("움직이는 중에 누르거나 누른 채 끌면 누른 항목을 선택하지 않는다", async () => {
    const onIndexChange = vi.fn();
    await renderWheel({ onIndexChange });

    flick(100, 30);
    await runFrames(2);
    const stopped = centeredPosition();
    pressItem(9);
    touch("touchend", 100, 300);
    await runFrames();
    const nearest = Math.round(stopped);
    expect(centeredPosition()).toBe(nearest);

    pressItem(nearest + 2);
    advance(16);
    touch("touchmove", 100, 340);
    advance(200);
    touch("touchend", 100, 340);
    await runFrames();
    expect(centeredPosition()).toBe(nearest - 1);
    expect(onIndexChange).toHaveBeenLastCalledWith((nearest + 9) % 10, { stepDelta: -1 });
  });

  it.each([
    false,
    true,
  ])("1000개 항목도 화면 주변만 렌더하고 긴 fling 뒤 목표를 표시한다 (loop=%s)", async (loop) => {
    const onIndexChange = vi.fn();
    await renderWheel({ itemCount: 1000, defaultIndex: 500, loop, onIndexChange });
    expect(mover().children.length).toBeLessThanOrEqual(25);
    expect(selectedLabels()).toEqual(["500"]);

    flick(800, 40);
    await waitSchedule();
    await runFrames();
    const target = Math.round(centeredPosition());
    expect(target).toBeGreaterThan(520);
    expect(selectedLabels()).toEqual([String(target % 1000)]);
    expect(onIndexChange).toHaveBeenLastCalledWith(target % 1000, { stepDelta: target - 500 });
    expect(mover().children.length).toBeLessThanOrEqual(25);

    pressItem(target + 2);
    touch("touchend", 100, 300);
    await runFrames();
    expect(centeredPosition()).toBe(target + 2);
    expect(selectedLabels()).toEqual([String((target + 2) % 1000)]);
    expect(mover().children.length).toBeLessThanOrEqual(25);
  });

  it.each([
    "instant",
    "smooth",
  ] as const)("긴 외부 이동은 목표 항목을 준비하고 사용자 변경을 알리지 않는다 (%s)", async (indexChangeBehavior) => {
    const onIndexChange = vi.fn();
    const { rerender } = await renderWheel({
      itemCount: 1000,
      loop: false,
      index: 0,
      indexChangeBehavior,
      onIndexChange,
    });
    rerender(
      <Wheel
        itemCount={1000}
        loop={false}
        index={900}
        indexChangeBehavior={indexChangeBehavior}
        onIndexChange={onIndexChange}
      />,
    );
    await waitSchedule();
    expect(selectedLabels()).toEqual(["900"]);
    if (indexChangeBehavior === "smooth") {
      await runFrames(1);
      const center = Math.round(centeredPosition());
      const labels = Array.from(mover().children, (node) => node.textContent);
      expect(labels).toContain(String(center));
    }
    await runFrames();
    expect(centeredPosition()).toBe(900);
    expect(selectedLabels()).toEqual(["900"]);
    expect(mover().children.length).toBeLessThanOrEqual(25);
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("loop에서 여러 바퀴를 연속 이동해도 index와 각 이동의 stepDelta를 정확히 알린다", async () => {
    const onIndexChange = vi.fn();
    await renderWheel({ onIndexChange });
    for (const distance of [1480, -1000]) {
      const previous = centeredPosition();
      touch("touchstart", 100, 300);
      advance(16);
      touch("touchmove", 100, 300 - distance);
      advance(200);
      touch("touchend", 100, 300 - distance);
      await runFrames();
      const virtual = previous + distance / ITEM_SIZE;
      const index = ((virtual % 10) + 10) % 10;
      expect(centeredPosition()).toBe(virtual);
      expect(onIndexChange).toHaveBeenLastCalledWith(index, { stepDelta: distance / ITEM_SIZE });
      expect(new Set(selectedLabels())).toEqual(new Set([String(index)]));
      expect(mover().children.length).toBeLessThanOrEqual(25);
    }
  });

  it("항목 수가 줄거나 loop가 꺼지면 유효한 non-loop 경계에 정착한다", async () => {
    const onIndexChange = vi.fn();
    const { rerender } = await renderWheel({ itemCount: 1000, defaultIndex: 999, onIndexChange });
    rerender(<Wheel itemCount={3} loop={false} onIndexChange={onIndexChange} />);
    await waitSchedule();
    await runFrames();
    expect(centeredPosition()).toBe(2);
    expect(selectedLabels()).toEqual(["2"]);
    expect(Array.from(mover().children, (node) => node.textContent)).toEqual(["0", "1", "2"]);
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("여러 바퀴 이동 뒤 Track을 다시 mount하거나 크기를 바꿔도 같은 항목을 가운데 둔다", async () => {
    function RemountWheel({
      trackKey,
      itemSize = ITEM_SIZE,
    }: {
      trackKey: number;
      itemSize?: number;
    }) {
      return (
        <LoopScroll.Root className="root" itemCount={10} itemSize={itemSize} visibleItemCount={5}>
          <LoopScroll.Track key={trackKey} className="track">
            {(item) => <text>{String(item.index)}</text>}
          </LoopScroll.Track>
        </LoopScroll.Root>
      );
    }
    const { rerender } = render(<RemountWheel trackKey={0} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    touch("touchstart", 100, 300);
    advance(16);
    touch("touchmove", 100, -1180);
    advance(200);
    touch("touchend", 100, -1180);
    await runFrames();
    rerender(<RemountWheel trackKey={1} />);
    await waitSchedule();
    expect(centeredPosition()).toBe(37);
    expect(new Set(selectedLabels())).toEqual(new Set(["7"]));

    rerender(<RemountWheel trackKey={2} itemSize={50} />);
    await waitSchedule();
    await runFrames();
    expect(centeredPosition(50)).toBe(37);
    expect(new Set(selectedLabels())).toEqual(new Set(["7"]));
  });

  it("손을 놓은 뒤 Background 창 갱신을 기다리지 않고 관성을 이어간다", async () => {
    await renderWheel({ itemCount: 1000, defaultIndex: 500 });
    flick(100, 40);
    const releasedAt = centeredPosition();
    const firstFrame = frames.entries().next().value;
    if (!firstFrame) throw new Error("Release did not schedule motion.");
    const [frame, callback] = firstFrame;
    frames.delete(frame);
    advance(16);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
    expect(centeredPosition()).toBeGreaterThan(releasedAt);
    await runFrames();
    expect(selectedLabels()).toEqual([String(Math.round(centeredPosition()) % 1000)]);
  });

  it("Highlight는 가운데 한 칸을 잘라 보여주고, 안쪽 Track은 바깥 Track과 같은 위치로 움직인다", async () => {
    render(
      <LoopScroll.Root className="root" itemCount={10} itemSize={ITEM_SIZE} visibleItemCount={5}>
        <LoopScroll.Track className="track">
          {(item) => <text>{String(item.index)}</text>}
        </LoopScroll.Track>
        <LoopScroll.Highlight className="highlight">
          <LoopScroll.Track className="highlight-track">
            {(item) => <text>{String(item.index)}</text>}
          </LoopScroll.Track>
        </LoopScroll.Highlight>
      </LoopScroll.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();
    const highlightMover = () => get(".highlight-track").firstElementChild as HTMLElement;

    expect(get(".highlight")).toHaveStyle({ top: "80px", height: "40px", overflow: "hidden" });
    expect(get(".highlight")).toHaveAttribute("accessibility-elements-hidden");

    touch("touchstart", 100, 300);
    advance(16);
    touch("touchmove", 100, 250);
    expect(centeredPosition()).toBeCloseTo(50 / ITEM_SIZE);
    expect(highlightMover().style.transform).toBe(mover().style.transform);

    advance(200);
    touch("touchend", 100, 250);
    await runFrames();
    expect(centeredPosition()).toBe(1);
    expect(highlightMover().style.transform).toBe(mover().style.transform);
  });
});

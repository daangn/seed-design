import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WheelPicker } from "./index";
import type {
  WheelPickerColumnProps,
  WheelPickerOption,
  WheelPickerRootProps,
} from "./WheelPicker";

const OPTIONS: readonly WheelPickerOption[] = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
  { value: "highest", label: "아주 높음" },
];

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
  vi.restoreAllMocks();
});

function advance(ms: number) {
  now += ms;
  vi.setSystemTime(now);
}

async function runFrames() {
  await waitSchedule();
  await waitSchedule();
  let count = 0;
  for (const [frame, callback] of frames) {
    if (++count > 1000) throw new Error("Picker did not settle.");
    advance(16);
    frames.delete(frame);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await waitSchedule();
  await waitSchedule();
}

function get(selector: string): HTMLElement {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function mover() {
  return get(".seed-wheel-picker__track").firstElementChild as HTMLElement;
}

function centeredIndex(itemSize = 44) {
  const translate = /translateY\((-?[\d.]+)px\)/.exec(mover().style.transform)?.[1];
  if (translate === undefined) throw new Error("Missing track position.");
  return -Number(translate) / itemSize - 0.5;
}

function selectedLabel() {
  return get(".seed-wheel-picker__track .seed-loop-scroll__item--selected").textContent;
}

function touch(name: "touchstart" | "touchmove" | "touchend", y: number) {
  const target = get(".column");
  const payload = { eventType: "catchEvent", eventName: name, detail: { x: 100, y } };
  const event = createEvent(`catchEvent:${name}`, target, payload);
  Object.assign(event, payload);
  fireEvent(target, event);
}

function pressItem(index: number) {
  const item = mover().children[index] as HTMLElement;
  const payload = { eventType: "bindEvent", eventName: "touchstart", detail: { x: 100, y: 300 } };
  const event = createEvent("bindEvent:touchstart", item, payload);
  Object.assign(event, payload);
  fireEvent(item, event);
  touch("touchstart", 300);
}

function Picker({
  rootProps,
  ...columnProps
}: Partial<WheelPickerColumnProps> & { rootProps?: Partial<WheelPickerRootProps> }) {
  return (
    <WheelPicker.Root accessibility-label="단계 선택" {...rootProps}>
      <WheelPicker.Column
        className="column"
        accessibility-label="단계"
        options={OPTIONS}
        {...columnProps}
      />
    </WheelPicker.Root>
  );
}

async function renderPicker(props: Parameters<typeof Picker>[0] = {}) {
  const result = render(<Picker {...props} />, {
    enableMainThread: true,
    enableBackgroundThread: true,
  });
  await waitSchedule();
  return result;
}

describe("WheelPicker", () => {
  it("초기 value를 가운데와 selected 항목 및 접근성 값에 반영한다", async () => {
    const onValueChange = vi.fn();
    const onIndexChange = vi.fn();
    await renderPicker({ value: "high", onValueChange, onIndexChange });

    expect(centeredIndex()).toBe(2);
    expect(selectedLabel()).toBe("높음");
    expect(get(".column")).toHaveAttribute("accessibility-value", "높음");
    expect(get(".column")).toHaveAttribute("accessibility-role-description", "spinbutton");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onIndexChange).not.toHaveBeenCalled();
    const root = get(".seed-wheel-picker__root");
    expect(root).not.toHaveAttribute("accessibility-element");
    expect(root).not.toHaveAttribute("accessibility-role-description");
    expect(get(".column")).toHaveAttribute("accessibility-element");
  });

  it("소비자가 지정한 Root 접근성 속성은 그대로 전달한다", async () => {
    await renderPicker({
      rootProps: {
        "accessibility-element": true,
        "accessibility-role-description": "group",
      },
    });

    const root = get(".seed-wheel-picker__root");
    expect(root).toHaveAttribute("accessibility-element");
    expect(root).toHaveAttribute("accessibility-role-description", "group");
  });

  it("지나간 항목을 즉시 알리고 정착했을 때 값과 stepDelta를 한 번 확정한다", async () => {
    const onValueChange = vi.fn();
    const onIndexChange = vi.fn();
    await renderPicker({ defaultValue: "low", onValueChange, onIndexChange });

    touch("touchstart", 300);
    for (const y of [290, 250, 210]) {
      advance(16);
      touch("touchmove", y);
    }
    await waitSchedule();
    expect(onIndexChange.mock.calls).toEqual([
      [1, "medium"],
      [2, "high"],
    ]);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(get(".column")).toHaveAttribute("accessibility-value", "낮음");

    advance(200);
    touch("touchend", 210);
    await runFrames();

    expect(centeredIndex()).toBe(2);
    expect(selectedLabel()).toBe("높음");
    expect(onValueChange.mock.calls).toEqual([["high", { stepDelta: 2 }]]);
    expect(get(".column")).toHaveAttribute("accessibility-value", "높음");
  });

  it("보이는 항목을 탭하면 가운데로 이동해 선택한다", async () => {
    const onValueChange = vi.fn();
    await renderPicker({ defaultValue: "medium", onValueChange });

    pressItem(2);
    advance(30);
    touch("touchend", 300);
    expect(onValueChange).not.toHaveBeenCalled();
    await runFrames();

    expect(centeredIndex()).toBe(2);
    expect(selectedLabel()).toBe("높음");
    expect(onValueChange.mock.calls).toEqual([["high", { stepDelta: 1 }]]);
  });

  it.each([
    "value",
    "defaultValue",
  ] as const)("존재하지 않는 %s는 첫 항목을 표시하고 알리지 않는다", async (key) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const onValueChange = vi.fn();
    const onIndexChange = vi.fn();
    await renderPicker({ [key]: "missing", onValueChange, onIndexChange });

    expect(centeredIndex()).toBe(0);
    expect(selectedLabel()).toBe("낮음");
    expect(get(".column")).toHaveAttribute("accessibility-value", "낮음");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it.each([
    "disabled",
    "readOnly",
  ] as const)("%s에서는 드래그와 탭이 값을 바꾸지 않으며 색 상태를 구분한다", async (state) => {
    const onValueChange = vi.fn();
    const onIndexChange = vi.fn();
    await renderPicker({
      defaultValue: "medium",
      rootProps: { [state]: true },
      onValueChange,
      onIndexChange,
    });

    touch("touchstart", 300);
    advance(16);
    touch("touchmove", 220);
    touch("touchend", 220);
    await runFrames();
    pressItem(2);
    advance(30);
    touch("touchend", 300);
    await runFrames();

    expect(centeredIndex()).toBe(1);
    expect(selectedLabel()).toBe("보통");
    expect(get(".column")).toHaveAttribute("accessibility-value", "보통");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onIndexChange).not.toHaveBeenCalled();
    const selectedText = get(".seed-wheel-picker__itemText--selected_true");
    expect(selectedText.classList.contains("seed-wheel-picker__itemText--disabled_true")).toBe(
      state === "disabled",
    );
    expect(get(".column").getAttribute("accessibility-traits")).toBe(
      state === "disabled" ? "disabled" : null,
    );
  });

  it.each([
    {
      option: { value: "v", label: "문자열", ariaLabel: "접근성" },
      getAriaValueText: () => "계산값",
      expected: "계산값",
    },
    { option: { value: "v", label: "문자열", ariaLabel: "접근성" }, expected: "접근성" },
    { option: { value: "v", label: "문자열" }, expected: "문자열" },
    { option: { value: "v", label: <text>커스텀</text> }, expected: "v" },
    { option: { value: "v", label: 123 }, expected: "123" },
  ])("accessibility-value 우선순위: $expected", async ({ option, getAriaValueText, expected }) => {
    await renderPicker({ options: [option], getAriaValueText });
    expect(get(".column")).toHaveAttribute("accessibility-value", expected);
  });

  it("외부 value 변경은 선택 위치를 갱신하지만 사용자 callback을 호출하지 않는다", async () => {
    const onValueChange = vi.fn();
    const onIndexChange = vi.fn();
    const { rerender } = await renderPicker({ value: "medium", onValueChange, onIndexChange });
    rerender(
      <Picker value="highest" onValueChange={onValueChange} onIndexChange={onIndexChange} />,
    );
    await waitSchedule();
    await waitSchedule();

    expect(centeredIndex()).toBe(3);
    expect(selectedLabel()).toBe("아주 높음");
    expect(get(".column")).toHaveAttribute("accessibility-value", "아주 높음");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onIndexChange).not.toHaveBeenCalled();
  });
});

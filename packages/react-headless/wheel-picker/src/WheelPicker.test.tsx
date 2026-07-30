import { act, fireEvent, render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, jest, mock } from "bun:test";
import * as React from "react";
import { WheelPickerColumn, WheelPickerRoot } from "./WheelPicker";
import { getCentralPhysicalIndex, getPhysicalOptionCount } from "./utils";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

function TestWheelPicker({
  onValueChange,
  value,
  defaultValue = "a",
  loop = false,
  disabled,
  readOnly,
  pickerOptions = options,
}: {
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  loop?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  pickerOptions?: typeof options;
}) {
  return (
    <WheelPickerRoot
      aria-label="테스트 피커"
      itemSize={40}
      visibleItemCount={5}
      disabled={disabled}
      readOnly={readOnly}
    >
      <WheelPickerColumn
        aria-label="테스트 컬럼"
        options={pickerOptions}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        loop={loop}
      />
    </WheelPickerRoot>
  );
}

describe("WheelPicker", () => {
  const originalScrollTo = HTMLElement.prototype.scrollTo;
  const originalMatchMedia = window.matchMedia;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalSetPointerCapture = HTMLElement.prototype.setPointerCapture;
  const originalReleasePointerCapture = HTMLElement.prototype.releasePointerCapture;
  let animationFrameTime = 0;

  beforeAll(() => {
    HTMLElement.prototype.scrollTo = function scrollTo(options) {
      if (typeof options === "object" && options.top !== undefined) {
        this.scrollTop = options.top;
      }
    };
    window.matchMedia = mock(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
    window.requestAnimationFrame = (callback) => {
      animationFrameTime += 16;
      callback(animationFrameTime);
      return 1;
    };
    window.cancelAnimationFrame = () => {};
    HTMLElement.prototype.setPointerCapture = mock(() => {});
    HTMLElement.prototype.releasePointerCapture = mock(() => {});
  });

  afterAll(() => {
    HTMLElement.prototype.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    HTMLElement.prototype.setPointerCapture = originalSetPointerCapture;
    HTMLElement.prototype.releasePointerCapture = originalReleasePointerCapture;
  });

  it("group과 spinbutton 접근성 속성을 제공한다", () => {
    const { getByRole } = render(<TestWheelPicker defaultValue="b" />);
    const group = getByRole("group");
    const column = getByRole("spinbutton");

    expect(group).toHaveAttribute("aria-label", "테스트 피커");
    expect(column).toHaveAttribute("aria-valuemin", "0");
    expect(column).toHaveAttribute("aria-valuemax", "2");
    expect(column).toHaveAttribute("aria-valuenow", "1");
    expect(column).toHaveAttribute("aria-valuetext", "B");
    expect(column.children).toHaveLength(3);
    expect(column.children[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("반복 렌더링 개수를 제한된 공식으로 계산한다", () => {
    expect(getPhysicalOptionCount(1, 5, true)).toBe(1);
    expect(getPhysicalOptionCount(2, 5, true)).toBe(122);
    expect(getPhysicalOptionCount(12, 5, true)).toBe(132);
    expect(getPhysicalOptionCount(60, 5, true)).toBe(180);

    const { getByRole } = render(<TestWheelPicker loop />);
    const column = getByRole("spinbutton");
    expect(column.children).toHaveLength(getPhysicalOptionCount(options.length, 5, true));
    expect(column.querySelectorAll("[data-selected]")).toHaveLength(1);
  });

  it("스크롤이 정착한 뒤 논리값을 한 번만 변경한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(<TestWheelPicker onValueChange={onValueChange} />);
    const column = getByRole("spinbutton");

    column.scrollTop = 40;
    fireEvent.scroll(column);
    fireEvent.scroll(column);

    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("b");

    fireEvent(column, new Event("scrollend"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("터치 중에는 값을 커밋하지 않고 손을 뗀 뒤 스크롤이 정착하면 커밋한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(<TestWheelPicker onValueChange={onValueChange} />);
    const column = getByRole("spinbutton");

    fireEvent.touchStart(column, { touches: [{ clientY: 100 }] });
    column.scrollTop = 40;
    fireEvent.scroll(column);
    fireEvent(column, new Event("scrollend"));

    act(() => {
      jest.advanceTimersByTime(120);
    });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(column.children[1]).toHaveAttribute("data-selected");

    fireEvent.touchEnd(column, { touches: [] });
    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("b");
    jest.useRealTimers();
  });

  it("마우스 드래그를 놓으면 속도를 이어받아 부드럽게 정착한다", () => {
    jest.useFakeTimers();
    const requestAnimationFrame = window.requestAnimationFrame;
    const cancelAnimationFrame = window.cancelAnimationFrame;
    let frameTime = 0;
    window.requestAnimationFrame = (callback) =>
      setTimeout(() => {
        frameTime += 16;
        callback(frameTime);
      }, 16) as unknown as number;
    window.cancelAnimationFrame = (handle) => clearTimeout(handle);
    const onValueChange = mock(() => {});
    const momentumOptions = [
      ...options,
      { value: "d", label: "D" },
      { value: "e", label: "E" },
      { value: "f", label: "F" },
    ];
    const { getByRole } = render(
      <TestWheelPicker pickerOptions={momentumOptions} onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");

    fireEvent.pointerDown(column, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientY: 100,
    });
    expect(column).toHaveAttribute("data-wheel-picker-dragging");

    act(() => jest.advanceTimersByTime(16));
    fireEvent.pointerMove(column, {
      pointerId: 1,
      pointerType: "mouse",
      clientY: 30,
    });
    expect(column.scrollTop).toBe(70);
    expect(column.children[2]).toHaveAttribute("data-selected");

    act(() => jest.advanceTimersByTime(16));
    fireEvent.pointerUp(column, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientY: 30,
    });
    fireEvent.click(column.children[0]);

    expect(column.scrollTop).toBe(70);
    expect(column).toHaveAttribute("data-wheel-picker-scrolling");

    act(() => jest.advanceTimersByTime(400));

    expect(column).not.toHaveAttribute("data-wheel-picker-dragging");
    expect(column).not.toHaveAttribute("data-wheel-picker-scrolling");
    expect(column.scrollTop).toBe(200);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("f");
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jest.useRealTimers();
  });

  it("마우스 조작 후 컬럼에 포커스를 유지해 키보드로 이어서 조작한다", () => {
    const { getByRole } = render(<TestWheelPicker />);
    const column = getByRole("spinbutton");

    fireEvent.pointerDown(column, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientY: 100,
    });

    expect(column).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowDown" });
    expect(column.scrollTop).toBe(40);
  });

  it("터치 포인터는 마우스 드래그 처리에 개입하지 않는다", () => {
    const { getByRole } = render(<TestWheelPicker />);
    const column = getByRole("spinbutton");

    fireEvent.pointerDown(column, {
      pointerId: 1,
      pointerType: "touch",
      button: 0,
      clientY: 100,
    });
    fireEvent.pointerMove(column, {
      pointerId: 1,
      pointerType: "touch",
      clientY: 20,
    });

    expect(column).not.toHaveAttribute("data-wheel-picker-dragging");
    expect(column.scrollTop).toBe(0);
  });

  it("loop 모드에서 touch scroll 중에는 재배치하지 않고 정착 후 중앙으로 이동한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <TestWheelPicker loop defaultValue="a" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");
    const physicalOptionCount = getPhysicalOptionCount(options.length, 5, true);
    const nearEndPhysicalIndex = physicalOptionCount - 2;

    fireEvent.touchStart(column, { touches: [{ clientY: 100 }] });
    column.scrollTop = nearEndPhysicalIndex * 40 + 10;
    fireEvent.scroll(column);

    const logicalIndex = nearEndPhysicalIndex % options.length;
    const centralPhysicalIndex = getCentralPhysicalIndex(logicalIndex, options.length, 5, true);

    expect(column.scrollTop).toBe(nearEndPhysicalIndex * 40 + 10);
    expect(column.children[nearEndPhysicalIndex]).toHaveAttribute("data-selected");

    act(() => {
      jest.advanceTimersByTime(120);
    });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.touchEnd(column, { touches: [] });
    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(column.scrollTop).toBe(centralPhysicalIndex * 40);
    expect(column.children[centralPhysicalIndex]).toHaveAttribute("data-selected");
    expect(onValueChange).toHaveBeenCalledWith(options[logicalIndex].value);
    jest.useRealTimers();
  });

  it("loop 모드에서 경계와 먼 위치에 정착하면 현재 복제본을 유지한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <TestWheelPicker loop defaultValue="a" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");
    const centralPhysicalIndex = getCentralPhysicalIndex(0, options.length, 5, true);
    const settledPhysicalIndex = centralPhysicalIndex + options.length * 5 + 1;

    fireEvent.touchStart(column, { touches: [{ clientY: 100 }] });
    column.scrollTop = settledPhysicalIndex * 40;
    fireEvent.scroll(column);
    fireEvent.touchEnd(column, { touches: [] });

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(column.scrollTop).toBe(settledPhysicalIndex * 40);
    expect(column.children[settledPhysicalIndex]).toHaveAttribute("data-selected");
    expect(onValueChange).toHaveBeenCalledWith("b");
    jest.useRealTimers();
  });

  it("loop 모드에서 wheel 관성이 경계에 닿기 전에 동일한 논리 위치로 재배치한다", () => {
    jest.useFakeTimers();
    const requestAnimationFrame = window.requestAnimationFrame;
    const cancelAnimationFrame = window.cancelAnimationFrame;
    let frameTime = 0;
    window.requestAnimationFrame = (callback) =>
      setTimeout(() => {
        frameTime += 16;
        callback(frameTime);
      }, 16) as unknown as number;
    window.cancelAnimationFrame = (handle) => clearTimeout(handle);
    const onRender = mock(() => {});
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <React.Profiler id="wheel-picker" onRender={onRender}>
        <TestWheelPicker loop defaultValue="a" onValueChange={onValueChange} />
      </React.Profiler>,
    );
    const column = getByRole("spinbutton");
    const initialCommitCount = onRender.mock.calls.length;
    const physicalOptionCount = getPhysicalOptionCount(options.length, 5, true);
    const maxScrollTop = (physicalOptionCount - 1) * 40;

    column.scrollTop = 50;
    fireEvent.wheel(column, { deltaY: -160 });

    expect(column).toHaveAttribute("data-wheel-picker-scrolling");
    const recenteredNearEndIndex = Math.round(column.scrollTop / 40);
    expect(column.scrollTop).toBeGreaterThan((physicalOptionCount / 2) * 40);
    expect(recenteredNearEndIndex % options.length).toBe(1);
    expect(column.children[recenteredNearEndIndex]).toHaveAttribute("data-selected");

    column.scrollTop = (physicalOptionCount - 2) * 40 + 10;
    fireEvent.wheel(column, { deltaY: 160 });

    const recenteredNearStartIndex = Math.round(column.scrollTop / 40);
    expect(column.scrollTop).toBeLessThan((physicalOptionCount / 2) * 40);
    expect(recenteredNearStartIndex % options.length).toBe(1);
    expect(column.children[recenteredNearStartIndex]).toHaveAttribute("data-selected");

    let reachedPhysicalBoundary = false;
    const applyWheelMomentum = (deltaY: number) => {
      fireEvent.wheel(column, { deltaY });
      column.scrollTop = Math.min(Math.max(column.scrollTop + deltaY, 0), maxScrollTop);
      fireEvent.scroll(column);
      reachedPhysicalBoundary ||= column.scrollTop <= 0 || column.scrollTop >= maxScrollTop;
    };

    column.scrollTop = getCentralPhysicalIndex(0, options.length, 5, true) * 40;
    for (let index = 0; index < 80; index++) applyWheelMomentum(-160);
    for (let index = 0; index < 160; index++) applyWheelMomentum(160);
    column.scrollTop += 10;
    fireEvent.scroll(column);

    fireEvent(column, new Event("scrollend"));
    expect(reachedPhysicalBoundary).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onRender).toHaveBeenCalledTimes(initialCommitCount);

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(column).toHaveAttribute("data-wheel-picker-scrolling");
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent(column, new Event("scrollend"));
    expect(column).toHaveAttribute("data-wheel-picker-scrolling");
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(column).not.toHaveAttribute("data-wheel-picker-scrolling");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jest.useRealTimers();
  });

  it("스크롤 중에는 React commit 없이 선택 표시만 갱신한다", () => {
    jest.useFakeTimers();
    const onRender = mock(() => {});
    const { getByRole, rerender } = render(
      <React.Profiler id="wheel-picker" onRender={onRender}>
        <TestWheelPicker />
      </React.Profiler>,
    );
    const initialCommitCount = onRender.mock.calls.length;
    const column = getByRole("spinbutton");

    column.scrollTop = 40;
    fireEvent.scroll(column);

    expect(onRender).toHaveBeenCalledTimes(initialCommitCount);
    expect(column.children[1]).toHaveAttribute("data-selected");

    rerender(
      <React.Profiler id="wheel-picker" onRender={onRender}>
        <TestWheelPicker />
      </React.Profiler>,
    );

    expect(column.querySelectorAll("[data-selected]")).toHaveLength(1);
    expect(column.children[1]).toHaveAttribute("data-selected");
    jest.useRealTimers();
  });

  it("indicator와 겹치는 구간을 스크롤 중인 item에 노출한다", () => {
    jest.useFakeTimers();
    const { getByRole } = render(<TestWheelPicker />);
    const column = getByRole("spinbutton");

    column.scrollTop = 20;
    fireEvent.scroll(column);

    expect(column.children[0]?.hasAttribute("data-wheel-picker-indicator-overlap")).toBe(true);
    expect(
      (column.children[0] as HTMLElement).style.getPropertyValue(
        "--seed-wheel-picker-indicator-overlap-start",
      ),
    ).toBe("50%");
    expect(
      (column.children[0] as HTMLElement).style.getPropertyValue(
        "--seed-wheel-picker-indicator-overlap-end",
      ),
    ).toBe("100%");
    expect(column.children[1]?.hasAttribute("data-wheel-picker-indicator-overlap")).toBe(true);
    expect(
      (column.children[1] as HTMLElement).style.getPropertyValue(
        "--seed-wheel-picker-indicator-overlap-start",
      ),
    ).toBe("0%");
    expect(
      (column.children[1] as HTMLElement).style.getPropertyValue(
        "--seed-wheel-picker-indicator-overlap-end",
      ),
    ).toBe("50%");

    expect(column.children[2]?.hasAttribute("data-wheel-picker-indicator-overlap")).toBe(false);
    jest.useRealTimers();
  });

  it("키보드로 이전·다음과 처음·끝 항목을 선택한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <TestWheelPicker defaultValue="b" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");

    fireEvent.keyDown(column, { key: "End" });
    act(() => jest.advanceTimersByTime(120));
    expect(onValueChange).toHaveBeenLastCalledWith("c");

    column.scrollTop = 80;
    fireEvent.keyDown(column, { key: "Home" });
    act(() => jest.advanceTimersByTime(120));
    expect(onValueChange).toHaveBeenLastCalledWith("a");
    jest.useRealTimers();
  });

  it("smooth scroll 중 연속 Arrow 입력을 마지막 목표 위치부터 계산한다", () => {
    jest.useFakeTimers();
    const scrollTargets: number[] = [];
    const previousScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = function scrollTo(options) {
      if (typeof options === "object" && options.top !== undefined) {
        scrollTargets.push(options.top);
      }
    };
    const { getByRole } = render(<TestWheelPicker defaultValue="a" />);
    const column = getByRole("spinbutton");

    fireEvent.keyDown(column, { key: "ArrowDown" });
    fireEvent.keyDown(column, { key: "ArrowDown" });

    expect(scrollTargets).toEqual([40, 80]);
    HTMLElement.prototype.scrollTo = previousScrollTo;
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("loop 모드에서 Arrow 키를 길게 눌러도 반복 렌더링 경계에 닿지 않는다", () => {
    jest.useFakeTimers();
    const scrollCalls: Array<{ top: number; behavior: ScrollBehavior | undefined }> = [];
    const previousScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = function scrollTo(options) {
      if (typeof options === "object" && options.top !== undefined) {
        scrollCalls.push({ top: options.top, behavior: options.behavior });
        this.scrollTop = options.top;
      }
    };
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <TestWheelPicker loop defaultValue="a" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");
    const physicalOptionCount = getPhysicalOptionCount(options.length, 5, true);
    const maxScrollTop = (physicalOptionCount - 1) * 40;

    fireEvent.keyDown(column, { key: "ArrowDown" });
    for (let index = 0; index < physicalOptionCount * 2; index++) {
      fireEvent.keyDown(column, { key: "ArrowDown", repeat: true });
    }

    expect(scrollCalls[0]?.behavior).toBe("smooth");
    expect(scrollCalls.slice(1).every((call) => call.behavior === "auto")).toBe(true);
    expect(scrollCalls.every((call) => call.top > 0 && call.top < maxScrollTop)).toBe(true);
    expect(column.scrollTop).toBeGreaterThan(0);
    expect(column.scrollTop).toBeLessThan(maxScrollTop);

    act(() => jest.advanceTimersByTime(120));
    expect(onValueChange).toHaveBeenLastCalledWith("b");

    HTMLElement.prototype.scrollTo = previousScrollTo;
    jest.useRealTimers();
  });

  it("loop 모드에서 Arrow 키가 양 끝을 순환한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <TestWheelPicker loop defaultValue="a" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");

    fireEvent.keyDown(column, { key: "ArrowUp" });
    act(() => jest.advanceTimersByTime(120));

    expect(onValueChange).toHaveBeenCalledWith("c");
    jest.useRealTimers();
  });

  it("disabled와 readOnly에서는 값 변경을 차단한다", () => {
    jest.useFakeTimers();
    const disabledChange = mock(() => {});
    const readOnlyChange = mock(() => {});
    const { getAllByRole } = render(
      <>
        <TestWheelPicker disabled onValueChange={disabledChange} />
        <TestWheelPicker readOnly onValueChange={readOnlyChange} />
      </>,
    );
    const [disabledColumn, readOnlyColumn] = getAllByRole("spinbutton");

    expect(disabledColumn).toHaveAttribute("tabindex", "-1");
    expect(disabledColumn).toHaveAttribute("aria-disabled", "true");
    expect(readOnlyColumn).toHaveAttribute("aria-readonly", "true");

    fireEvent.keyDown(disabledColumn, { key: "ArrowDown" });
    fireEvent.keyDown(readOnlyColumn, { key: "ArrowDown" });
    readOnlyColumn.scrollTop = 40;
    fireEvent.scroll(readOnlyColumn);
    act(() => jest.advanceTimersByTime(120));

    expect(disabledChange).not.toHaveBeenCalled();
    expect(readOnlyChange).not.toHaveBeenCalled();
    expect(readOnlyColumn.scrollTop).toBe(0);
    jest.useRealTimers();
  });

  it("controlled value 변경은 callback 없이 스크롤 위치를 동기화한다", () => {
    const onValueChange = mock(() => {});
    const { getByRole, rerender } = render(
      <TestWheelPicker value="a" onValueChange={onValueChange} />,
    );
    const column = getByRole("spinbutton");

    rerender(<TestWheelPicker value="c" onValueChange={onValueChange} />);

    expect(column.scrollTop).toBe(80);
    expect(column).toHaveAttribute("aria-valuenow", "2");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

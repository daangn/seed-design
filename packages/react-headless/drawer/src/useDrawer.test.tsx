import { act, fireEvent, render } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
  spyOn,
} from "bun:test";
import * as React from "react";
import { DRAG_CLASS, TRANSITIONS, WINDOW_TOP_OFFSET } from "./constants";
import { DrawerContent, DrawerRoot } from "./Drawer";
import { useDrawer, type UseDrawerProps } from "./useDrawer";

interface DrawerHarnessProps extends UseDrawerProps {
  onApi?: (api: ReturnType<typeof useDrawer>) => void;
}

function DrawerHarness({ onApi, ...props }: DrawerHarnessProps) {
  const api = useDrawer(props);

  React.useEffect(() => {
    onApi?.(api);
  }, [api, onApi]);

  return (
    <div>
      <button data-testid="set-open" onClick={() => api.setIsOpen(true)}>
        열기 설정
      </button>
      <button
        data-testid="set-close"
        onClick={() =>
          api.setIsOpen(false, { reason: "closeButton", event: new MouseEvent("click") })
        }
      >
        닫기 설정
      </button>
      <button
        data-testid="close-drawer"
        onClick={() =>
          api.closeDrawer(false, { reason: "escapeKeyDown", event: new KeyboardEvent("keydown") })
        }
      >
        드로어 닫기
      </button>
      <button
        data-testid="set-second-snap"
        onClick={() => api.setActiveSnapPoint(api.snapPoints?.[1] ?? null)}
      >
        두 번째 스냅으로 이동
      </button>

      <div data-testid="is-open">{String(api.isOpen)}</div>
      <div data-testid="is-dragging">{String(api.isDragging)}</div>
      <div data-testid="active-snap-point">{String(api.activeSnapPoint)}</div>
      <div data-testid="has-animation-done">{String(api.hasAnimationDone)}</div>
      <div data-testid="should-overlay-animate">{String(api.shouldOverlayAnimate)}</div>

      <div
        data-testid="drawer"
        role="dialog"
        ref={api.drawerRef}
        onPointerDown={api.onPress}
        onPointerMove={api.onDrag}
        onPointerUp={api.onRelease}
      />
      <div data-testid="overlay" ref={api.overlayRef} />
    </div>
  );
}

function mockRect(element: HTMLElement, size = 100) {
  return spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: size,
    height: size,
    top: 0,
    left: 0,
    right: size,
    bottom: size,
    toJSON: () => {},
  });
}

describe("useDrawer", () => {
  const originalSetPointerCapture = window.HTMLElement.prototype.setPointerCapture;

  beforeAll(() => {
    window.HTMLElement.prototype.setPointerCapture = mock(() => {});
  });

  afterAll(() => {
    window.HTMLElement.prototype.setPointerCapture = originalSetPointerCapture;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("트리거를 클릭하면 reason: trigger와 함께 onOpenChange를 호출한다", () => {
    const onOpenChange = mock(() => {});

    function TriggerHarness() {
      const api = useDrawer({ onOpenChange });
      return <button data-testid="trigger" {...api.triggerProps} />;
    }

    const { getByTestId } = render(<TriggerHarness />);

    fireEvent.click(getByTestId("trigger"));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "trigger" }));
  });

  it("closeDrawer 호출 시 상세 정보와 함께 닫힘 라이프사이클 콜백을 호출한다", () => {
    jest.useFakeTimers();

    const onOpenChange = mock(() => {});
    const onAnimationEnd = mock(() => {});
    const onClose = mock(() => {});
    const { getByTestId } = render(
      <DrawerHarness
        defaultOpen
        onOpenChange={onOpenChange}
        onAnimationEnd={onAnimationEnd}
        onClose={onClose}
      />,
    );

    fireEvent.click(getByTestId("close-drawer"));

    expect(getByTestId("is-open")).toHaveTextContent("false");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: "escapeKeyDown" }),
    );

    act(() => {
      jest.advanceTimersByTime(TRANSITIONS.EXIT_DURATION * 1000);
    });
    expect(onAnimationEnd).toHaveBeenCalledWith(false);
  });

  it("dismissible이 false이고 snapPoints가 없으면 드래그를 시작하지 않는다", () => {
    const { getByTestId } = render(
      <DrawerHarness defaultOpen dismissible={false} direction="left" />,
    );
    const drawer = getByTestId("drawer");

    fireEvent.pointerDown(drawer, {
      pointerId: 1,
      pageX: 100,
      pageY: 0,
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
    });
    fireEvent.pointerMove(drawer, {
      pointerId: 1,
      pageX: 80,
      pageY: 0,
      clientX: 80,
      clientY: 0,
      pointerType: "mouse",
    });

    expect(getByTestId("is-dragging")).toHaveTextContent("false");
    expect(drawer.classList.contains(DRAG_CLASS)).toBe(false);
  });

  it("dismissible이 false여도 snapPoints가 있으면 드래그를 시작한다", () => {
    const { getByTestId } = render(
      <DrawerHarness
        defaultOpen
        dismissible={false}
        direction="left"
        snapPoints={["100px", "300px"]}
      />,
    );
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 100);

    fireEvent.pointerDown(drawer, {
      pointerId: 1,
      pageX: 100,
      pageY: 0,
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
    });

    expect(getByTestId("is-dragging")).toHaveTextContent("true");

    rectSpy.mockRestore();
  });

  it("드래그 중 transform을 갱신하고 onDrag를 비율과 함께 호출한다", () => {
    const onDrag = mock(() => {});
    let api: ReturnType<typeof useDrawer> | null = null;
    const { getByTestId } = render(
      <DrawerHarness
        defaultOpen
        direction="left"
        onDrag={onDrag}
        onApi={(latestApi) => {
          api = latestApi;
        }}
      />,
    );
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 100);

    if (!api) {
      throw new Error("Drawer API를 사용할 수 없습니다.");
    }

    const createPointerEvent = (target: HTMLElement, pageX: number, pageY: number) =>
      ({
        target,
        currentTarget: target,
        pointerId: 1,
        pageX,
        pageY,
        nativeEvent: new PointerEvent("pointermove"),
      }) as unknown as React.PointerEvent<HTMLDivElement>;

    act(() => {
      api?.onPress(createPointerEvent(drawer, 100, 0));
    });
    drawer.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
    act(() => {
      api?.onDrag(createPointerEvent(drawer, 80, 0));
    });

    expect(getByTestId("is-dragging")).toHaveTextContent("true");
    expect(drawer.classList.contains(DRAG_CLASS)).toBe(true);
    expect(drawer.style.transform).toBe("translate3d(-20px, 0, 0)");
    expect(onDrag).toHaveBeenCalledWith(expect.anything(), 0.2);

    rectSpy.mockRestore();
  });

  it("열리는 방향으로 스와이프 후 릴리즈하면 드로어를 리셋하고 open=true를 전달한다", () => {
    const onRelease = mock(() => {});
    const { getByTestId } = render(
      <DrawerHarness defaultOpen direction="right" onRelease={onRelease} />,
    );
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 100);

    fireEvent.pointerDown(drawer, {
      pointerId: 1,
      pageX: 100,
      pageY: 0,
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
    });
    drawer.style.transform = "matrix(1, 0, 0, 1, 10, 0)";
    fireEvent.pointerUp(drawer, {
      pointerId: 1,
      pageX: 80,
      pageY: 0,
      clientX: 80,
      clientY: 0,
      pointerType: "mouse",
    });

    expect(getByTestId("is-dragging")).toHaveTextContent("false");
    expect(drawer.style.transform).toBe("translate3d(0, 0, 0)");
    expect(onRelease).toHaveBeenCalledWith(expect.anything(), true);

    rectSpy.mockRestore();
  });

  it("닫힘 애니메이션 후 active snap point를 첫 번째 스냅 포인트로 되돌린다", () => {
    jest.useFakeTimers();

    const { getByTestId } = render(<DrawerHarness defaultOpen snapPoints={["100px", "300px"]} />);

    fireEvent.click(getByTestId("set-second-snap"));
    expect(getByTestId("active-snap-point")).toHaveTextContent("300px");

    fireEvent.click(getByTestId("close-drawer"));
    act(() => {
      jest.advanceTimersByTime(TRANSITIONS.EXIT_DURATION * 1000);
    });

    expect(getByTestId("active-snap-point")).toHaveTextContent("100px");
  });

  it("open 상태와 transition 시간에 따라 hasAnimationDone을 갱신한다", () => {
    jest.useFakeTimers();

    const { getByTestId } = render(<DrawerHarness defaultOpen />);

    expect(getByTestId("has-animation-done")).toHaveTextContent("false");

    act(() => {
      jest.advanceTimersByTime(TRANSITIONS.ENTER_DURATION * 1000);
    });
    expect(getByTestId("has-animation-done")).toHaveTextContent("true");

    fireEvent.click(getByTestId("set-close"));
    expect(getByTestId("has-animation-done")).toHaveTextContent("false");
  });

  it("fadeFromIndex가 0이면 초기 열림 구간에서만 오버레이 애니메이션을 활성화한다", () => {
    jest.useFakeTimers();

    const { getByTestId } = render(
      <DrawerHarness defaultOpen snapPoints={["100px", "300px"]} fadeFromIndex={0} />,
    );

    expect(getByTestId("should-overlay-animate")).toHaveTextContent("true");

    act(() => {
      jest.advanceTimersByTime(TRANSITIONS.ENTER_DURATION * 1000);
    });
    expect(getByTestId("should-overlay-animate")).toHaveTextContent("false");
  });
});

describe("스크롤 락", () => {
  // usePreventScroll locks the root element (`overflow: hidden`), not the body.
  const isScrollLocked = () => document.documentElement.style.overflow === "hidden";

  it("modal이고 열렸을 때 루트 스크롤을 잠그고, 닫히면 해제한다", () => {
    const { rerender } = render(
      <DrawerRoot open={false} modal>
        <DrawerContent>내용</DrawerContent>
      </DrawerRoot>,
    );
    expect(isScrollLocked()).toBe(false);

    rerender(
      <DrawerRoot open modal>
        <DrawerContent>내용</DrawerContent>
      </DrawerRoot>,
    );
    expect(isScrollLocked()).toBe(true);

    rerender(
      <DrawerRoot open={false} modal>
        <DrawerContent>내용</DrawerContent>
      </DrawerRoot>,
    );
    expect(isScrollLocked()).toBe(false);
  });

  it("modal=false면 열려 있어도 잠그지 않는다", () => {
    render(
      <DrawerRoot open modal={false}>
        <DrawerContent>내용</DrawerContent>
      </DrawerRoot>,
    );
    expect(isScrollLocked()).toBe(false);
  });
});

describe("키보드 리포지션", () => {
  function KeyboardHarness(props: UseDrawerProps) {
    const api = useDrawer(props);

    return (
      <div>
        <button
          type="button"
          data-testid="next-snap"
          onClick={() => api.setActiveSnapPoint(api.snapPoints?.[1] ?? null)}
        />
        <div data-testid="drawer" role="dialog" ref={api.drawerRef} />
        <input data-testid="input-a" />
        <input data-testid="input-b" />
      </div>
    );
  }

  const originalRaf = window.requestAnimationFrame;
  const originalCaf = window.cancelAnimationFrame;
  const originalPlatform = Object.getOwnPropertyDescriptor(window.navigator, "platform");
  const originalVisualViewport = Object.getOwnPropertyDescriptor(window, "visualViewport");

  class MockVisualViewport extends EventTarget {
    height = window.innerHeight;
    offsetTop = 0;
    scale = 1;
  }

  let pending: Map<number, () => void>;
  let nextHandle: number;
  let visualViewport: MockVisualViewport;

  function flushFrames() {
    const callbacks = [...pending.values()];
    pending.clear();
    for (const callback of callbacks) callback();
  }

  function setPlatform(value: string) {
    Object.defineProperty(window.navigator, "platform", { value, configurable: true });
  }

  beforeEach(() => {
    pending = new Map();
    nextHandle = 1;

    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      const handle = nextHandle++;
      pending.set(handle, () => callback(0));
      return handle;
    }) as typeof window.requestAnimationFrame;

    window.cancelAnimationFrame = ((handle: number) => {
      pending.delete(handle);
    }) as typeof window.cancelAnimationFrame;

    visualViewport = new MockVisualViewport();
    Object.defineProperty(window, "visualViewport", {
      value: visualViewport,
      configurable: true,
    });
    setPlatform("iPhone");
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCaf;
    if (originalPlatform) {
      Object.defineProperty(window.navigator, "platform", originalPlatform);
    }
    if (originalVisualViewport) {
      Object.defineProperty(window, "visualViewport", originalVisualViewport);
    } else {
      Reflect.deleteProperty(window, "visualViewport");
    }
  });

  it("키보드 resize가 여러 번 발생해도 닫히면 원래 CSS 높이를 복원한다", () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen />);
    const drawer = getByTestId("drawer");
    const input = getByTestId("input-a");
    const rectSpy = mockRect(drawer, 560);

    drawer.style.height = "70vh";
    input.focus();

    visualViewport.height = window.innerHeight - 200;
    visualViewport.dispatchEvent(new Event("resize"));
    visualViewport.height = window.innerHeight - 400;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(drawer.style.height).toBe(`${window.innerHeight - 400 - WINDOW_TOP_OFFSET}px`);

    input.blur();
    act(() => flushFrames());

    expect(drawer.style.height).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    visualViewport.height = window.innerHeight;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(drawer.style.height).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    rectSpy.mockRestore();
  });

  it("iOS가 visual viewport를 패닝해도 시트 헤더가 화면 위로 밀려나지 않는다", () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen />);
    const drawer = getByTestId("drawer");
    const input = getByTestId("input-a");
    const rectSpy = mockRect(drawer, 560);

    drawer.style.minHeight = "70vh";
    input.focus();

    visualViewport.height = window.innerHeight - 400;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    visualViewport.offsetTop = 120;
    visualViewport.dispatchEvent(new Event("scroll"));

    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("280px");

    input.blur();
    act(() => flushFrames());

    expect(drawer.style.height).toBe("");
    expect(drawer.style.minHeight).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    rectSpy.mockRestore();
  });

  it("focusout 한 번이면 스냅 변경의 cleanup이 예약된 프레임을 취소한다", () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen snapPoints={["200px", "400px"]} />);
    const drawer = getByTestId("drawer");

    // 키보드가 올라와 시트가 들려 있는 상태
    drawer.style.bottom = "300px";

    fireEvent.focusOut(getByTestId("input-a"));
    expect(pending.size).toBe(1);

    act(() => {
      getByTestId("next-snap").click();
    });
    expect(pending.size).toBe(0);

    // 새 스냅이 자기 위치로 재배치한 뒤, 남은 프레임이 그 위를 덮지 않아야 한다
    drawer.style.bottom = "300px";
    act(() => flushFrames());

    expect(drawer.style.bottom).toBe("300px");
  });

  it("focusout이 같은 프레임에 두 번이어도 스냅 변경의 cleanup이 모든 프레임을 취소한다", () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen snapPoints={["200px", "400px"]} />);
    const drawer = getByTestId("drawer");

    drawer.style.bottom = "300px";

    fireEvent.focusOut(getByTestId("input-a"));
    fireEvent.focusOut(getByTestId("input-b"));
    // 프레임 핸들을 담는 슬롯이 하나뿐이라, 새로 예약하기 전에 직전 프레임을 취소해야
    // cleanup이 취소할 수 없는 고아 프레임이 남지 않는다
    expect(pending.size).toBe(1);

    act(() => {
      getByTestId("next-snap").click();
    });
    expect(pending.size).toBe(0);

    drawer.style.bottom = "300px";
    act(() => flushFrames());

    expect(drawer.style.bottom).toBe("300px");
  });

  it("iOS가 아니면 focusout 리스너를 등록하지 않는다", () => {
    setPlatform("Linux armv8l");

    const { getByTestId } = render(<KeyboardHarness defaultOpen snapPoints={["200px", "400px"]} />);
    const drawer = getByTestId("drawer");

    drawer.style.bottom = "300px";

    fireEvent.focusOut(getByTestId("input-a"));
    fireEvent.focusOut(getByTestId("input-b"));
    expect(pending.size).toBe(0);

    act(() => {
      getByTestId("next-snap").click();
    });
    drawer.style.bottom = "300px";
    act(() => flushFrames());

    expect(drawer.style.bottom).toBe("300px");
  });
});

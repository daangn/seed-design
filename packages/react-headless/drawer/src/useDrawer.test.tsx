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
        <div data-testid="drawer" role="dialog" ref={api.drawerRef}>
          <input data-testid="input-a" />
          <input data-testid="input-b" />
        </div>
      </div>
    );
  }

  function ScrollKeyboardHarness(props: UseDrawerProps) {
    const api = useDrawer(props);

    return (
      <div data-testid="drawer" role="dialog" ref={api.drawerRef}>
        <div data-testid="scrollable" style={{ overflowY: "auto" }}>
          <input data-testid="scroll-input" />
        </div>
      </div>
    );
  }

  function AutoFocusKeyboardHarness({ open }: { open: boolean }) {
    const api = useDrawer({ open });

    return (
      <div
        data-testid="drawer"
        role="dialog"
        ref={api.drawerRef}
        style={{ minHeight: "70vh", bottom: 0 }}
      >
        {open && <input data-testid="auto-focus-input" autoFocus />}
      </div>
    );
  }

  const originalVisualViewport = Object.getOwnPropertyDescriptor(window, "visualViewport");
  const originalPlatform = Object.getOwnPropertyDescriptor(window.navigator, "platform");
  const originalInnerHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");

  class MockVisualViewport extends EventTarget {
    height = window.innerHeight;
    offsetTop = 0;
    scale = 1;
  }

  let visualViewport: MockVisualViewport;

  beforeEach(() => {
    visualViewport = new MockVisualViewport();
    Object.defineProperty(window, "visualViewport", {
      value: visualViewport,
      configurable: true,
    });
    Object.defineProperty(window.navigator, "platform", {
      value: "iPhone",
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalVisualViewport) {
      Object.defineProperty(window, "visualViewport", originalVisualViewport);
    } else {
      Reflect.deleteProperty(window, "visualViewport");
    }

    if (originalPlatform) {
      Object.defineProperty(window.navigator, "platform", originalPlatform);
    } else {
      Reflect.deleteProperty(window.navigator, "platform");
    }

    if (originalInnerHeight) {
      Object.defineProperty(window, "innerHeight", originalInnerHeight);
    } else {
      Reflect.deleteProperty(window, "innerHeight");
    }
  });

  it("열림 커밋에서 autoFocus된 input이 이미 축소된 viewport를 즉시 반영한다", () => {
    const { getByTestId, rerender } = render(<AutoFocusKeyboardHarness open={false} />);
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 560);

    visualViewport.height = window.innerHeight - 400;
    rerender(<AutoFocusKeyboardHarness open />);

    expect(getByTestId("auto-focus-input")).toHaveFocus();
    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    rectSpy.mockRestore();
  });

  it("autoFocus 중 layout viewport도 함께 축소되어도 닫힌 상태의 높이를 기준으로 계산한다", () => {
    const { getByTestId, rerender } = render(<AutoFocusKeyboardHarness open={false} />);
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 560);
    const layoutViewportHeight = window.innerHeight;

    visualViewport.height = layoutViewportHeight - 400;
    Object.defineProperty(window, "innerHeight", {
      value: visualViewport.height,
      configurable: true,
    });
    rerender(<AutoFocusKeyboardHarness open />);

    expect(getByTestId("auto-focus-input")).toHaveFocus();
    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    rectSpy.mockRestore();
  });

  it("직전 키보드 해제 이벤트를 기다리는 중 다시 autoFocus되어도 축소된 viewport를 반영한다", () => {
    // Native autoFocus can run while the effect is being replaced, leaving the document-level
    // focusin listener without that event. Block focusin here so only the post-commit
    // reconciliation path can clear the previous dismissal guard.
    const blockFocusIn = (event: FocusEvent) => event.stopImmediatePropagation();
    document.addEventListener("focusin", blockFocusIn, true);

    const { getByTestId, rerender } = render(<AutoFocusKeyboardHarness open={false} />);
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 560);

    visualViewport.height = window.innerHeight - 400;
    rerender(<AutoFocusKeyboardHarness open />);

    // Close directly while the input and visual viewport are still in their keyboard-open state,
    // then reopen before visualViewport reports that the previous keyboard is gone.
    rerender(<AutoFocusKeyboardHarness open={false} />);
    rerender(<AutoFocusKeyboardHarness open />);

    document.removeEventListener("focusin", blockFocusIn, true);

    expect(getByTestId("auto-focus-input")).toHaveFocus();
    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    rectSpy.mockRestore();
  });

  it("닫힐 때 layout viewport가 아직 축소돼 있어도 다음 autoFocus의 기준 높이를 보존한다", () => {
    const { getByTestId, rerender } = render(<AutoFocusKeyboardHarness open={false} />);
    const drawer = getByTestId("drawer");
    const rectSpy = mockRect(drawer, 560);
    const layoutViewportHeight = window.innerHeight;

    visualViewport.height = layoutViewportHeight - 400;
    Object.defineProperty(window, "innerHeight", {
      value: visualViewport.height,
      configurable: true,
    });

    rerender(<AutoFocusKeyboardHarness open />);
    rerender(<AutoFocusKeyboardHarness open={false} />);
    rerender(<AutoFocusKeyboardHarness open />);

    expect(getByTestId("auto-focus-input")).toHaveFocus();
    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    rectSpy.mockRestore();
  });

  it("snap point가 없으면 keyboard window resize 중에도 viewport listener를 유지한다", () => {
    const removeEventListener = spyOn(visualViewport, "removeEventListener");
    render(<KeyboardHarness defaultOpen />);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(removeEventListener).not.toHaveBeenCalled();
    removeEventListener.mockRestore();
  });

  it("focusout에서 viewport 닫힘을 기다리지 않고 원래 CSS 높이를 복원한다", async () => {
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

    await act(async () => {
      input.blur();
      await Promise.resolve();
    });

    expect(drawer.style.height).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    // iOS가 키보드 닫힘 애니메이션 중 보내는 keyboard-open viewport 이벤트가 복원을
    // 취소하고 시트를 다시 들어 올리지 않아야 한다.
    visualViewport.dispatchEvent(new Event("resize"));
    expect(drawer.style.height).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    visualViewport.height = window.innerHeight;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(drawer.style.height).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    rectSpy.mockRestore();
  });

  it("iOS가 visual viewport를 패닝해도 시트 헤더가 화면 위로 밀려나지 않는다", async () => {
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

    await act(async () => {
      input.blur();
      await Promise.resolve();
    });

    expect(drawer.style.height).toBe("");
    expect(drawer.style.minHeight).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    visualViewport.height = window.innerHeight;
    visualViewport.offsetTop = 0;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(drawer.style.height).toBe("");
    expect(drawer.style.minHeight).toBe("70vh");
    expect(drawer.style.bottom).toBe("0px");

    rectSpy.mockRestore();
  });

  it("Drawer 내부의 다른 input으로 포커스가 이동하면 열린 키보드 위치를 유지한다", async () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen />);
    const drawer = getByTestId("drawer");
    const inputA = getByTestId("input-a");
    const inputB = getByTestId("input-b");
    const rectSpy = mockRect(drawer, 560);

    drawer.style.minHeight = "70vh";
    inputA.focus();
    visualViewport.height = window.innerHeight - 400;
    visualViewport.dispatchEvent(new Event("resize"));

    await act(async () => {
      inputB.focus();
      await Promise.resolve();
    });

    expect(drawer.style.height).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.minHeight).toBe(`${visualViewport.height - WINDOW_TOP_OFFSET}px`);
    expect(drawer.style.bottom).toBe("400px");

    rectSpy.mockRestore();
  });

  it("키보드가 가린 input은 Drawer 내부의 가장 가까운 스크롤 영역만 이동한다", () => {
    const { getByTestId } = render(<ScrollKeyboardHarness defaultOpen />);
    const drawer = getByTestId("drawer");
    const scrollable = getByTestId("scrollable");
    const input = getByTestId("scroll-input");
    const drawerRectSpy = mockRect(drawer, 560);

    Object.defineProperties(scrollable, {
      clientHeight: { value: 300, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
    });
    const scrollTo = mock(() => {});
    Object.defineProperty(scrollable, "scrollTo", { value: scrollTo, configurable: true });

    const scrollableRectSpy = spyOn(scrollable, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 320,
      height: window.innerHeight,
      top: 0,
      left: 0,
      right: 320,
      bottom: window.innerHeight,
      toJSON: () => {},
    });

    visualViewport.height = window.innerHeight - 400;
    const inputRectSpy = spyOn(input, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: visualViewport.height + 72,
      width: 280,
      height: 48,
      top: visualViewport.height + 72,
      left: 0,
      right: 280,
      bottom: visualViewport.height + 120,
      toJSON: () => {},
    });

    input.focus();
    visualViewport.dispatchEvent(new Event("resize"));

    expect(scrollTo).toHaveBeenCalledWith({ top: 120, behavior: "smooth" });
    expect(document.scrollingElement?.scrollTop ?? 0).toBe(0);

    inputRectSpy.mockRestore();
    scrollableRectSpy.mockRestore();
    drawerRectSpy.mockRestore();
  });

  it("키보드 전환 양방향에서 높이와 위치를 하나의 WAAPI 타임라인으로 보간한다", async () => {
    const { getByTestId } = render(<KeyboardHarness defaultOpen />);
    const drawer = getByTestId("drawer");
    const input = getByTestId("input-a");
    const layouts: Array<{
      height: string;
      minHeight: string;
      bottom: string;
      keyboardTransition: string;
    }> = [];
    const animation = {
      cancel: mock(() => {}),
      pause: mock(() => {}),
      play: mock(() => {}),
      currentTime: null,
      finished: new Promise<void>(() => {}),
    } as unknown as Animation;
    const animate = mock(() => animation);

    Object.defineProperty(drawer, "animate", {
      value: animate,
      configurable: true,
    });

    drawer.style.minHeight = "70vh";
    drawer.style.bottom = "0px";
    drawer.style.setProperty(
      "--drawer-keyboard-transition",
      "bottom 250ms cubic-bezier(0.32, 0.72, 0, 1)",
    );
    const rectSpy = spyOn(drawer, "getBoundingClientRect").mockImplementation(() => {
      const height = Number.parseFloat(drawer.style.height) || 560;
      const bottom = Number.parseFloat(drawer.style.bottom) || 0;

      layouts.push({
        height: drawer.style.height,
        minHeight: drawer.style.minHeight,
        bottom: drawer.style.bottom,
        keyboardTransition: drawer.style.getPropertyValue("--drawer-keyboard-transition"),
      });

      return {
        x: 0,
        y: window.innerHeight - bottom - height,
        width: 100,
        height,
        top: window.innerHeight - bottom - height,
        left: 0,
        right: 100,
        bottom: window.innerHeight - bottom,
        toJSON: () => {},
      };
    });

    input.focus();
    layouts.length = 0;
    visualViewport.height = window.innerHeight - 400;
    visualViewport.dispatchEvent(new Event("resize"));

    expect(layouts).toContainEqual({
      height: `${visualViewport.height - WINDOW_TOP_OFFSET}px`,
      minHeight: `${visualViewport.height - WINDOW_TOP_OFFSET}px`,
      bottom: "400px",
      keyboardTransition: "bottom 0s",
    });
    expect(animate).toHaveBeenNthCalledWith(
      1,
      [
        {
          height: "560px",
          minHeight: "560px",
          bottom: "0px",
        },
        {
          height: `${visualViewport.height - WINDOW_TOP_OFFSET}px`,
          minHeight: `${visualViewport.height - WINDOW_TOP_OFFSET}px`,
          bottom: "400px",
        },
      ],
      {
        duration: 250,
        easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        fill: "both",
      },
    );
    expect(animation.pause).toHaveBeenCalledTimes(1);
    expect(animation.play).toHaveBeenCalledTimes(1);
    expect(animation.currentTime).toBe(0);
    expect(drawer.style.getPropertyValue("--drawer-keyboard-transition")).toBe(
      "bottom 250ms cubic-bezier(0.32, 0.72, 0, 1)",
    );

    layouts.length = 0;
    await act(async () => {
      input.blur();
      await Promise.resolve();
    });

    expect(layouts).toContainEqual({
      height: "",
      minHeight: "70vh",
      bottom: "0px",
      keyboardTransition: "bottom 0s",
    });
    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenNthCalledWith(
      2,
      [
        {
          height: `${window.innerHeight - 400 - WINDOW_TOP_OFFSET}px`,
          minHeight: `${window.innerHeight - 400 - WINDOW_TOP_OFFSET}px`,
          bottom: "400px",
        },
        {
          height: "560px",
          minHeight: "560px",
          bottom: "0px",
        },
      ],
      {
        duration: 250,
        easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        fill: "both",
      },
    );
    expect(animation.pause).toHaveBeenCalledTimes(2);
    expect(animation.play).toHaveBeenCalledTimes(2);
    expect(drawer.style.getPropertyValue("--drawer-keyboard-transition")).toBe(
      "bottom 250ms cubic-bezier(0.32, 0.72, 0, 1)",
    );

    visualViewport.height = window.innerHeight;
    visualViewport.dispatchEvent(new Event("resize"));
    expect(animate).toHaveBeenCalledTimes(2);

    rectSpy.mockRestore();
  });
});

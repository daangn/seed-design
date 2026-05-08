import { act, fireEvent, render } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, jest, mock, spyOn } from "bun:test";
import * as React from "react";
import { DRAG_CLASS, TRANSITIONS } from "./constants";
import { useDrawer, type UseDrawerProps } from "./useDrawer";

interface DrawerHarnessProps extends UseDrawerProps {
  initialCloseButtonVisible?: boolean;
  onApi?: (api: ReturnType<typeof useDrawer>) => void;
}

function DrawerHarness({ initialCloseButtonVisible = false, onApi, ...props }: DrawerHarnessProps) {
  const api = useDrawer(props);
  const [showCloseButton, setShowCloseButton] = React.useState(initialCloseButtonVisible);

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
      <button
        data-testid="toggle-close-button"
        onClick={() => setShowCloseButton((visible) => !visible)}
      >
        닫기 버튼 토글
      </button>

      {showCloseButton ? <button data-testid="close-button" ref={api.closeButtonRef} /> : null}

      <div data-testid="is-open">{String(api.isOpen)}</div>
      <div data-testid="is-dragging">{String(api.isDragging)}</div>
      <div data-testid="active-snap-point">{String(api.activeSnapPoint)}</div>
      <div data-testid="has-animation-done">{String(api.hasAnimationDone)}</div>
      <div data-testid="should-overlay-animate">{String(api.shouldOverlayAnimate)}</div>
      <div data-testid="is-close-button-rendered">{String(api.isCloseButtonRendered)}</div>

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
    document.body.style.pointerEvents = "";
  });

  it("closeButtonRef를 통해 닫기 버튼 마운트 상태를 추적한다", () => {
    const { getByTestId } = render(<DrawerHarness />);

    expect(getByTestId("is-close-button-rendered")).toHaveTextContent("false");

    fireEvent.click(getByTestId("toggle-close-button"));
    expect(getByTestId("is-close-button-rendered")).toHaveTextContent("true");

    fireEvent.click(getByTestId("toggle-close-button"));
    expect(getByTestId("is-close-button-rendered")).toHaveTextContent("false");
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
    expect(document.body.style.pointerEvents).toBe("auto");

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

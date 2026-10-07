import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockEngineOptions {
  driver: unknown;
  scheduler: unknown;
  getRootNode(): unknown;
  getScrollNode(): unknown;
  getSpacerNode(): unknown;
  hasFooter(): boolean;
  setFooterOffset(offset: number): void;
  onEvaluated?(): void;
  getKeyboardGap(): number;
  getToolbarHeight(): number;
  getSmooth(): boolean;
}

const mocks = vi.hoisted(() => {
  const engine = {
    focus: vi.fn(),
    blur: vi.fn(),
    layoutChanged: vi.fn(),
    unregister: vi.fn(),
    keyboardChanged: vi.fn(),
    viewportChanged: vi.fn(),
    userScrollStarted: vi.fn(),
    userScrollEnded: vi.fn(),
    dispose: vi.fn(),
  };
  const unsubscribe = vi.fn();

  return {
    engine,
    createEngine: vi.fn((_options: MockEngineOptions) => engine),
    nativeDriver: {},
    keyboardSource: {
      listener: null as ((state: { visible: boolean; height: number }) => void) | null,
      initialStateDelay: 0,
      subscribe: vi.fn(),
      unsubscribe,
    },
  };
});

vi.mock("./engine.js", () => ({
  createKeyboardAvoidingEngine: mocks.createEngine,
}));

vi.mock("./native-driver.js", () => ({
  lynxKeyboardAvoidingNativeDriver: mocks.nativeDriver,
}));

vi.mock("./keyboard-event-source.js", () => ({
  lynxKeyboardEventSource: {
    subscribe: mocks.keyboardSource.subscribe,
    getInitialStateDelay: () => mocks.keyboardSource.initialStateDelay,
  },
}));

import { useEffect } from "@lynx-js/react";

import * as KeyboardAvoidingScrollView from "./KeyboardAvoidingScrollView.namespace.js";
import type { KeyboardAvoidanceRegistration } from "./useKeyboardAvoidingScrollView.js";
import { useKeyboardAvoidingScrollViewContext } from "./useKeyboardAvoidingScrollViewContext.js";

function ContextConsumer({ registration }: { registration: KeyboardAvoidanceRegistration }) {
  const actions = useKeyboardAvoidingScrollViewContext();

  useEffect(() => {
    actions.focus(registration);
    actions.layoutChanged(registration.owner);

    return () => {
      actions.blur(registration.owner);
      actions.unregister(registration.owner);
    };
  }, [actions, registration]);

  return <view />;
}

function getElement(container: HTMLElement, selector: string): Element {
  const element = container.querySelector(selector);
  if (!element) {
    throw new Error(`${selector}가 렌더되어야 합니다.`);
  }
  return element;
}

function getEventTargetRef(ref: { current: NodesRef | null }): HTMLElement {
  if (!ref.current) {
    throw new Error("scroll-view NodesRef가 연결되어야 합니다.");
  }
  return ref.current as unknown as HTMLElement;
}

function getEngineOptions(): MockEngineOptions {
  const options = mocks.createEngine.mock.calls[0]?.[0];
  if (!options) {
    throw new Error("엔진이 생성되어야 합니다.");
  }
  return options;
}

describe("KeyboardAvoidingScrollView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.keyboardSource.listener = null;
    mocks.keyboardSource.initialStateDelay = 0;
    mocks.keyboardSource.subscribe.mockImplementation((listener) => {
      mocks.keyboardSource.listener = listener;
      return mocks.keyboardSource.unsubscribe;
    });
  });

  it("renders Content as a forced vertical scroll-view with an internal native spacer", () => {
    const conflictingNativeProps = {
      flatten: true,
      "scroll-orientation": "horizontal",
    } as unknown as KeyboardAvoidingScrollView.ContentProps;
    const { container, getByText } = render(
      <KeyboardAvoidingScrollView.Root id="root">
        <KeyboardAvoidingScrollView.Content
          {...conflictingNativeProps}
          id="form"
          className="custom-scroll"
        >
          <text>Form content</text>
        </KeyboardAvoidingScrollView.Content>
      </KeyboardAvoidingScrollView.Root>,
    );

    const root = getElement(container, "#root");
    const scrollView = getElement(container, "scroll-view");
    const spacer = scrollView.lastElementChild;

    expect(root).toContainElement(scrollView as HTMLElement);
    expect(scrollView).toHaveAttribute("scroll-orientation", "vertical");
    expect(scrollView).toHaveAttribute("id", "form");
    expect(scrollView).toHaveClass("custom-scroll");
    expect(scrollView).toContainElement(getByText("Form content") as HTMLElement);
    expect(spacer?.tagName.toLowerCase()).toBe("view");
    expect(spacer).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("composes viewport and user-scroll event handlers", () => {
    const bindlayoutchange = vi.fn();
    const bindtouchstart = vi.fn();
    const bindtouchend = vi.fn();
    const bindtouchcancel = vi.fn();
    const bindscroll = vi.fn();
    const bindscrollend = vi.fn();
    const scrollRef = { current: null as NodesRef | null };
    render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content
          ref={scrollRef}
          bindlayoutchange={bindlayoutchange}
          bindtouchstart={bindtouchstart}
          bindtouchend={bindtouchend}
          bindtouchcancel={bindtouchcancel}
          bindscroll={bindscroll}
          bindscrollend={bindscrollend}
        />
      </KeyboardAvoidingScrollView.Root>,
    );
    const scrollView = getEventTargetRef(scrollRef);

    act(() => {
      fireEvent.layoutchange(scrollView, {});
      fireEvent.touchstart(scrollView, {});
      fireEvent.scroll(scrollView, {});
      fireEvent.touchend(scrollView, {});
    });

    expect(bindlayoutchange).toHaveBeenCalledTimes(1);
    expect(mocks.engine.viewportChanged).toHaveBeenCalledTimes(1);
    expect(bindtouchstart).toHaveBeenCalledTimes(1);
    expect(mocks.engine.userScrollStarted).toHaveBeenCalledTimes(1);
    expect(bindscroll).toHaveBeenCalledTimes(1);
    expect(bindtouchend).toHaveBeenCalledTimes(1);
    expect(mocks.engine.userScrollEnded).not.toHaveBeenCalled();

    act(() => {
      fireEvent.scrollend(scrollView, {});
      fireEvent.touchstart(scrollView, {});
      fireEvent.touchcancel(scrollView, {});
    });

    expect(bindscrollend).toHaveBeenCalledTimes(1);
    expect(bindtouchcancel).toHaveBeenCalledTimes(1);
    expect(mocks.engine.userScrollStarted).toHaveBeenCalledTimes(2);
    expect(mocks.engine.userScrollEnded).toHaveBeenCalledTimes(2);
  });

  it("ends a touch that did not scroll without waiting for scrollend", () => {
    const scrollRef = { current: null as NodesRef | null };
    render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content ref={scrollRef} />
      </KeyboardAvoidingScrollView.Root>,
    );
    const scrollView = getEventTargetRef(scrollRef);

    act(() => {
      fireEvent.touchstart(scrollView, {});
      fireEvent.touchend(scrollView, {});
    });

    expect(mocks.engine.userScrollStarted).toHaveBeenCalledTimes(1);
    expect(mocks.engine.userScrollEnded).toHaveBeenCalledTimes(1);
  });

  it("updates engine state before invoking the user handler", () => {
    const bindlayoutchange = vi.fn();
    const scrollRef = { current: null as NodesRef | null };
    render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content ref={scrollRef} bindlayoutchange={bindlayoutchange} />
      </KeyboardAvoidingScrollView.Root>,
    );
    const scrollView = getEventTargetRef(scrollRef);

    fireEvent.layoutchange(scrollView, {});

    expect(bindlayoutchange).toHaveBeenCalledTimes(1);
    expect(mocks.engine.viewportChanged).toHaveBeenCalledTimes(1);
    expect(mocks.engine.viewportChanged.mock.invocationCallOrder[0]).toBeLessThan(
      bindlayoutchange.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it("keeps engine options live without recreating the engine", () => {
    const { rerender } = render(
      <KeyboardAvoidingScrollView.Root keyboardGap={32} scrollBehavior="smooth" />,
    );
    const options = getEngineOptions();

    expect(options.driver).toBe(mocks.nativeDriver);
    expect(options.getKeyboardGap()).toBe(32);
    expect(options.getToolbarHeight()).toBe(0);
    expect(options.getSmooth()).toBe(true);

    rerender(<KeyboardAvoidingScrollView.Root keyboardGap={-8} scrollBehavior="instant" />);

    expect(mocks.createEngine).toHaveBeenCalledTimes(1);
    expect(options.getKeyboardGap()).toBe(-8);
    expect(options.getSmooth()).toBe(false);
    expect(mocks.engine.viewportChanged).toHaveBeenCalledTimes(1);
  });

  it("forwards registration actions through a stable context", () => {
    const registration: KeyboardAvoidanceRegistration = {
      owner: {},
      nativeRef: { current: null },
    };
    const { rerender, unmount } = render(
      <KeyboardAvoidingScrollView.Root keyboardGap={24}>
        <KeyboardAvoidingScrollView.Content>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Content>
      </KeyboardAvoidingScrollView.Root>,
    );

    expect(mocks.engine.focus).toHaveBeenCalledWith(registration);
    expect(mocks.engine.layoutChanged).toHaveBeenCalledWith(registration.owner);

    rerender(
      <KeyboardAvoidingScrollView.Root keyboardGap={48}>
        <KeyboardAvoidingScrollView.Content>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Content>
      </KeyboardAvoidingScrollView.Root>,
    );
    expect(mocks.engine.focus).toHaveBeenCalledTimes(1);

    unmount();
    expect(mocks.engine.blur).toHaveBeenCalledWith(registration.owner);
    expect(mocks.engine.unregister).toHaveBeenCalledWith(registration.owner);
  });

  it("registers inputs inside the Footer as Footer placements", () => {
    const registration: KeyboardAvoidanceRegistration = {
      owner: {},
      nativeRef: { current: null },
    };
    render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content />
        <KeyboardAvoidingScrollView.Footer>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Footer>
      </KeyboardAvoidingScrollView.Root>,
    );

    expect(mocks.engine.focus).toHaveBeenCalledWith({ ...registration, placement: "footer" });
  });

  it("moves the Footer by the offset the engine applies while it is mounted", () => {
    const { container, rerender } = render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content />
        <KeyboardAvoidingScrollView.Footer id="footer" style={{ paddingBottom: "8px" }} />
      </KeyboardAvoidingScrollView.Root>,
    );
    const options = getEngineOptions();

    expect(options.hasFooter()).toBe(true);
    expect(getElement(container, "#footer")).toHaveStyle({
      paddingBottom: "8px",
      transform: "translateY(0px)",
    });

    act(() => {
      options.setFooterOffset(300);
    });

    expect(getElement(container, "#footer")).toHaveStyle({ transform: "translateY(-300px)" });

    rerender(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content />
      </KeyboardAvoidingScrollView.Root>,
    );

    expect(options.hasFooter()).toBe(false);
  });

  it("keeps the Footer hidden and unplaced until Android's initial keyboard state can arrive", () => {
    const registration: KeyboardAvoidanceRegistration = { owner: {}, nativeRef: { current: null } };
    mocks.keyboardSource.initialStateDelay = 100;
    const { container } = render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Content>
        <KeyboardAvoidingScrollView.Footer id="footer" style={{ transition: "transform 1s" }} />
      </KeyboardAvoidingScrollView.Root>,
    );
    const options = getEngineOptions();

    act(() => {
      options.onEvaluated?.();
    });

    // 입력이 focus됐어도 초기 상태를 기다리는 동안에는 숨긴 채 transition 없이 둔다.
    expect(getElement(container, "#footer")).toHaveStyle({
      opacity: "0",
      transition: "transform 0s",
    });

    mocks.keyboardSource.initialStateDelay = 0;
    act(() => {
      options.setFooterOffset(48);
      options.onEvaluated?.();
    });

    expect(getElement(container, "#footer")).toHaveStyle({
      transform: "translateY(-48px)",
      transition: "transform 1s",
    });
  });

  it("places the Footer without a transition until an input focuses after the first evaluation", () => {
    const registration: KeyboardAvoidanceRegistration = { owner: {}, nativeRef: { current: null } };
    const { container, rerender } = render(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content />
        <KeyboardAvoidingScrollView.Footer id="footer" style={{ transition: "transform 1s" }} />
      </KeyboardAvoidingScrollView.Root>,
    );
    const options = getEngineOptions();

    // Lynx Go처럼 입력 focus 없이 첫 평가 뒤에 온 내비게이션 바 높이도 첫 위치로 놓는다.
    act(() => {
      options.onEvaluated?.();
      options.setFooterOffset(48);
    });

    expect(getElement(container, "#footer")).toHaveStyle({
      transform: "translateY(-48px)",
      transition: "transform 0s",
    });

    rerender(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Content>
        <KeyboardAvoidingScrollView.Footer id="footer" style={{ transition: "transform 1s" }} />
      </KeyboardAvoidingScrollView.Root>,
    );

    expect(getElement(container, "#footer")).toHaveStyle({ transition: "transform 1s" });

    rerender(
      <KeyboardAvoidingScrollView.Root>
        <KeyboardAvoidingScrollView.Content>
          <ContextConsumer registration={registration} />
        </KeyboardAvoidingScrollView.Content>
        <KeyboardAvoidingScrollView.Footer id="footer" />
      </KeyboardAvoidingScrollView.Root>,
    );

    expect(getElement(container, "#footer").style.transition).toMatch(/^transform 0\.4s/);
  });

  it("subscribes keyboard state and cleans up the shared source and engine", () => {
    const { unmount } = render(<KeyboardAvoidingScrollView.Root />);

    expect(mocks.keyboardSource.subscribe).toHaveBeenCalledTimes(1);

    act(() => {
      mocks.keyboardSource.listener?.({ visible: true, height: 320 });
    });
    expect(mocks.engine.keyboardChanged).toHaveBeenCalledWith({ visible: true, height: 320 });

    unmount();
    expect(mocks.keyboardSource.unsubscribe).toHaveBeenCalledTimes(1);
    expect(mocks.engine.dispose).toHaveBeenCalledTimes(1);
  });
});

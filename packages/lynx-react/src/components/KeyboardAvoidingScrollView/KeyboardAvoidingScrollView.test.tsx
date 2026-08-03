import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockEngineOptions {
  driver: unknown;
  scheduler: unknown;
  getScrollNode(): unknown;
  getSpacerNode(): unknown;
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
      subscribe: vi.fn(),
      unsubscribe,
    },
  };
});

vi.mock("./engine", () => ({
  createKeyboardAvoidingEngine: mocks.createEngine,
}));

vi.mock("./native-driver", () => ({
  lynxKeyboardAvoidingNativeDriver: mocks.nativeDriver,
}));

vi.mock("./keyboard-event-source", () => ({
  lynxKeyboardEventSource: {
    subscribe: mocks.keyboardSource.subscribe,
  },
}));

import { useEffect } from "@lynx-js/react";

import { useKeyboardAvoidanceActions, type KeyboardAvoidanceRegistration } from "./context";
import {
  KeyboardAvoidingScrollView,
  type KeyboardAvoidingScrollViewProps,
} from "./KeyboardAvoidingScrollView";

function ContextConsumer({ registration }: { registration: KeyboardAvoidanceRegistration }) {
  const actions = useKeyboardAvoidanceActions();

  useEffect(() => {
    if (!actions) {
      throw new Error("KeyboardAvoidingScrollView context가 필요합니다.");
    }

    actions.focus(registration);
    actions.layoutChanged(registration.owner);

    return () => {
      actions.blur(registration.owner);
      actions.unregister(registration.owner);
    };
  }, [actions, registration]);

  return <view />;
}

function getScrollView(container: HTMLElement): Element {
  const scrollView = container.querySelector("scroll-view");
  if (!scrollView) {
    throw new Error("scroll-view가 렌더되어야 합니다.");
  }
  return scrollView;
}

function getEventTargetRef(ref: { current: NodesRef | null }): HTMLElement {
  if (!ref.current) {
    throw new Error("scroll-view NodesRef가 연결되어야 합니다.");
  }
  return ref.current as unknown as HTMLElement;
}

describe("KeyboardAvoidingScrollView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.keyboardSource.listener = null;
    mocks.keyboardSource.subscribe.mockImplementation((listener) => {
      mocks.keyboardSource.listener = listener;
      return mocks.keyboardSource.unsubscribe;
    });
  });

  it("renders a forced vertical scroll-view and an internal native spacer", () => {
    const conflictingNativeProps = {
      flatten: true,
      "scroll-orientation": "horizontal",
    } as unknown as KeyboardAvoidingScrollViewProps;
    const { container, getByText } = render(
      <KeyboardAvoidingScrollView {...conflictingNativeProps} id="form" className="custom-scroll">
        <text>Form content</text>
      </KeyboardAvoidingScrollView>,
    );

    const scrollView = getScrollView(container);
    const spacer = scrollView.lastElementChild;

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
      <KeyboardAvoidingScrollView
        ref={scrollRef}
        bindlayoutchange={bindlayoutchange}
        bindtouchstart={bindtouchstart}
        bindtouchend={bindtouchend}
        bindtouchcancel={bindtouchcancel}
        bindscroll={bindscroll}
        bindscrollend={bindscrollend}
      />,
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
    render(<KeyboardAvoidingScrollView ref={scrollRef} />);
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
    render(<KeyboardAvoidingScrollView ref={scrollRef} bindlayoutchange={bindlayoutchange} />);
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
      <KeyboardAvoidingScrollView keyboardGap={32} scrollBehavior="smooth" />,
    );
    const options = mocks.createEngine.mock.calls[0]?.[0];

    expect(options?.driver).toBe(mocks.nativeDriver);
    expect(options?.getKeyboardGap()).toBe(32);
    expect(options?.getToolbarHeight()).toBe(0);
    expect(options?.getSmooth()).toBe(true);

    rerender(<KeyboardAvoidingScrollView keyboardGap={-8} scrollBehavior="instant" />);

    expect(mocks.createEngine).toHaveBeenCalledTimes(1);
    expect(options?.getKeyboardGap()).toBe(-8);
    expect(options?.getSmooth()).toBe(false);
    expect(mocks.engine.viewportChanged).toHaveBeenCalledTimes(1);
  });

  it("forwards private registration actions through a stable context", () => {
    const registration: KeyboardAvoidanceRegistration = {
      owner: {},
      nativeRef: { current: null },
    };
    const { rerender, unmount } = render(
      <KeyboardAvoidingScrollView keyboardGap={24}>
        <ContextConsumer registration={registration} />
      </KeyboardAvoidingScrollView>,
    );

    expect(mocks.engine.focus).toHaveBeenCalledWith(registration);
    expect(mocks.engine.layoutChanged).toHaveBeenCalledWith(registration.owner);

    rerender(
      <KeyboardAvoidingScrollView keyboardGap={48}>
        <ContextConsumer registration={registration} />
      </KeyboardAvoidingScrollView>,
    );
    expect(mocks.engine.focus).toHaveBeenCalledTimes(1);

    unmount();
    expect(mocks.engine.blur).toHaveBeenCalledWith(registration.owner);
    expect(mocks.engine.unregister).toHaveBeenCalledWith(registration.owner);
  });

  it("subscribes keyboard state and cleans up the shared source and engine", () => {
    const { unmount } = render(<KeyboardAvoidingScrollView />);

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

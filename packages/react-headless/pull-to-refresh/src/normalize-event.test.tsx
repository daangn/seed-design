import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, mock } from "bun:test";

import { getClientY, isLeftPress, touchEnd, touchMove, touchStart } from "./normalize-event";

// `isLeftPress` / `getClientY` take React synthetic events, so drive them through a
// real render instead of hand-rolling event objects.
function LeftPressProbe({ onResult }: { onResult: (value: boolean) => void }) {
  return (
    <div
      data-testid="target"
      onPointerMove={(e) => onResult(isLeftPress(e))}
      onTouchMove={(e) => onResult(isLeftPress(e))}
    />
  );
}

function ClientYProbe({ onResult }: { onResult: (value: number) => void }) {
  return (
    <div
      data-testid="target"
      onPointerMove={(e) => onResult(getClientY(e))}
      onTouchMove={(e) => onResult(getClientY(e))}
    />
  );
}

describe("normalize-event handler names", () => {
  it("binds pointer handlers when the environment has no touch support", () => {
    // happy-dom does not define `ontouchstart`, which is the branch this module
    // resolves once at load time.
    expect("ontouchstart" in window).toBe(false);
    expect(touchStart).toBe("onPointerDown");
    expect(touchMove).toBe("onPointerMove");
    expect(touchEnd).toBe("onPointerUp");
  });

  it("binds touch handlers when the environment has touch support", async () => {
    Object.defineProperty(window, "ontouchstart", {
      value: null,
      configurable: true,
      writable: true,
    });

    try {
      // The branch is evaluated at module scope, so the module has to be
      // re-evaluated. The query suffix busts bun's module cache.
      const specifier = "./normalize-event.ts?touch-supported";
      const touchModule: typeof import("./normalize-event") = await import(specifier);

      expect(touchModule.touchStart).toBe("onTouchStart");
      expect(touchModule.touchMove).toBe("onTouchMove");
      expect(touchModule.touchEnd).toBe("onTouchEnd");
    } finally {
      Reflect.deleteProperty(window, "ontouchstart");
    }
  });
});

describe("isLeftPress", () => {
  const onResult = mock((_value: boolean) => {});

  afterEach(() => {
    onResult.mockClear();
  });

  it("is true for a pointer event with the primary button held", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.pointerMove(getByTestId("target"), { buttons: 1, clientY: 10 });

    expect(onResult).toHaveBeenLastCalledWith(true);
  });

  it("is false for a pointer event with no button held", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.pointerMove(getByTestId("target"), { buttons: 0, clientY: 10 });

    expect(onResult).toHaveBeenLastCalledWith(false);
  });

  it("is false for a pointer event with a non-primary button held", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.pointerMove(getByTestId("target"), { buttons: 2, clientY: 10 });

    expect(onResult).toHaveBeenLastCalledWith(false);
  });

  it("is true for a single-finger touch event", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.touchMove(getByTestId("target"), { touches: [{ clientY: 10 }] });

    expect(onResult).toHaveBeenLastCalledWith(true);
  });

  it("is false for a multi-finger touch event", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.touchMove(getByTestId("target"), {
      touches: [{ clientY: 10 }, { clientY: 20 }],
    });

    expect(onResult).toHaveBeenLastCalledWith(false);
  });

  it("is false for a touch event with no active touches", () => {
    const { getByTestId } = render(<LeftPressProbe onResult={onResult} />);

    fireEvent.touchMove(getByTestId("target"), { touches: [] });

    expect(onResult).toHaveBeenLastCalledWith(false);
  });
});

describe("getClientY", () => {
  const onResult = mock((_value: number) => {});

  afterEach(() => {
    onResult.mockClear();
  });

  it("reads clientY straight off a pointer event", () => {
    const { getByTestId } = render(<ClientYProbe onResult={onResult} />);

    fireEvent.pointerMove(getByTestId("target"), { buttons: 1, clientY: 123 });

    expect(onResult).toHaveBeenLastCalledWith(123);
  });

  it("reads clientY off the first touch of a touch event", () => {
    const { getByTestId } = render(<ClientYProbe onResult={onResult} />);

    fireEvent.touchMove(getByTestId("target"), {
      touches: [{ clientY: 77 }, { clientY: 99 }],
    });

    expect(onResult).toHaveBeenLastCalledWith(77);
  });
});

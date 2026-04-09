import { render, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, mock, beforeEach } from "bun:test";
import * as React from "react";
import { useDismissibleLayer, type UseDismissibleLayerOptions } from "./useDismissibleLayer";

function DismissibleBox({
  options,
  children,
  ...divProps
}: {
  options: UseDismissibleLayerOptions;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { dismissibleRef, dismissibleProps } = useDismissibleLayer(options);

  return (
    <div ref={dismissibleRef} data-testid="dismissible" {...dismissibleProps} {...divProps}>
      {children}
    </div>
  );
}

function NestedLayers({
  outerOptions,
  innerOptions,
}: {
  outerOptions: UseDismissibleLayerOptions;
  innerOptions: UseDismissibleLayerOptions;
}) {
  const { dismissibleRef: outerRef, dismissibleProps: outerProps } =
    useDismissibleLayer(outerOptions);
  const { dismissibleRef: innerRef, dismissibleProps: innerProps } =
    useDismissibleLayer(innerOptions);

  return (
    <div ref={outerRef} data-testid="outer" {...outerProps}>
      <div ref={innerRef} data-testid="inner" {...innerProps}>
        <button type="button" data-testid="inner-button">
          Inner
        </button>
      </div>
    </div>
  );
}

describe("useDismissibleLayer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  describe("enabled", () => {
    it("does not call onEscapeKeyDown when enabled is false", () => {
      const onEscapeKeyDown = mock(() => {});
      render(<DismissibleBox options={{ enabled: false, onEscapeKeyDown }} />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onEscapeKeyDown).not.toHaveBeenCalled();
    });

    it("calls onEscapeKeyDown when enabled is true", () => {
      const onEscapeKeyDown = mock(() => {});
      render(<DismissibleBox options={{ enabled: true, onEscapeKeyDown }} />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    });
  });
  describe("escape", () => {
    it("calls onEscapeKeyDown on Escape", () => {
      const onEscapeKeyDown = mock(() => {});
      render(<DismissibleBox options={{ enabled: true, onEscapeKeyDown }} />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    });

    it("only topmost layer receives onEscapeKeyDown in nested scenario", () => {
      const outerEscape = mock(() => {});
      const innerEscape = mock(() => {});

      render(
        <NestedLayers
          outerOptions={{ enabled: true, onEscapeKeyDown: outerEscape }}
          innerOptions={{ enabled: true, onEscapeKeyDown: innerEscape }}
        />,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(innerEscape).toHaveBeenCalledTimes(1);
      expect(outerEscape).not.toHaveBeenCalled();
    });

    it("outer layer receives Escape after inner is disabled", () => {
      const outerEscape = mock(() => {});
      const innerEscape = mock(() => {});

      const { rerender } = render(
        <NestedLayers
          outerOptions={{ enabled: true, onEscapeKeyDown: outerEscape }}
          innerOptions={{ enabled: true, onEscapeKeyDown: innerEscape }}
        />,
      );

      rerender(
        <NestedLayers
          outerOptions={{ enabled: true, onEscapeKeyDown: outerEscape }}
          innerOptions={{ enabled: false, onEscapeKeyDown: innerEscape }}
        />,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(outerEscape).toHaveBeenCalledTimes(1);
      expect(innerEscape).not.toHaveBeenCalled();
    });

    it("ignores Escape during IME composition", () => {
      const onEscapeKeyDown = mock(() => {});
      render(<DismissibleBox options={{ enabled: true, onEscapeKeyDown }} />);

      fireEvent.keyDown(document, { key: "Escape", isComposing: true });
      expect(onEscapeKeyDown).not.toHaveBeenCalled();
    });
  });
  describe("pointer down outside", () => {
    it("calls onPressOutside when clicking outside", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );

      await act(() => new Promise((r) => setTimeout(r, 10)));

      const outside = document.querySelector('[data-testid="outside"]');
      if (!outside) throw new Error("Outside button not found");

      fireEvent.pointerDown(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("does not call onPressOutside when clicking inside", async () => {
      const onPressOutside = mock(() => {});
      const { getByTestId } = render(
        <DismissibleBox options={{ enabled: true, onPressOutside }}>
          <button type="button" data-testid="inside">
            Inside
          </button>
        </DismissibleBox>,
      );

      await act(() => new Promise((r) => setTimeout(r, 10)));

      fireEvent.pointerDown(getByTestId("inside"));
      expect(onPressOutside).not.toHaveBeenCalled();
    });

    it("does not call onPressOutside when clicking an excluded target", async () => {
      const onPressOutside = mock(() => {});
      const triggerRef = React.createRef<HTMLButtonElement>();

      function TestComponent() {
        const { dismissibleRef, dismissibleProps } = useDismissibleLayer({
          enabled: true,
          onPressOutside,
          exclude: (target) => triggerRef.current?.contains(target) ?? false,
        });

        return (
          <>
            <button type="button" ref={triggerRef} data-testid="trigger">
              Trigger
            </button>
            <div ref={dismissibleRef} data-testid="content" {...dismissibleProps}>
              Content
            </div>
          </>
        );
      }

      render(<TestComponent />);
      await act(() => new Promise((r) => setTimeout(r, 10)));

      const trigger = document.querySelector('[data-testid="trigger"]');
      if (!trigger) throw new Error("Trigger not found");

      fireEvent.pointerDown(trigger);
      expect(onPressOutside).not.toHaveBeenCalled();
    });
  });
  describe("preventDefault bridge", () => {
    it("consumer preventDefault on escape signals to parent layers", () => {
      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });

      render(
        <DismissibleBox
          options={{
            enabled: true,
            onEscapeKeyDown: (e) => e.preventDefault(),
          }}
        />,
      );

      document.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    // NOTE: We only test click-defer (default) flow here.
    // The "drag" mode tests are in the "touch outside mode: drag" describe block.
    it("consumer preventDefault on pointerdown signals to parent layers", async () => {
      render(
        <>
          <DismissibleBox
            options={{
              enabled: true,
              onPressOutside: (e) => e.preventDefault(),
            }}
          />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );

      await act(() => new Promise((r) => setTimeout(r, 10)));

      const event = new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
      });
      const outside = document.querySelector('[data-testid="outside"]');
      if (!outside) throw new Error("Outside button not found");

      outside.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("pressBehavior", () => {
    const wait = (ms = 10) => act(() => new Promise((r) => setTimeout(r, ms)));

    function touchStart(el: Element, x: number, y: number) {
      fireEvent.touchStart(el, { touches: [{ clientX: x, clientY: y }] });
    }

    function touchMove(el: Element, x: number, y: number) {
      fireEvent.touchMove(el, { touches: [{ clientX: x, clientY: y }] });
    }

    function touchEnd(el: Element) {
      fireEvent.touchEnd(el, { touches: [] });
    }

    it("does not dismiss on pointerdown with pointerType touch", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      fireEvent.pointerDown(outside, { pointerType: "touch" });
      expect(onPressOutside).not.toHaveBeenCalled();
    });

    it("dismisses immediately when touch moves > 10px outside", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(outside, 100, 100);
      touchMove(outside, 100, 115); // delta 15px > 10px
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("dismisses on touchend when touch moves > 5px but < 10px", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(outside, 100, 100);
      touchMove(outside, 100, 107); // delta 7px: > 5px, < 10px
      expect(onPressOutside).not.toHaveBeenCalled();

      touchEnd(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("defers tap to click when touch moves < 5px", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(outside, 100, 100);
      touchMove(outside, 100, 103); // delta 3px < 5px
      touchEnd(outside);
      // Not dismissed yet — deferred to click
      expect(onPressOutside).not.toHaveBeenCalled();

      fireEvent.click(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("suppresses synthetic pointerdown after touch drag dismiss", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(outside, 100, 100);
      touchMove(outside, 100, 115); // dismiss
      expect(onPressOutside).toHaveBeenCalledTimes(1);

      // synthetic pointerdown after touch — should be suppressed
      fireEvent.pointerDown(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("click-through guard expires after 1000ms", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(outside, 100, 100);
      touchMove(outside, 100, 115); // dismiss
      expect(onPressOutside).toHaveBeenCalledTimes(1);

      await wait(1100);

      fireEvent.pointerDown(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(2);
    });

    it("does not dismiss when touchstart is inside the layer", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }}>
            <button type="button" data-testid="inside">
              Inside
            </button>
          </DismissibleBox>
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const inside = document.querySelector('[data-testid="inside"]')!;
      const outside = document.querySelector('[data-testid="outside"]')!;
      touchStart(inside, 100, 100);
      touchMove(outside, 100, 115);
      touchEnd(outside);
      expect(onPressOutside).not.toHaveBeenCalled();
    });

    it("does not dismiss when touchstart target is excluded", async () => {
      const onPressOutside = mock(() => {});
      const triggerRef = React.createRef<HTMLButtonElement>();

      function TestComponent() {
        const { dismissibleRef, dismissibleProps } = useDismissibleLayer({
          enabled: true,
          onPressOutside,
          pressBehavior: "drag",
          exclude: (target) => triggerRef.current?.contains(target) ?? false,
        });

        return (
          <>
            <button type="button" ref={triggerRef} data-testid="trigger">
              Trigger
            </button>
            <div ref={dismissibleRef} data-testid="content" {...dismissibleProps}>
              Content
            </div>
          </>
        );
      }

      render(<TestComponent />);
      await wait();

      const trigger = document.querySelector('[data-testid="trigger"]')!;
      touchStart(trigger, 100, 100);
      touchMove(trigger, 100, 115);
      expect(onPressOutside).not.toHaveBeenCalled();
    });

    it("default mode still defers touch to click", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      fireEvent.pointerDown(outside, { pointerType: "touch" });
      // click-defer: pointerdown alone should not dismiss
      expect(onPressOutside).not.toHaveBeenCalled();

      fireEvent.click(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("mouse pointerdown still dismisses immediately in drag mode", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "drag" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      fireEvent.pointerDown(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });

    it("does not dismiss on pointerdown in confirm mode", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "confirm" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      fireEvent.pointerDown(outside);
      expect(onPressOutside).not.toHaveBeenCalled();
    });

    it("dismisses on click in confirm mode", async () => {
      const onPressOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPressOutside, pressBehavior: "confirm" }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );
      await wait();

      const outside = document.querySelector('[data-testid="outside"]')!;
      fireEvent.pointerDown(outside);
      expect(onPressOutside).not.toHaveBeenCalled();

      fireEvent.click(outside);
      expect(onPressOutside).toHaveBeenCalledTimes(1);
    });
  });
});

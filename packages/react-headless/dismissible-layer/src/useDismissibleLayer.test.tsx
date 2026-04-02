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
    it("calls onPointerDownOutside when clicking outside", async () => {
      const onPointerDownOutside = mock(() => {});
      render(
        <>
          <DismissibleBox options={{ enabled: true, onPointerDownOutside }} />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </>,
      );

      await act(() => new Promise((r) => setTimeout(r, 10)));

      const outside = document.querySelector('[data-testid="outside"]');
      if (!outside) throw new Error("Outside button not found");

      fireEvent.pointerDown(outside);
      expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    });

    it("does not call onPointerDownOutside when clicking inside", async () => {
      const onPointerDownOutside = mock(() => {});
      const { getByTestId } = render(
        <DismissibleBox options={{ enabled: true, onPointerDownOutside }}>
          <button type="button" data-testid="inside">
            Inside
          </button>
        </DismissibleBox>,
      );

      await act(() => new Promise((r) => setTimeout(r, 10)));

      fireEvent.pointerDown(getByTestId("inside"));
      expect(onPointerDownOutside).not.toHaveBeenCalled();
    });

    it("does not call onPointerDownOutside when clicking an excluded target", async () => {
      const onPointerDownOutside = mock(() => {});
      const triggerRef = React.createRef<HTMLButtonElement>();

      function TestComponent() {
        const { dismissibleRef, dismissibleProps } = useDismissibleLayer({
          enabled: true,
          onPointerDownOutside,
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
      expect(onPointerDownOutside).not.toHaveBeenCalled();
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

    it("consumer preventDefault on pointerdown signals to parent layers", async () => {
      render(
        <>
          <DismissibleBox
            options={{
              enabled: true,
              onPointerDownOutside: (e) => e.preventDefault(),
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
});

import "@testing-library/jest-dom";
import { act, fireEvent, render, waitFor } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";

import { afterEach, describe, expect, it, vi } from "vitest";

import { Select } from "./index";

const geometry = vi.hoisted(() => ({
  computePosition: vi.fn(),
  getRectByRef: vi.fn(),
}));

vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxUiCommon>();
  return { ...actual, getRectByRef: geometry.getRectByRef };
});

vi.mock("../private/Positioning", () => ({
  computePosition: geometry.computePosition,
}));

interface GeometryRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function createRect(left: number, top: number, width: number, height: number): GeometryRect {
  return { left, top, right: left + width, bottom: top + height, width, height };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}
function installRootSelectorQuery() {
  const createSelectorQuery = () => ({
    selectRoot: () => ({}),
  });
  vi.stubGlobal("lynx", {
    ...globalThis.lynx,
    createSelectorQuery,
  });
  for (const testGlobal of [
    lynxTestingEnv.backgroundThread.globalThis,
    lynxTestingEnv.mainThread.globalThis,
  ]) {
    testGlobal["lynx"] = {
      ...testGlobal["lynx"],
      createSelectorQuery,
    };
  }
}

function FloatingSelect({
  contentRef,
  styleOrder = "normal",
}: {
  contentRef?: React.Ref<unknown>;
  styleOrder?: "normal" | "reversed";
}) {
  const style =
    styleOrder === "normal"
      ? { paddingTop: "4px", paddingBottom: "8px" }
      : { paddingBottom: "8px", paddingTop: "4px" };
  return (
    <Select.Root defaultOpen>
      <Select.Trigger accessibility-label="열기" />
      <Select.Content ref={contentRef} style={style} accessibility-label="floating-content">
        <Select.Group>
          <Select.Item value="apple" label="사과">
            <Select.ItemLabel />
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

function getFloatingContent() {
  const content = getRenderedRoot().querySelector<HTMLElement>(
    '[accessibility-label="floating-content"]',
  );
  if (!content) throw new Error("Expected floating Select content to exist.");
  return content;
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function TestSelect() {
  return (
    <Select.Root defaultValue={["apple"]}>
      <Select.Trigger className="select-trigger" accessibility-label="과일" />
      <Select.Content>
        <Select.Group>
          <Select.Item value="apple" label="사과">
            <Select.ItemLabel />
          </Select.Item>
          <Select.Item value="banana" label="바나나">
            <Select.ItemLabel />
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

describe("Select", () => {
  afterEach(() => {
    geometry.computePosition.mockReset();
    geometry.getRectByRef.mockReset();
    vi.unstubAllGlobals();
  });

  it("shows the initially selected label and updates it after a single selection", () => {
    render(<TestSelect />);

    const root = getRenderedRoot();
    const trigger = root.querySelector<HTMLElement>(".select-trigger");
    const banana = Array.from(root.querySelectorAll<HTMLElement>("[accessibility-label]")).find(
      (element) => element.getAttribute("accessibility-label") === "바나나",
    );

    expect(trigger).not.toBeNull();
    expect(banana).toBeDefined();
    expect(trigger).toHaveTextContent("사과");

    fireEvent.tap(trigger as HTMLElement);
    expect(trigger).toHaveAttribute("accessibility-value", "expanded");

    fireEvent.tap(banana as HTMLElement);
    expect(trigger).toHaveTextContent("바나나");
    expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
  });

  it("preserves controlled open state after splitting recipe variants", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Select.Root open onOpenChange={onOpenChange}>
        <Select.Trigger className="controlled-trigger" accessibility-label="과일" />
      </Select.Root>,
    );
    const trigger = getRenderedRoot().querySelector<HTMLElement>(".controlled-trigger");
    if (!trigger) throw new Error("Expected the controlled Select trigger.");

    expect(trigger).toHaveAttribute("accessibility-value", "expanded");
    fireEvent.tap(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: "trigger" }),
    );
    expect(trigger).toHaveAttribute("accessibility-value", "expanded");

    rerender(
      <Select.Root open={false} onOpenChange={onOpenChange}>
        <Select.Trigger className="controlled-trigger" accessibility-label="과일" />
      </Select.Root>,
    );
    expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
  });

  it("positions content after a public ref patch resolves deferred geometry", async () => {
    installRootSelectorQuery();
    const pendingGeometry = deferred<GeometryRect>();
    const intrinsic = createRect(0, 0, 240, 480);

    geometry.getRectByRef.mockImplementation(
      (_ref: unknown, _relative: boolean, scrollAreaId?: string) =>
        scrollAreaId ? Promise.resolve(intrinsic) : pendingGeometry.promise,
    );
    geometry.computePosition.mockImplementation(async ({ width }: { width: number }) => ({
      availableWidth: width,
      availableHeight: 480,
      left: 144,
      top: 284,
      width,
      height: 320,
      placement: "bottom",
      transformOrigin: "50% 0%",
    }));

    const initialRef = vi.fn();
    const patchedRef = vi.fn();
    const { rerender } = render(<FloatingSelect contentRef={initialRef} />);

    await waitFor(() => {
      expect(
        geometry.getRectByRef.mock.calls.some(([, , scrollAreaId]) => scrollAreaId === undefined),
      ).toBe(true);
    });

    rerender(<FloatingSelect contentRef={patchedRef} />);
    await act(async () => {
      pendingGeometry.resolve(createRect(72, 112, 240, 52));
      await pendingGeometry.promise;
    });

    await waitFor(() => {
      expect(getFloatingContent()).toHaveStyle({
        left: "72px",
        top: "172px",
        width: "240px",
      });
    });
  });

  it("keeps positioned content visible when an equivalent inline style is recreated", async () => {
    installRootSelectorQuery();
    const intrinsic = createRect(0, 0, 240, 480);
    const repeatedMeasurement = deferred<GeometryRect>();
    let blockIntrinsicMeasurement = false;

    geometry.getRectByRef.mockImplementation(
      (_ref: unknown, _relative: boolean, scrollAreaId?: string) =>
        scrollAreaId && blockIntrinsicMeasurement
          ? repeatedMeasurement.promise
          : Promise.resolve(scrollAreaId ? intrinsic : createRect(72, 112, 240, 52)),
    );
    geometry.computePosition.mockImplementation(async ({ width }: { width: number }) => ({
      availableWidth: width,
      availableHeight: 480,
      left: 144,
      top: 284,
      width,
      height: 320,
      placement: "bottom",
      transformOrigin: "50% 0%",
    }));

    const { rerender } = render(<FloatingSelect />);
    await waitFor(() => {
      expect(getFloatingContent()).toHaveStyle({
        left: "72px",
        top: "172px",
        width: "240px",
      });
    });
    blockIntrinsicMeasurement = true;

    rerender(<FloatingSelect styleOrder="reversed" />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(getFloatingContent()).toHaveStyle({
      left: "72px",
      top: "172px",
      width: "240px",
    });
  });

  it("remeasures and positions after width clamping without another layout change", async () => {
    installRootSelectorQuery();
    const intrinsic = createRect(0, 0, 240, 480);

    geometry.getRectByRef.mockImplementation(
      (_ref: unknown, _relative: boolean, scrollAreaId?: string) =>
        Promise.resolve(scrollAreaId ? intrinsic : createRect(72, 112, 240, 52)),
    );
    geometry.computePosition.mockImplementation(async ({ width }: { width: number }) => ({
      availableWidth: width === 240 ? 180 : width,
      availableHeight: 480,
      left: 144,
      top: 284,
      width,
      height: 320,
      placement: "bottom",
      transformOrigin: "50% 0%",
    }));

    render(<FloatingSelect />);

    await waitFor(() => {
      expect(getFloatingContent()).toHaveStyle({
        left: "72px",
        top: "172px",
        width: "180px",
      });
    });
  });
});

import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { SwitchControl, SwitchRoot, SwitchThumb, useSwitchContext } from "../Switch";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRootView() {
  const root = getRenderedRoot();
  return root.matches("view") ? root : root.querySelector("view")!;
}

describe("SwitchRoot", () => {
  it("toggles uncontrolled checked state on tap", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    expect(root).not.toHaveClass("ui-checked");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).toHaveClass("ui-checked");
  });

  it("keeps controlled checked state until value changes", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <SwitchRoot checked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).not.toHaveClass("ui-checked");

    rerender(
      <SwitchRoot checked onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    expect(root).toHaveClass("ui-checked");
  });

  it("ignores tap when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot disabled defaultChecked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("ui-disabled");
  });

  it("passes state to render-prop children", () => {
    render(
      <SwitchRoot defaultChecked disabled>
        {(state) => <text>{state.checked && state.disabled ? "on-disabled" : "off"}</text>}
      </SwitchRoot>,
    );

    expect(getRenderedQueries().getByText("on-disabled")).toBeInTheDocument();
  });

  it("marks the root with switch accessibility semantics", () => {
    render(
      <SwitchRoot defaultChecked accessibility-label="알림" accessibility-value="켜짐">
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");
    expect(root).toHaveAttribute("accessibility-role-description", "switch");
    expect(root).toHaveAttribute("accessibility-label", "알림");
    expect(root).toHaveAttribute("accessibility-value", "켜짐");
  });

  it("ignores legacy switchProps bucket when native props are passed directly", () => {
    render(
      <SwitchRoot
        {...({
          switchProps: {
            className: "legacy-switch",
          },
        } as never)}
        className="direct-switch"
      >
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    expect(root).toHaveClass("direct-switch");
    expect(root).not.toHaveClass("legacy-switch");
  });

  it("shares state through control and thumb context", () => {
    render(
      <SwitchRoot defaultChecked>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </SwitchRoot>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector("view > view")).toHaveClass("ui-checked");
    expect(root.querySelector("view > view > view")).toHaveClass("ui-checked");
  });

  it("uses direct native props on control and thumb slots", () => {
    render(
      <SwitchRoot defaultChecked>
        <SwitchControl
          {...({
            switchProps: {
              className: "legacy-control",
            },
          } as never)}
          className="direct-control"
        >
          <SwitchThumb
            {...({
              thumbProps: {
                className: "legacy-thumb",
              },
            } as never)}
            className="direct-thumb"
          />
        </SwitchControl>
      </SwitchRoot>,
    );

    const root = getRenderedRoot();
    const control = root.querySelector("view > view")!;
    const thumb = root.querySelector("view > view > view")!;

    expect(control).toHaveClass("direct-control");
    expect(control).not.toHaveClass("legacy-control");
    expect(thumb).toHaveClass("direct-thumb");
    expect(thumb).not.toHaveClass("legacy-thumb");
  });

  it("throws when context hook is used outside provider", () => {
    function Consumer() {
      useSwitchContext("Consumer");
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("Consumer must be used inside <SwitchRoot/>.");
  });
});

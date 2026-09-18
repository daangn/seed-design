import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Toggle, useToggleContext } from "./index";
function Label() {
  const { pressed, active } = useToggleContext();
  return <text>{`${pressed}/${active}`}</text>;
}
function root() {
  const node =
    elementTree.root?.querySelector(".toggle") ??
    (elementTree.root?.matches(".toggle") ? elementTree.root : null);
  if (!node) throw new Error("Missing root");
  return node;
}
function event(name: string) {
  fireEvent(root(), new Event(`bindEvent:${name}`));
}
describe("Toggle.Root", () => {
  it("shares state with children, composes handlers and updates accessibility", () => {
    const onChange = vi.fn();
    const tap = vi.fn();
    render(
      <Toggle.Root className="toggle" onPressedChange={onChange} bindtap={tap}>
        <Label />
      </Toggle.Root>,
    );
    event("touchstart");
    expect(root()).toHaveTextContent("false/true");
    event("touchcancel");
    expect(root()).toHaveTextContent("false/false");
    event("tap");
    expect(root()).toHaveTextContent("true/false");
    expect(root()).toHaveAttribute("accessibility-value", "pressed");
    expect(onChange).toHaveBeenCalledWith(true);
    expect(tap).toHaveBeenCalledTimes(1);
  });
  it("keeps controlled state and blocks disabled handlers", () => {
    const onChange = vi.fn();
    const tap = vi.fn();
    const { rerender } = render(
      <Toggle.Root className="toggle" pressed={false} onPressedChange={onChange} bindtap={tap}>
        <Label />
      </Toggle.Root>,
    );
    event("tap");
    expect(onChange).toHaveBeenCalledWith(true);
    expect(root()).toHaveTextContent("false/false");
    rerender(
      <Toggle.Root className="toggle" pressed disabled onPressedChange={onChange} bindtap={tap}>
        <Label />
      </Toggle.Root>,
    );
    event("tap");
    event("touchstart");
    expect(tap).toHaveBeenCalledTimes(1);
    expect(root()).toHaveTextContent("true/false");
    expect(root()).toHaveAttribute("accessibility-traits", "disabled");
  });
});

import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { useState } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { Collapsible } from "./index.js";

function node(selector: string) {
  const element = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
}

function TestCollapsible(props: Collapsible.RootProps) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger className="trigger">
        <text>열기</text>
      </Collapsible.Trigger>
      <Collapsible.Content className="content">
        <text>내용</text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

describe("Collapsible", () => {
  it("does not collapse initially open content before it is measured", () => {
    render(<TestCollapsible defaultOpen />);
    const inner = node(".content").firstElementChild as HTMLElement;

    expect(node(".content")).toHaveStyle({ height: "auto", overflow: "hidden" });
    expect(node(".trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");

    act(() => fireEvent.layoutchange(inner, { height: 40 }));
    expect(node(".content")).toHaveStyle({ height: "40px" });

    fireEvent.tap(node(".trigger"));
    expect(node(".content")).toHaveStyle({ height: "0px" });
    expect(node(".content")).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("reports controlled changes without opening until the parent applies them", () => {
    const onOpenChange = vi.fn();
    function Parent() {
      const [open, setOpen] = useState(false);
      return (
        <TestCollapsible
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            if (onOpenChange.mock.calls.length > 1) setOpen(next);
          }}
        />
      );
    }
    render(<Parent />);

    fireEvent.tap(node(".trigger"));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(node(".content")).toHaveStyle({ height: "0px" });

    fireEvent.tap(node(".trigger"));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(node(".content")).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("ignores taps while disabled", () => {
    const onOpenChange = vi.fn();
    render(<TestCollapsible disabled onOpenChange={onOpenChange} />);

    fireEvent.tap(node(".trigger"));

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(node(".trigger")).toHaveAttribute("accessibility-traits", "disabled");
    expect(node(".content")).toHaveStyle({ height: "0px" });
  });
});

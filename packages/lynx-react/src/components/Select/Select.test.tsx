import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { Select } from "./index";

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
});

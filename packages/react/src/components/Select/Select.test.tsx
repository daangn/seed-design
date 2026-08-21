import { render, act } from "@testing-library/react";
import { describe, expect, it, jest } from "bun:test";
import type * as React from "react";

import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPlaceholder,
  SelectPrefixIcon,
  SelectPositioner,
  SelectContent,
  SelectScrollArea,
  SelectItem,
  SelectItemPrefixIcon,
  SelectItemBody,
  SelectItemLabel,
  SelectItemIndicator,
  SelectHiddenSelect,
  type SelectRootProps,
} from "./Select";
import { FieldRoot, FieldLabel } from "../Field/Field";

const waitForPositioning = () => act(async () => {});

function TestSelect({ staticIcon, ...props }: SelectRootProps & { staticIcon?: React.ReactNode }) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectPrefixIcon fallback={staticIcon} />
        <SelectValue />
        <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectScrollArea>
            <SelectItem value="apple" label="Apple" prefixIcon={<svg data-testid="apple-icon" />}>
              <SelectItemBody>
                <SelectItemLabel>Apple</SelectItemLabel>
              </SelectItemBody>
            </SelectItem>
            <SelectItem value="banana" label="Banana">
              <SelectItemBody>
                <SelectItemLabel>Banana</SelectItemLabel>
              </SelectItemBody>
            </SelectItem>
            <SelectItem
              value="cherry"
              label="Cherry"
              prefixIcon={<svg data-testid="cherry-icon" />}
            >
              <SelectItemBody>
                <SelectItemLabel>Cherry</SelectItemLabel>
              </SelectItemBody>
            </SelectItem>
          </SelectScrollArea>
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

describe("Select", () => {
  describe("SelectPrefixIcon (selected-item mirroring)", () => {
    it("renders the static svg while nothing is selected", async () => {
      const { queryByTestId } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} />,
      );
      await waitForPositioning();
      expect(queryByTestId("static-icon")).toBeInTheDocument();
    });

    it("renders nothing while nothing is selected and no static svg is given", async () => {
      const { getByRole } = render(<TestSelect />);
      await waitForPositioning();
      expect(getByRole("combobox").querySelector("svg")).toBeNull();
    });

    it("renders the selected item's icon over the static svg with exactly one selection", async () => {
      const { queryByTestId } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} defaultValue={["apple"]} />,
      );
      await waitForPositioning();
      expect(queryByTestId("apple-icon")).toBeInTheDocument();
      expect(queryByTestId("static-icon")).not.toBeInTheDocument();
    });

    it("renders the selected item's icon with exactly one selection and no static svg", async () => {
      const { queryByTestId } = render(<TestSelect defaultValue={["apple"]} />);
      await waitForPositioning();
      expect(queryByTestId("apple-icon")).toBeInTheDocument();
    });

    it("falls back to the static svg when the single selected item has no icon", async () => {
      const { queryByTestId } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} defaultValue={["banana"]} />,
      );
      await waitForPositioning();
      expect(queryByTestId("static-icon")).toBeInTheDocument();
    });

    it("renders nothing when the single selected item has no icon and no static svg is given", async () => {
      const { getByRole } = render(<TestSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      expect(getByRole("combobox").querySelector("svg")).toBeNull();
    });

    it("falls back to the static svg when the single selected value has no rendered option", async () => {
      const { queryByTestId } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} defaultValue={["ghost"]} />,
      );
      await waitForPositioning();
      expect(queryByTestId("static-icon")).toBeInTheDocument();
    });

    it("renders the static svg with two or more selections", async () => {
      const { queryByTestId } = render(
        <TestSelect
          multiple
          staticIcon={<svg data-testid="static-icon" />}
          defaultValue={["apple", "cherry"]}
        />,
      );
      await waitForPositioning();
      expect(queryByTestId("static-icon")).toBeInTheDocument();
      expect(queryByTestId("apple-icon")).not.toBeInTheDocument();
      expect(queryByTestId("cherry-icon")).not.toBeInTheDocument();
    });

    it("mirrors the item icon when a multi-select has exactly one selection", async () => {
      const { queryByTestId } = render(
        <TestSelect
          multiple
          staticIcon={<svg data-testid="static-icon" />}
          defaultValue={["cherry"]}
        />,
      );
      await waitForPositioning();
      expect(queryByTestId("cherry-icon")).toBeInTheDocument();
      expect(queryByTestId("static-icon")).not.toBeInTheDocument();
    });

    it("keeps the mirrored icon aria-hidden and the trigger accessible name unchanged", async () => {
      const { getByRole, getByTestId } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} defaultValue={["apple"]} />,
      );
      await waitForPositioning();
      expect(getByTestId("apple-icon")).toHaveAttribute("aria-hidden", "true");
      expect(getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
    });

    it("returns to the static svg when the selection is cleared", async () => {
      const { queryByTestId, rerender } = render(
        <TestSelect staticIcon={<svg data-testid="static-icon" />} value={["apple"]} />,
      );
      await waitForPositioning();
      expect(queryByTestId("apple-icon")).toBeInTheDocument();
      expect(queryByTestId("static-icon")).not.toBeInTheDocument();

      rerender(<TestSelect staticIcon={<svg data-testid="static-icon" />} value={[]} />);
      expect(queryByTestId("apple-icon")).not.toBeInTheDocument();
      expect(queryByTestId("static-icon")).toBeInTheDocument();
    });

    it("renders nothing with two or more selections and no static svg", async () => {
      const { getByRole } = render(<TestSelect multiple defaultValue={["apple", "cherry"]} />);
      await waitForPositioning();
      // neither item icon mirrors (only exactly-one mirrors) and there is no
      // fallback, so the prefix slot renders nothing
      expect(getByRole("combobox").querySelector("svg")).toBeNull();
    });

    it("forwards the disabled state to the prefix icon", async () => {
      const { getByTestId } = render(
        <TestSelect disabled staticIcon={<svg data-testid="static-icon" />} />,
      );
      await waitForPositioning();
      expect(getByTestId("static-icon")).toHaveAttribute("data-disabled");
    });
  });

  describe("item row: context-driven label & prefix", () => {
    function RowSelect(props: SelectRootProps) {
      return (
        <SelectRoot defaultOpen {...props}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem
                  value="apple"
                  label="Apple"
                  prefixIcon={<svg data-testid="apple-row-icon" />}
                >
                  <SelectItemPrefixIcon />
                  <SelectItemBody>
                    <SelectItemLabel />
                  </SelectItemBody>
                </SelectItem>
                <SelectItem value="banana" label="Banana">
                  <SelectItemPrefixIcon />
                  <SelectItemBody>
                    <SelectItemLabel />
                  </SelectItemBody>
                </SelectItem>
                <SelectItem value="cherry" label={<em>Cherry</em>} textValue="Cherry">
                  <SelectItemBody>
                    <SelectItemLabel>Override</SelectItemLabel>
                  </SelectItemBody>
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    it("renders the item's context label when SelectItemLabel has no children", async () => {
      const { getByRole } = render(<RowSelect />);
      await waitForPositioning();
      expect(getByRole("option", { name: "Apple" })).toBeInTheDocument();
      expect(getByRole("option", { name: "Banana" })).toBeInTheDocument();
    });

    it("lets explicit SelectItemLabel children win over the context label", async () => {
      const { getByRole } = render(<RowSelect />);
      await waitForPositioning();
      expect(getByRole("option", { name: "Override" })).toBeInTheDocument();
    });

    it("renders the item's context prefixIcon in the row, kept aria-hidden", async () => {
      const { getByTestId } = render(<RowSelect />);
      await waitForPositioning();
      expect(getByTestId("apple-row-icon")).toHaveAttribute("aria-hidden", "true");
    });

    it("renders no row prefix icon when the item has no prefixIcon", async () => {
      const { getByRole } = render(<RowSelect />);
      await waitForPositioning();
      expect(getByRole("option", { name: "Banana" }).querySelector("svg")).toBeNull();
    });

    it("lets an explicit svg prop override the item's context prefixIcon", async () => {
      const { getByTestId, queryByTestId } = render(
        <SelectRoot defaultOpen>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="apple" label="Apple" prefixIcon={<svg data-testid="ctx-icon" />}>
                  <SelectItemPrefixIcon svg={<svg data-testid="override-icon" />} />
                  <SelectItemBody>
                    <SelectItemLabel />
                  </SelectItemBody>
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>,
      );
      await waitForPositioning();
      expect(getByTestId("override-icon")).toBeInTheDocument();
      expect(queryByTestId("ctx-icon")).not.toBeInTheDocument();
    });

    // Every item slot carries its own `[data-disabled]` selector, so the disabled
    // color only lands if the state reaches each element — the prefix icon included.
    it("forwards the disabled item state to the item prefix icon, body and label", async () => {
      const { getByTestId, getByText } = render(
        <SelectRoot defaultOpen>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem
                  value="apple"
                  label="Apple"
                  prefixIcon={<svg data-testid="apple-row-icon" />}
                  disabled
                >
                  <SelectItemPrefixIcon />
                  <SelectItemBody data-testid="apple-body">
                    <SelectItemLabel />
                  </SelectItemBody>
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>,
      );
      await waitForPositioning();
      expect(getByTestId("apple-row-icon")).toHaveAttribute("data-disabled");
      expect(getByTestId("apple-body")).toHaveAttribute("data-disabled");
      expect(getByText("Apple")).toHaveAttribute("data-disabled");
    });
  });

  describe("Field composition", () => {
    function FieldSelect() {
      return (
        <FieldRoot>
          <FieldLabel>Fruit</FieldLabel>
          <SelectRoot>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPositioner>
              <SelectContent>
                <SelectScrollArea>
                  <SelectItem value="apple" label="Apple">
                    <SelectItemBody>
                      <SelectItemLabel>Apple</SelectItemLabel>
                    </SelectItemBody>
                  </SelectItem>
                </SelectScrollArea>
              </SelectContent>
            </SelectPositioner>
            <SelectHiddenSelect />
          </SelectRoot>
        </FieldRoot>
      );
    }

    it("associates the field label with the hidden select, not the trigger", async () => {
      const { container } = render(<FieldSelect />);
      await waitForPositioning();

      const label = container.querySelector("label");
      const hidden = container.querySelector("select");
      if (!label || !hidden) throw new Error("label or hidden select not rendered");

      // Label activation on the trigger button would open the listbox; targeting
      // the hidden select instead forwards only focus (via its onFocus redirect).
      expect(hidden.id).toBe(label.htmlFor);
      expect(container.querySelector("button")?.id).not.toBe(label.htmlFor);
    });

    it("labels the trigger via the field label id", async () => {
      const { container, getByRole } = render(<FieldSelect />);
      await waitForPositioning();

      const label = container.querySelector("label");
      expect(getByRole("combobox")).toHaveAttribute("aria-labelledby", label?.id);
    });

    // APG combobox pattern: the listbox popup carries the same field label so
    // screen readers announce the group name when focus enters the options.
    it("labels the listbox popup via the field label id", async () => {
      const { container, getByRole } = render(<FieldSelect />);
      await waitForPositioning();

      const label = container.querySelector("label");
      expect(getByRole("listbox")).toHaveAttribute("aria-labelledby", label?.id);
    });
  });

  describe("SelectItemIndicator", () => {
    function IndicatorSelect(props: SelectRootProps) {
      return (
        <SelectRoot defaultOpen {...props}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="apple" label="Apple">
                  <SelectItemBody>
                    <SelectItemLabel />
                  </SelectItemBody>
                  <SelectItemIndicator
                    selected={<svg data-testid="apple-selected" />}
                    unselected={<svg data-testid="apple-unselected" />}
                  />
                </SelectItem>
                <SelectItem value="banana" label="Banana">
                  <SelectItemBody>
                    <SelectItemLabel />
                  </SelectItemBody>
                  <SelectItemIndicator selected={<svg data-testid="banana-selected" />} />
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    it("shows the selected icon on the selected item, kept aria-hidden", async () => {
      const { getByTestId, queryByTestId } = render(<IndicatorSelect defaultValue={["apple"]} />);
      await waitForPositioning();

      expect(getByTestId("apple-selected")).toBeInTheDocument();
      expect(getByTestId("apple-selected")).toHaveAttribute("aria-hidden", "true");
      expect(queryByTestId("apple-unselected")).not.toBeInTheDocument();
    });

    it("shows the unselected icon while the item is not selected", async () => {
      const { getByTestId, queryByTestId } = render(<IndicatorSelect />);
      await waitForPositioning();

      expect(getByTestId("apple-unselected")).toBeInTheDocument();
      expect(queryByTestId("apple-selected")).not.toBeInTheDocument();
    });

    it("renders nothing for an unselected item that has no unselected icon", async () => {
      const { queryByTestId } = render(<IndicatorSelect defaultValue={["apple"]} />);
      await waitForPositioning();

      // banana is unselected and provides no `unselected` icon
      expect(queryByTestId("banana-selected")).not.toBeInTheDocument();
    });
  });

  describe("SelectTrigger accessibility warning", () => {
    it("warns when there is no Field and no aria-label", async () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <SelectRoot>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea />
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>,
      );
      await waitForPositioning();

      expect(warn).toHaveBeenCalledWith(expect.stringContaining("SelectTrigger"));
      warn.mockRestore();
    });

    it("stays silent when an aria-label is provided", async () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      render(<TestSelect />);
      await waitForPositioning();

      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });
});

import { render, act } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";

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
  SelectItemBody,
  SelectItemLabel,
  type SelectRootProps,
} from "./Select";

const waitForPositioning = () => act(async () => {});

function TestSelect({ staticIcon, ...props }: SelectRootProps & { staticIcon?: React.ReactNode }) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectPrefixIcon svg={staticIcon} />
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
  });
});

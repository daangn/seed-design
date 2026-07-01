// this file is .vitest.tsx, not .test.tsx — so bun test won't pick it up.
// See @seed-design/react-menu's useMenu.vitest.tsx for why vitest + jsdom is used
// (floating-ui defers work via rAF, which happy-dom under bun test doesn't tick).

/// <reference types="@testing-library/jest-dom/vitest" />

import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as React from "react";

import {
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
  SelectPlaceholder,
  SelectPositioner,
  SelectContent,
  SelectScrollArea,
  SelectItem,
  SelectItemIndicator,
  SelectHiddenSelect,
  type SelectRootProps,
} from "./index";

const waitForPositioning = () => act(async () => {});

function BasicSelect(props: SelectRootProps) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue />
        <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectScrollArea>
            <SelectItem value="apple" label="Apple">
              Apple
              <SelectItemIndicator>✓</SelectItemIndicator>
            </SelectItem>
            <SelectItem value="banana" label="Banana">
              Banana
              <SelectItemIndicator>✓</SelectItemIndicator>
            </SelectItem>
            <SelectItem value="cherry" label="Cherry" disabled>
              Cherry
              <SelectItemIndicator>✓</SelectItemIndicator>
            </SelectItem>
          </SelectScrollArea>
        </SelectContent>
      </SelectPositioner>
      <SelectHiddenSelect />
    </Select>
  );
}

describe("useSelect", () => {
  describe("rendering & structure (select-only combobox)", () => {
    it("renders a trigger with role='combobox' and aria-haspopup='listbox'", async () => {
      const { getByRole } = render(<BasicSelect name="fruit" />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("renders listbox content and option items when open", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      expect(getByRole("listbox")).toHaveAttribute("data-open");
      expect(getAllByRole("option")).toHaveLength(3);
    });

    it("shows placeholder when nothing is selected", async () => {
      const { getByText } = render(<BasicSelect />);
      await waitForPositioning();
      expect(getByText("Choose a fruit")).toBeInTheDocument();
    });
  });

  describe("open/close state", () => {
    it("opens and closes on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
      await user.click(trigger);
      expect(getByRole("listbox")).toHaveAttribute("data-open");
      await user.click(trigger);
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });

    it("closes on Escape with reason 'escapeKeyDown'", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole } = render(<BasicSelect onOpenChange={onOpenChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      onOpenChange.mockClear();
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ reason: "escapeKeyDown" }),
      );
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect disabled />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });

    it("does not open when readOnly", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect readOnly />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });
  });

  describe("selection", () => {
    it("selects a value on option click, closes, and reports reason 'itemSelect'", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[1]);
      expect(onValueChange).toHaveBeenCalledWith(
        "banana",
        expect.objectContaining({ reason: "itemSelect" }),
      );
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });

    it("marks the selected option with aria-selected and data-selected", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue="banana" />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("aria-selected", "true");
      expect(options[1]).toHaveAttribute("data-selected");
      expect(options[0]).toHaveAttribute("aria-selected", "false");
    });

    it("renders the item indicator only for the selected option", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue="apple" />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const options = getAllByRole("option");
      expect(options[0].textContent).toContain("✓");
      expect(options[1].textContent).not.toContain("✓");
    });

    it("displays the selected option's label in the trigger value", async () => {
      const { getByRole } = render(<BasicSelect defaultValue="banana" />);
      await waitForPositioning();
      expect(getByRole("combobox").textContent).toContain("Banana");
    });

    it("does not select a disabled option on click", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[2]);
      expect(onValueChange).not.toHaveBeenCalled();
      expect(getByRole("listbox")).toHaveAttribute("data-open");
    });

    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole, getAllByRole, rerender } = render(
        <BasicSelect value="apple" onValueChange={onValueChange} />,
      );
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[1]);
      // controlled: value stays "apple" until the prop changes
      expect(onValueChange).toHaveBeenCalledWith("banana", expect.anything());
      rerender(<BasicSelect value="banana" onValueChange={onValueChange} />);
      expect(getByRole("combobox").textContent).toContain("Banana");
    });
  });

  describe("keyboard (aria-activedescendant, virtual focus)", () => {
    it("keeps DOM focus on the trigger and highlights via aria-activedescendant", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      await user.keyboard("{ArrowDown}");
      const options = getAllByRole("option");
      expect(trigger).toHaveFocus();
      expect(options[0]).toHaveAttribute("data-highlighted");
      expect(trigger.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    it("selects the highlighted option on Enter", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(
        "apple",
        expect.objectContaining({ reason: "itemSelect" }),
      );
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });

    it("matches an option by typeahead", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.keyboard("b");
      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("data-highlighted");
    });
  });

  describe("form integration (hidden native select)", () => {
    it("renders a hidden native select carrying name and value", async () => {
      const { container } = render(<BasicSelect name="fruit" defaultValue="banana" />);
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruit']") as HTMLSelectElement;
      expect(nativeSelect).toBeTruthy();
      expect(nativeSelect).toHaveValue("banana");
    });

    it("updates the value when the hidden select changes (autofill path)", async () => {
      const onValueChange = vi.fn();
      const { container } = render(<BasicSelect name="fruit" onValueChange={onValueChange} />);
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruit']") as HTMLSelectElement;
      await act(async () => {
        nativeSelect.value = "apple";
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(onValueChange).toHaveBeenCalledWith(
        "apple",
        expect.objectContaining({ reason: "hiddenSelect" }),
      );
    });
  });
});

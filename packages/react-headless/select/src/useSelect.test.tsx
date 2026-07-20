import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";

import {
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
  SelectPlaceholder,
  SelectPositioner,
  SelectContent,
  SelectScrollArea,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
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
            </SelectItem>
            <SelectItem value="banana" label="Banana">
              Banana
            </SelectItem>
            <SelectItem value="cherry" label="Cherry" disabled>
              Cherry
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

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByRole } = render(<BasicSelect onOpenChange={onOpenChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      onOpenChange.mockClear();
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
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
    it("selects a value on option click and closes", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[1]);
      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
      expect(getByRole("listbox")).not.toHaveAttribute("data-open");
    });

    it("marks the selected option with aria-selected and data-selected", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("aria-selected", "true");
      expect(options[1]).toHaveAttribute("data-selected");
      expect(options[0]).toHaveAttribute("aria-selected", "false");
    });

    it("displays the selected option's label in the trigger value", async () => {
      const { getByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      expect(getByRole("combobox").textContent).toContain("Banana");
    });

    it("does not select a disabled option on click", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[2]);
      expect(onValueChange).not.toHaveBeenCalled();
      expect(getByRole("listbox")).toHaveAttribute("data-open");
    });

    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole, rerender } = render(
        <BasicSelect value={["apple"]} onValueChange={onValueChange} />,
      );
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[1]);
      // controlled: value stays ["apple"] until the prop changes
      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
      rerender(<BasicSelect value={["banana"]} onValueChange={onValueChange} />);
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
      const onValueChange = jest.fn();
      const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
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
      const { container } = render(<BasicSelect name="fruit" defaultValue={["banana"]} />);
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruit']") as HTMLSelectElement;
      expect(nativeSelect).toBeTruthy();
      expect(nativeSelect).toHaveValue("banana");
    });

    it("updates the value when the hidden select changes (autofill path)", async () => {
      const onValueChange = jest.fn();
      const { container } = render(<BasicSelect name="fruit" onValueChange={onValueChange} />);
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruit']") as HTMLSelectElement;
      await act(async () => {
        nativeSelect.value = "apple";
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    });

    // Regression: the trigger is a <button> with no explicit type, so inside a
    // <form> it defaulted to type="submit". Clicking it submitted the form, which
    // ran constraint validation on the required hidden <select> and popped the
    // native "please select an item" bubble the instant the listbox opened.
    it("renders the trigger as type='button' so it never submits an enclosing form", async () => {
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      expect(getByRole("combobox")).toHaveAttribute("type", "button");
    });

    it("does not trigger native form validation when the required trigger is clicked", async () => {
      const user = userEvent.setup();
      const onInvalid = jest.fn();
      const { getByRole, container } = render(
        <form>
          <BasicSelect name="fruit" required />
        </form>,
      );
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruit']") as HTMLSelectElement;
      nativeSelect.addEventListener("invalid", onInvalid);

      await user.click(getByRole("combobox"));

      expect(onInvalid).not.toHaveBeenCalled();
      expect(getByRole("listbox")).toHaveAttribute("data-open");
    });
  });

  describe("grouping (aria-labelledby)", () => {
    function SelectWithLabeledGroup(props: SelectRootProps) {
      return (
        <Select {...props}>
          <SelectTrigger>
            <SelectValue />
            <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectGroup>
                  <SelectGroupLabel>Fruits</SelectGroupLabel>
                  <SelectItem value="apple" label="Apple">
                    Apple
                  </SelectItem>
                  <SelectItem value="banana" label="Banana">
                    Banana
                  </SelectItem>
                </SelectGroup>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </Select>
      );
    }

    function SelectWithUnlabeledGroup(props: SelectRootProps) {
      return (
        <Select {...props}>
          <SelectTrigger>
            <SelectValue />
            <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectGroup>
                  <SelectItem value="apple" label="Apple">
                    Apple
                  </SelectItem>
                  <SelectItem value="banana" label="Banana">
                    Banana
                  </SelectItem>
                </SelectGroup>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </Select>
      );
    }

    it("labels a group via aria-labelledby resolving to the rendered group label", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole, getByText } = render(<SelectWithLabeledGroup />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const group = getAllByRole("group")[0];
      const labelledBy = group.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      expect(getByText("Fruits")).toHaveAttribute("id", labelledBy as string);
    });

    it("does not set a dangling aria-labelledby on a group without a label", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<SelectWithUnlabeledGroup />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const group = getAllByRole("group")[0];
      expect(group).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("form a11y (aria-required / aria-invalid on trigger)", () => {
    it("reflects required as aria-required='true' on the trigger", async () => {
      const { getByRole } = render(<BasicSelect required />);
      await waitForPositioning();
      expect(getByRole("combobox")).toHaveAttribute("aria-required", "true");
    });

    it("reflects invalid as aria-invalid='true' on the trigger", async () => {
      const { getByRole } = render(<BasicSelect invalid />);
      await waitForPositioning();
      expect(getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
    });

    it("always exposes aria-required and aria-invalid on the trigger (matching Ark)", async () => {
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-required", "false");
      expect(trigger).toHaveAttribute("aria-invalid", "false");
    });
  });

  describe("active option on open (keyboard-gated aria-activedescendant)", () => {
    it("seeds the selected option as the active option when opened via keyboard", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      trigger.focus();
      // opening with the keyboard seeds the active option from the current selection
      await user.keyboard("{ArrowDown}");
      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("data-highlighted");
      expect(options[1].id).toBeTruthy();
      expect(trigger).toHaveAttribute("aria-activedescendant", options[1].id);
    });

    it("does not seed an active option when opened via pointer", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      // pointer/tap open must not highlight the selection — a seeded highlight reads as a
      // "stuck pressed" state on touch (mobile-first). Keyboard users still get the seed above.
      const options = getAllByRole("option");
      expect(options[1]).not.toHaveAttribute("data-highlighted");
      expect(trigger).not.toHaveAttribute("aria-activedescendant");
    });

    it("leaves no active option on open when nothing is selected", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      expect(trigger).not.toHaveAttribute("aria-activedescendant");
    });
  });

  describe("pointer hover (single active option)", () => {
    it("moves the highlight to the hovered option and clears it from the previously highlighted one", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      trigger.focus();
      // open via keyboard so the selection (banana) is seeded as the active option —
      // gives us a prior highlight for hover to move off of.
      await user.keyboard("{ArrowDown}");

      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("data-highlighted");

      await user.hover(options[0]);
      await waitForPositioning();

      // Hovering moves the single active option to the hovered item; exactly one is ever highlighted.
      expect(options.filter((option) => option.hasAttribute("data-highlighted"))).toHaveLength(1);
      expect(options[0]).toHaveAttribute("data-highlighted");
      expect(options[1]).not.toHaveAttribute("data-highlighted");
    });
  });

  describe("multiple selection", () => {
    function MultiSelect(props: SelectRootProps) {
      return (
        <Select {...props} multiple>
          <SelectTrigger>
            <SelectValue />
            <SelectPlaceholder>Choose fruits</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="apple" label="Apple">
                  Apple
                </SelectItem>
                <SelectItem value="banana" label="Banana">
                  Banana
                </SelectItem>
                <SelectItem value="cherry" label="Cherry" disabled>
                  Cherry
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
          <SelectHiddenSelect />
        </Select>
      );
    }

    it("toggles multiple values on and keeps the listbox open", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(<MultiSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[0]);
      await user.click(getAllByRole("option")[1]);
      expect(getByRole("listbox")).toHaveAttribute("data-open");
      const options = getAllByRole("option");
      expect(options[0]).toHaveAttribute("aria-selected", "true");
      expect(options[1]).toHaveAttribute("aria-selected", "true");
      expect(onValueChange).toHaveBeenLastCalledWith(["apple", "banana"]);
    });

    it("deselects a selected value on re-click", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(
        <MultiSelect defaultValue={["apple"]} onValueChange={onValueChange} />,
      );
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.click(getAllByRole("option")[0]);
      expect(onValueChange).toHaveBeenLastCalledWith([]);
      expect(getByRole("listbox")).toHaveAttribute("data-open");
    });

    it("marks the listbox as aria-multiselectable when multiple", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<MultiSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      expect(getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    });

    it("does not mark aria-multiselectable in single mode", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      expect(getByRole("listbox")).not.toHaveAttribute("aria-multiselectable");
    });

    it("joins the selected options' text in the trigger value", async () => {
      const { getByRole } = render(<MultiSelect defaultValue={["apple", "banana"]} />);
      await waitForPositioning();
      expect(getByRole("combobox").textContent).toContain("Apple, Banana");
    });

    it("renders a hidden multiple native select carrying every value", async () => {
      const { container } = render(
        <MultiSelect name="fruits" defaultValue={["apple", "banana"]} />,
      );
      await waitForPositioning();
      const nativeSelect = container.querySelector("select[name='fruits']") as HTMLSelectElement;
      expect(nativeSelect).toHaveAttribute("multiple");
      expect(Array.from(nativeSelect.selectedOptions).map((option) => option.value)).toEqual([
        "apple",
        "banana",
      ]);
    });

    it("toggles the highlighted option on Enter and keeps the listbox open", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole } = render(<MultiSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
      expect(getByRole("listbox")).toHaveAttribute("data-open");
    });
  });

  describe("value display (formatValue & textValue)", () => {
    it("renders formatValue output over the default label join", async () => {
      function FormatSelect() {
        return (
          <Select
            multiple
            defaultValue={["apple", "banana"]}
            formatValue={(items) => `${items.length} selected`}
          >
            <SelectTrigger>
              <SelectValue />
              <SelectPlaceholder>Choose</SelectPlaceholder>
            </SelectTrigger>
            <SelectPositioner>
              <SelectContent>
                <SelectScrollArea>
                  <SelectItem value="apple" label="Apple">
                    Apple
                  </SelectItem>
                  <SelectItem value="banana" label="Banana">
                    Banana
                  </SelectItem>
                </SelectScrollArea>
              </SelectContent>
            </SelectPositioner>
          </Select>
        );
      }
      const { getByRole } = render(<FormatSelect />);
      await waitForPositioning();
      expect(getByRole("combobox").textContent).toContain("2 selected");
    });

    it("uses textValue for the native option text when the label is a ReactNode", async () => {
      const { container } = render(
        <Select name="fruit" defaultValue={["apple"]}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="apple" label={<b>Apple</b>} textValue="Apple">
                  <b>Apple</b>
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
          <SelectHiddenSelect />
        </Select>,
      );
      await waitForPositioning();
      const option = container.querySelector("select[name='fruit'] option[value='apple']");
      expect(option?.textContent).toBe("Apple");
    });
  });

  describe("prefix icon registration (mirrored via selectedItems)", () => {
    // The headless layer only carries the registration channel: an item's
    // `prefixIcon` must surface on `selectedItems`. Where and when it is shown
    // (the exactly-one-selected branch) is the styled layer's concern.
    function PrefixIconSelect({
      showApple = true,
      ...props
    }: SelectRootProps & { showApple?: boolean }) {
      return (
        <Select {...props} formatValue={(items) => items[0]?.prefixIcon}>
          <SelectTrigger>
            <SelectValue />
            <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                {showApple && (
                  <SelectItem
                    value="apple"
                    label="Apple"
                    prefixIcon={<svg data-testid="apple-icon" />}
                  >
                    Apple
                  </SelectItem>
                )}
                <SelectItem
                  value="banana"
                  label="Banana"
                  prefixIcon={<svg data-testid="banana-icon" />}
                >
                  Banana
                </SelectItem>
                <SelectItem value="cherry" label="Cherry">
                  Cherry
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </Select>
      );
    }

    it("carries the selected item's prefixIcon on selectedItems", async () => {
      const { getByRole, queryByTestId } = render(<PrefixIconSelect defaultValue={["apple"]} />);
      await waitForPositioning();
      const icon = queryByTestId("apple-icon");
      expect(icon).toBeInTheDocument();
      expect(getByRole("combobox").contains(icon)).toBe(true);
    });

    it("swaps the mirrored node when the selection changes and drops it when cleared", async () => {
      const { queryByTestId, rerender } = render(<PrefixIconSelect value={["apple"]} />);
      await waitForPositioning();
      expect(queryByTestId("apple-icon")).toBeInTheDocument();

      rerender(<PrefixIconSelect value={["banana"]} />);
      expect(queryByTestId("apple-icon")).not.toBeInTheDocument();
      expect(queryByTestId("banana-icon")).toBeInTheDocument();

      rerender(<PrefixIconSelect value={[]} />);
      expect(queryByTestId("apple-icon")).not.toBeInTheDocument();
      expect(queryByTestId("banana-icon")).not.toBeInTheDocument();
    });

    it("unregisters the prefixIcon when the item unmounts", async () => {
      const { queryByTestId, rerender } = render(<PrefixIconSelect value={["apple"]} />);
      await waitForPositioning();
      expect(queryByTestId("apple-icon")).toBeInTheDocument();

      rerender(<PrefixIconSelect value={["apple"]} showApple={false} />);
      expect(queryByTestId("apple-icon")).not.toBeInTheDocument();
    });

    it("does not leak prefixIcon as a DOM attribute on the item", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<PrefixIconSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      const options = getAllByRole("option");
      expect(options[0]).not.toHaveAttribute("prefixIcon");
      expect(options[0]).not.toHaveAttribute("prefixicon");
    });
  });

  describe("keyboard resume from selection", () => {
    it("reveals the selection on the first arrow press after a pointer open", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      const options = getAllByRole("option");
      expect(trigger).not.toHaveAttribute("aria-activedescendant");

      await user.keyboard("{ArrowDown}");
      expect(options[1]).toHaveAttribute("data-highlighted");
      expect(trigger).toHaveAttribute("aria-activedescendant", options[1].id);
    });

    it("starts from the first option on arrow press when nothing is selected", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      await user.click(getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      expect(getAllByRole("option")[0]).toHaveAttribute("data-highlighted");
    });

    it("seeds the first enabled option when opened via keyboard with no selection", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      trigger.focus();
      await user.keyboard("{ArrowDown}");
      const options = getAllByRole("option");
      expect(options[0]).toHaveAttribute("data-highlighted");
      expect(trigger).toHaveAttribute("aria-activedescendant", options[0].id);
    });

    it("jumps to the first and last enabled options on Home and End", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(<BasicSelect />);
      await waitForPositioning();
      getByRole("combobox").focus();
      await user.keyboard("{ArrowDown}");
      const options = getAllByRole("option");

      await user.keyboard("{End}");
      // cherry is disabled — the last enabled option is banana
      expect(options[1]).toHaveAttribute("data-highlighted");

      await user.keyboard("{Home}");
      expect(options[0]).toHaveAttribute("data-highlighted");
    });
  });

  describe("typeahead details", () => {
    function StateSelect(props: SelectRootProps) {
      return (
        <Select {...props}>
          <SelectTrigger>
            <SelectValue />
            <SelectPlaceholder>Choose a state</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="new-jersey" label="New Jersey">
                  New Jersey
                </SelectItem>
                <SelectItem value="new-york" label="New York">
                  New York
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
          <SelectHiddenSelect />
        </Select>
      );
    }

    it("treats Space inside an in-progress match as typing, not selection", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(<StateSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      const options = getAllByRole("option");

      await user.keyboard("new york");
      expect(onValueChange).not.toHaveBeenCalled();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(options[1]).toHaveAttribute("data-highlighted");

      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(["new-york"]);
    });

    it("commits a match typed on the closed trigger (single-select)", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      trigger.focus();
      await user.keyboard("b");
      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveTextContent("Banana");

      // the closed-state match must not leak a stale highlight into the next pointer open
      await user.click(trigger);
      const options = getAllByRole("option");
      expect(options[1]).not.toHaveAttribute("data-highlighted");
      expect(trigger).not.toHaveAttribute("aria-activedescendant");
    });

    it("does not commit closed-trigger typeahead when readOnly", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole } = render(<BasicSelect readOnly onValueChange={onValueChange} />);
      await waitForPositioning();
      getByRole("combobox").focus();
      await user.keyboard("b");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not commit closed-trigger typeahead when multiple", async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const { getByRole } = render(<BasicSelect multiple onValueChange={onValueChange} />);
      await waitForPositioning();
      getByRole("combobox").focus();
      await user.keyboard("b");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("never matches a disabled option", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      await user.keyboard("c");
      expect(trigger).not.toHaveAttribute("aria-activedescendant");
    });

    it("matches a ReactNode-labeled option by its textValue", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectScrollArea>
                <SelectItem value="apple" label="Apple">
                  Apple
                </SelectItem>
                <SelectItem value="durian" label={<b>Rich Durian</b>} textValue="Durian">
                  Rich Durian
                </SelectItem>
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
        </Select>,
      );
      await waitForPositioning();
      const trigger = getByRole("combobox");
      await user.click(trigger);
      // "Rich Durian" starts with "r" — a DOM-textContent fallback would not match "d"
      await user.keyboard("d");
      const options = getAllByRole("option");
      expect(options[1]).toHaveAttribute("data-highlighted");
    });
  });

  describe("dynamic options (selected item removed)", () => {
    function DynamicSelect({
      showBanana = true,
      ...props
    }: SelectRootProps & { showBanana?: boolean }) {
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
                </SelectItem>
                {showBanana && (
                  <SelectItem value="banana" label="Banana">
                    Banana
                  </SelectItem>
                )}
              </SelectScrollArea>
            </SelectContent>
          </SelectPositioner>
          <SelectHiddenSelect />
        </Select>
      );
    }

    it("prunes the value and restores the placeholder when the selected option unmounts", async () => {
      const onValueChange = jest.fn();
      const { getByRole, getByText, rerender } = render(
        <DynamicSelect defaultValue={["banana"]} onValueChange={onValueChange} />,
      );
      await waitForPositioning();
      const trigger = getByRole("combobox");
      expect(trigger).toHaveTextContent("Banana");

      rerender(
        <DynamicSelect
          defaultValue={["banana"]}
          onValueChange={onValueChange}
          showBanana={false}
        />,
      );
      await waitForPositioning();
      expect(onValueChange).toHaveBeenCalledWith([]);
      expect(getByText("Choose a fruit")).toBeInTheDocument();
    });

    it("keeps the remaining selected values when one option unmounts (multiple)", async () => {
      const onValueChange = jest.fn();
      const { getByRole, rerender } = render(
        <DynamicSelect multiple defaultValue={["apple", "banana"]} onValueChange={onValueChange} />,
      );
      await waitForPositioning();

      rerender(
        <DynamicSelect
          multiple
          defaultValue={["apple", "banana"]}
          onValueChange={onValueChange}
          showBanana={false}
        />,
      );
      await waitForPositioning();
      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
      expect(getByRole("combobox")).toHaveTextContent("Apple");
    });
  });

  describe("multi-select highlight stability", () => {
    it("keeps the highlight on the toggled option when deselecting", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = render(
        <BasicSelect multiple defaultValue={["apple", "banana"]} />,
      );
      await waitForPositioning();
      getByRole("combobox").focus();
      await user.keyboard("{ArrowDown}");
      const options = getAllByRole("option");
      // keyboard open seeds the first selected option (apple)
      expect(options[0]).toHaveAttribute("data-highlighted");

      await user.keyboard("{Enter}");
      // apple is deselected but the highlight must not jump to the other selected option
      expect(options[0]).toHaveAttribute("data-highlighted");
      expect(options[0]).not.toHaveAttribute("data-selected");
      expect(options[1]).toHaveAttribute("data-selected");
    });
  });
});

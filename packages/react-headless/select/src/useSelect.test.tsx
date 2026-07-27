import { act, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";

import * as React from "react";

import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPlaceholder,
  SelectPositioner,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectHiddenSelect,
  useSelectContext,
  type SelectHiddenSelectProps,
  type SelectRootProps,
  type UseSelectReturn,
} from "./index";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

function getHighlightedItems(container: ParentNode = document) {
  return Array.from(container.querySelectorAll("[data-highlighted]"));
}

/** Reads the hook return from inside the tree without rendering anything. */
function ApiProbe({ apiRef }: { apiRef: React.RefObject<UseSelectReturn | null> }) {
  apiRef.current = useSelectContext();
  return null;
}

const createApiRef = (): React.RefObject<UseSelectReturn | null> => ({ current: null });

function BasicSelect({
  apiRef,
  ...props
}: SelectRootProps & { apiRef?: React.RefObject<UseSelectReturn | null> }) {
  return (
    <SelectRoot {...props}>
      {apiRef && <ApiProbe apiRef={apiRef} />}
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
        <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
      </SelectTrigger>
      <SelectPositioner data-testid="positioner">
        <SelectContent>
          <SelectItem value="apple" label="Apple">
            Apple
          </SelectItem>
          <SelectItem value="banana" label="Banana">
            Banana
          </SelectItem>
          <SelectItem value="cherry" label="Cherry">
            Cherry
          </SelectItem>
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

function SelectWithDisabledItem(props: SelectRootProps) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectItem value="apple" label="Apple">
            Apple
          </SelectItem>
          <SelectItem value="banana" label="Banana" disabled>
            Banana
          </SelectItem>
          <SelectItem value="cherry" label="Cherry">
            Cherry
          </SelectItem>
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

async function openWithClick(user: ReturnType<typeof userEvent.setup>, trigger: HTMLElement) {
  await user.click(trigger);
  await waitForPositioning();
}

describe("useSelect rendering & ARIA", () => {
  it("renders the trigger as a combobox with listbox popup wiring", async () => {
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-autocomplete", "none");

    const listbox = getByRole("listbox");
    expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
  });

  it("sets aria-expanded='true' while open", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("always exposes aria-required and aria-invalid, explicitly 'false' when off", async () => {
    const { getByRole, rerender } = render(<BasicSelect />);
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveAttribute("aria-required", "false");
    expect(getByRole("combobox")).toHaveAttribute("aria-invalid", "false");

    rerender(<BasicSelect required invalid />);
    expect(getByRole("combobox")).toHaveAttribute("aria-required", "true");
    expect(getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("exposes aria-readonly only while readOnly", async () => {
    const { getByRole, rerender } = render(<BasicSelect />);
    await waitForPositioning();

    expect(getByRole("combobox")).not.toHaveAttribute("aria-readonly");

    rerender(<BasicSelect readOnly />);
    expect(getByRole("combobox")).toHaveAttribute("aria-readonly", "true");
  });

  it("renders content as a listbox without aria-multiselectable in single mode", async () => {
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const listbox = getByRole("listbox");
    expect(listbox).not.toHaveAttribute("aria-multiselectable");
  });

  it("sets aria-multiselectable='true' in multiple mode", async () => {
    const { getByRole } = render(<BasicSelect multiple />);
    await waitForPositioning();

    expect(getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("renders items as options with aria-selected, data-value, and state attributes", async () => {
    const { getAllByRole } = render(<BasicSelect defaultValue={["banana"]} />);
    await waitForPositioning();

    const options = getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[0]).toHaveAttribute("data-value", "apple");
    expect(options[0]).not.toHaveAttribute("data-selected");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("data-value", "banana");
    expect(options[1]).toHaveAttribute("data-selected");
  });

  it("marks disabled items with aria-disabled and data-disabled, absent otherwise", async () => {
    const { getAllByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const options = getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-disabled", "true");
    expect(options[1]).toHaveAttribute("data-disabled");
    expect(options[0]).not.toHaveAttribute("aria-disabled");
    expect(options[0]).not.toHaveAttribute("data-disabled");
  });

  it("carries presence-style state attributes on the trigger", async () => {
    const user = userEvent.setup();
    const { getByRole, rerender } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    expect(trigger).not.toHaveAttribute("data-open");
    expect(trigger).not.toHaveAttribute("data-disabled");
    expect(trigger).not.toHaveAttribute("data-invalid");
    expect(trigger).not.toHaveAttribute("data-readonly");

    await openWithClick(user, trigger);
    expect(trigger).toHaveAttribute("data-open");

    rerender(<BasicSelect disabled invalid readOnly />);
    expect(trigger).toHaveAttribute("data-disabled");
    expect(trigger).toHaveAttribute("data-invalid");
    expect(trigger).toHaveAttribute("data-readonly");
  });

  it("carries data-hidden on positioner and content while never opened", async () => {
    const { getByRole, getByTestId } = render(<BasicSelect />);
    await waitForPositioning();

    expect(getByTestId("positioner")).toHaveAttribute("data-hidden");
    expect(getByRole("listbox")).toHaveAttribute("data-hidden");
    expect(getByTestId("positioner")).not.toHaveAttribute("data-open");
  });

  it("carries data-open on positioner and content while open, and data-hidden again after the close transition", async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(<BasicSelect />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    expect(getByTestId("positioner")).toHaveAttribute("data-open");
    expect(getByRole("listbox")).toHaveAttribute("data-open");
    expect(getByTestId("positioner")).not.toHaveAttribute("data-hidden");

    await user.click(getByRole("combobox"));
    expect(getByTestId("positioner")).not.toHaveAttribute("data-open");
    // stays mounted during the close transition, then flips to hidden
    await waitFor(() => expect(getByTestId("positioner")).toHaveAttribute("data-hidden"));
    expect(getByRole("listbox")).toHaveAttribute("data-hidden");
  });
});

describe("useSelect open/close", () => {
  it("toggles open/closed on trigger click", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports uncontrolled open with defaultOpen and fires onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getByRole } = render(<BasicSelect defaultOpen onOpenChange={onOpenChange} />);
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    await user.click(getByRole("combobox"));
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps a controlled open prop pinned while still firing onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getByRole } = render(<BasicSelect open onOpenChange={onOpenChange} />);
    await waitForPositioning();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  // controlled open that actually tracks onOpenChange (the counterpart to the
  // pinned case above): the listbox opens and closes as the parent state flips.
  it("opens and closes when a controlled open prop tracks onOpenChange", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return <BasicSelect open={open} onOpenChange={setOpen} />;
    }

    const { getByRole } = render(<Controlled />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openWithClick(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("fires onOpenChange(true) when opening from the closed trigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getByRole } = render(<BasicSelect onOpenChange={onOpenChange} />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("fires onOpenChange(true) when opening via keyboard", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getByRole } = render(<BasicSelect onOpenChange={onOpenChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // The single-select commit path closes the listbox via setOpen(false), so the
  // consumer callback must fire — not just the aria-expanded flip.
  it("fires onOpenChange(false) when a single-select commit closes the listbox", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getAllByRole } = render(<BasicSelect defaultOpen onOpenChange={onOpenChange} />);
    await waitForPositioning();

    await user.click(getAllByRole("option")[1]);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  // FloatingFocusManager returns focus to the trigger on close so keyboard users
  // land back on the combobox rather than the top of the document.
  it("returns focus to the trigger when closed via Escape", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{Escape}");

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("does not clear the value when closed via Escape", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <BasicSelect defaultValue={["apple"]} onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(getByRole("combobox")).toHaveTextContent("Apple");
  });

  it("closes on outside press", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(
      <div>
        <BasicSelect />
        <button type="button">Outside</button>
      </div>,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getByText("Outside"));
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when focus moves outside (Tab away)", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <div>
        <BasicSelect />
        <button type="button">After</button>
      </div>,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.tab();
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("never opens while disabled", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect disabled />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("never opens while readOnly (click, keyboard), but closing still works", async () => {
    const user = userEvent.setup();
    const { getByRole, rerender } = render(<BasicSelect readOnly />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    for (const key of ["{ArrowDown}", "{ArrowUp}", "{Enter}", " ", "{Alt>}{ArrowDown}{/Alt}"]) {
      await user.keyboard(key);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    }

    // a select forced open can always close
    rerender(<BasicSelect readOnly defaultOpen />);
    await waitForPositioning();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when a parent dismissible layer is removed", async () => {
    const user = userEvent.setup();
    const { DismissibleLayer } = await import("@seed-design/react-dismissible-layer");

    function Wrapper() {
      const [outerEnabled, setOuterEnabled] = React.useState(true);
      return (
        <div>
          <button type="button" onClick={() => setOuterEnabled(false)}>
            Remove parent
          </button>
          <DismissibleLayer
            enabled={outerEnabled}
            onEscapeKeyDown={() => {}}
            onPressOutside={() => {}}
            onFocusOutside={() => {}}
            onCascadeDismiss={() => {}}
          >
            <div>
              <BasicSelect />
            </div>
          </DismissibleLayer>
        </div>
      );
    }

    const { getByRole, getByText } = render(<Wrapper />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // fireEvent.click dispatches no pointerdown, so press-outside cannot close
    // the select first — only the cascade from the removed parent layer can.
    await act(async () => {
      fireEvent.click(getByText("Remove parent"));
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not submit an enclosing form or fire native constraint validation on trigger click", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onInvalid = jest.fn();
    const { getByRole, container } = render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <SelectRoot name="fruit" required>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
            </SelectContent>
          </SelectPositioner>
          <SelectHiddenSelect onInvalid={onInvalid} />
        </SelectRoot>
      </form>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    expect(trigger).toHaveAttribute("type", "button");
    await openWithClick(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onInvalid).not.toHaveBeenCalled();
    expect(container.querySelector("select")).toBeRequired();
  });
});

describe("useSelect selection (single)", () => {
  it("commits on item click: sets the value and closes the listbox", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(<BasicSelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Banana");
  });

  it("keeps a controlled value pinned while still firing onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect value={["apple"]} onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    expect(getByRole("combobox")).toHaveTextContent("Apple");
    expect(getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
  });

  it("does nothing when a disabled option is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <SelectWithDisabledItem onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  // A readOnly select never commits, even when forced open: `open` is
  // controllable, so defaultOpen/open bypasses the setOpen guard and renders
  // the listbox. The commit itself must still refuse.
  it("does not commit an item click while readOnly, even when forced open", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect readOnly defaultOpen onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  // Same guarantee for disabled: a forced-open disabled select must not commit.
  it("does not commit an item click while disabled, even when forced open", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      <BasicSelect disabled defaultOpen onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  // The keyboard commit path (Enter over the highlighted option) shares the
  // same guard, so a forced-open readOnly select refuses it too.
  it("does not commit via keyboard while readOnly, even when forced open", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <BasicSelect readOnly defaultOpen onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    const content = getByRole("listbox");
    content.focus();
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  // The item's own onClick is merged, not replaced: mergeProps chains the
  // consumer's handler ahead of the hook's, so both run on a single click.
  it("runs an item's onClick alongside the commit", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <SelectRoot onValueChange={onValueChange}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="apple" label="Apple" onClick={onClick}>
              Apple
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[0]);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["apple"]);
  });

  it("does not commit an item click whose default was prevented", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <SelectRoot onValueChange={onValueChange}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem
              value="apple"
              label="Apple"
              // consumer handler runs before the hook's and vetoes the commit
              onClick={(event) => event.preventDefault()}
            >
              Apple
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not fire onValueChange when re-committing the already selected value", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect defaultValue={["apple"]} onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.click(getAllByRole("option")[0]);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not commit the highlighted option on outside click", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getByText } = render(
      <div>
        <BasicSelect onValueChange={onValueChange} />
        <button type="button">Outside</button>
      </div>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.click(getByText("Outside"));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("useSelect selection (multiple)", () => {
  it("toggles membership preserving insertion order and keeps the listbox open", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect multiple onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    const options = getAllByRole("option");

    await user.click(options[1]);
    expect(onValueChange).toHaveBeenLastCalledWith(["banana"]);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(options[0]);
    expect(onValueChange).toHaveBeenLastCalledWith(["banana", "apple"]);

    await user.click(options[1]);
    expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
    expect(onValueChange).toHaveBeenCalledTimes(3);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders the selected textValues joined with ', ' in the trigger", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<BasicSelect multiple />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.click(getAllByRole("option")[0]);
    await user.click(getAllByRole("option")[2]);

    expect(trigger).toHaveTextContent("Apple, Cherry");
  });

  // unresolved entries hold a slot in selectedItems but must never reach the
  // join, which would emit a stray separator around an empty textValue.
  it("skips unresolved values in the joined trigger text", async () => {
    const { getByRole } = render(
      <BasicSelect multiple defaultValue={["apple", "ghost", "cherry"]} />,
    );
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveTextContent("Apple, Cherry");
  });

  // controlled multiple: the toggle payload reaches onValueChange but the
  // rendered selection stays pinned to the controlled value (parity with the
  // single-select controlled case).
  it("keeps a controlled multiple value pinned while still firing onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect multiple value={["apple"]} onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.click(getAllByRole("option")[1]);

    expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
    // value is controlled and the parent never updates it, so it stays pinned
    const options = getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
    expect(trigger).toHaveTextContent("Apple");
    // multiple never closes on commit
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("useSelect value display", () => {
  // selectedItems is index-aligned with value: an unregistered value keeps its
  // slot as an unresolved entry rather than dropping out, so consumers never
  // have to reconcile two different lengths.
  it("projects value through the option registry into selectedItems, keeping a slot for unregistered values", async () => {
    const apiRef = createApiRef();
    render(<BasicSelect multiple defaultValue={["banana", "ghost"]} apiRef={apiRef} />);
    await waitForPositioning();

    expect(apiRef.current?.selectedItems).toHaveLength(2);
    expect(apiRef.current?.selectedItems[0]).toMatchObject({
      value: "banana",
      label: "Banana",
      textValue: "Banana",
      resolved: true,
    });
    expect(apiRef.current?.selectedItems[1]).toMatchObject({
      value: "ghost",
      label: null,
      textValue: "",
      resolved: false,
    });
  });

  it("reflects the first selected option's rendered index in selectedIndex", async () => {
    const apiRef = createApiRef();
    const { rerender } = render(<BasicSelect apiRef={apiRef} multiple value={[]} />);
    await waitForPositioning();

    expect(apiRef.current?.selectedIndex).toBeNull();

    rerender(<BasicSelect apiRef={apiRef} multiple value={["cherry"]} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedIndex).toBe(2);

    rerender(<BasicSelect apiRef={apiRef} multiple value={["banana", "cherry"]} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedIndex).toBe(1);
  });

  it("keeps a stable [] reference for the uncontrolled empty selection", async () => {
    const apiRef = createApiRef();
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect apiRef={apiRef} />);
    await waitForPositioning();

    const first = apiRef.current?.value;
    if (!first) throw new Error("api probe not ready");

    await openWithClick(user, getByRole("combobox"));
    await user.keyboard("{Escape}");
    const second = apiRef.current?.value;

    expect(first).toEqual([]);
    expect(second).toBe(first);
  });

  it("renders the selected option's label in the trigger for single-select", async () => {
    const { getByRole } = render(<BasicSelect defaultValue={["cherry"]} />);
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveTextContent("Cherry");
  });

  it("renders the placeholder only while the selection is empty", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole, queryByText } = render(<BasicSelect />);
    await waitForPositioning();

    expect(queryByText("Choose a fruit")).toBeInTheDocument();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[0]);
    expect(queryByText("Choose a fruit")).not.toBeInTheDocument();
  });

  // selectedItem answers "the one selected entry" once, so consumers stop
  // rederiving it from value.length and an index into selectedItems.
  it("exposes the single resolved selection as selectedItem", async () => {
    const apiRef = createApiRef();
    const { rerender } = render(<BasicSelect apiRef={apiRef} value={["cherry"]} />);
    await waitForPositioning();

    expect(apiRef.current?.selectedItem).toMatchObject({ value: "cherry", textValue: "Cherry" });

    rerender(<BasicSelect apiRef={apiRef} value={[]} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedItem).toBeUndefined();

    rerender(<BasicSelect apiRef={apiRef} multiple value={["apple", "cherry"]} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedItem).toBeUndefined();

    // a lone value the registry cannot resolve carries no entry to mirror
    rerender(<BasicSelect apiRef={apiRef} value={["ghost"]} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedItem).toBeUndefined();
  });

  // The placeholder fallback is gated on a non-empty registry: the server render
  // and the frame before registration both see an empty one, and flipping
  // placeholder -> label there would be a hydration text mismatch.
  it("does not fall back to the placeholder while no option has registered", async () => {
    const { getByRole, queryByText } = render(
      <SelectRoot defaultValue={["apple"]}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
          <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent />
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    expect(queryByText("Choose a fruit")).not.toBeInTheDocument();
    expect(getByRole("combobox")).toHaveTextContent("");
  });

  it("renders formatValue output instead of the default display", async () => {
    const { getByRole } = render(
      <BasicSelect
        multiple
        defaultValue={["apple", "banana"]}
        formatValue={(items) => `${items.length} selected`}
      />,
    );
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveTextContent("2 selected");
  });

  it("prefers SelectValue children over formatValue", async () => {
    const { getByRole } = render(
      <SelectRoot defaultValue={["apple"]} formatValue={() => "from formatValue"}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue>from children</SelectValue>
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="apple" label="Apple">
              Apple
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    expect(getByRole("combobox")).toHaveTextContent("from children");
    expect(getByRole("combobox")).not.toHaveTextContent("from formatValue");
  });

  it("resolves the registered textValue from textValue prop, string label, then value", async () => {
    // the rich label without textValue below intentionally triggers the dev warning
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const apiRef = createApiRef();
    render(
      <SelectRoot>
        <ApiProbe apiRef={apiRef} />
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="a" label="Label A" textValue="Text A" />
            <SelectItem value="b" label="Label B" />
            <SelectItem value="c" label={<b>Rich C</b>} />
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    expect(apiRef.current?.optionRegistry.get("a")?.textValue).toBe("Text A");
    expect(apiRef.current?.optionRegistry.get("b")?.textValue).toBe("Label B");
    expect(apiRef.current?.optionRegistry.get("c")?.textValue).toBe("c");
    warn.mockRestore();
  });

  it("warns in dev when label is a ReactNode and textValue is omitted", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SelectRoot>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="rich" label={<b>Rich</b>} />
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('SelectItem "rich"'));
    warn.mockRestore();
  });
});

// aria-activedescendant lives on the listbox content (which holds DOM focus
// while open), resolved from the trigger through aria-controls.
function getListbox(trigger: HTMLElement) {
  const contentId = trigger.getAttribute("aria-controls");
  const listbox = contentId ? document.getElementById(contentId) : null;
  if (!listbox) throw new Error("listbox not found via aria-controls");
  return listbox;
}

function expectSingleHighlight(trigger: HTMLElement) {
  const highlighted = getHighlightedItems();
  expect(highlighted).toHaveLength(1);
  expect(getListbox(trigger).getAttribute("aria-activedescendant")).toBe(highlighted[0].id);
  return highlighted[0];
}

function expectNoHighlight(trigger: HTMLElement) {
  expect(getHighlightedItems()).toHaveLength(0);
  expect(getListbox(trigger)).not.toHaveAttribute("aria-activedescendant");
}

describe("useSelect keyboard open & highlight seeding", () => {
  it.each([
    "{ArrowDown}",
    "{ArrowUp}",
    "{Enter}",
    " ",
  ])("opens on %s from the closed trigger and seeds the first enabled option", async (key) => {
    const user = userEvent.setup();
    const { getByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard(key);
    await waitForPositioning();

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const highlighted = expectSingleHighlight(trigger);
    expect(highlighted).toHaveAttribute("data-value", "apple");
  });

  it("seeds the selected option on keyboard open", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect defaultValue={["cherry"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();

    const highlighted = expectSingleHighlight(trigger);
    expect(highlighted).toHaveAttribute("data-value", "cherry");
  });

  it("seeds the first selected option in DOM order for multiple selects", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect multiple defaultValue={["cherry", "banana"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();

    const highlighted = expectSingleHighlight(trigger);
    expect(highlighted).toHaveAttribute("data-value", "banana");
  });

  it("seeds no highlight on pointer open", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect defaultValue={["banana"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expectNoHighlight(trigger);
  });

  it("reveals the current selection on the first arrow press after a pointer open", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect defaultValue={["banana"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{ArrowDown}");

    const highlighted = expectSingleHighlight(trigger);
    expect(highlighted).toHaveAttribute("data-value", "banana");
  });

  it("highlights the first option on the first arrow press after a pointer open with no selection", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{ArrowUp}");

    const highlighted = expectSingleHighlight(trigger);
    expect(highlighted).toHaveAttribute("data-value", "apple");
  });

  it("clears the highlight on close so reopening starts clean", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // aria-activedescendant lives on the listbox, not the trigger — assert it
    // there so the check can't pass vacuously.
    expect(getListbox(trigger)).not.toHaveAttribute("aria-activedescendant");

    await openWithClick(user, trigger);
    expectNoHighlight(trigger);
  });

  // Every option disabled: the seed resolves to null (findFirstEnabledIndex),
  // so opening leaves no highlight and navigation stays inert without crashing.
  it("seeds no highlight and keeps navigation inert when every option is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <SelectRoot onValueChange={onValueChange}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="apple" label="Apple" disabled>
              Apple
            </SelectItem>
            <SelectItem value="banana" label="Banana" disabled>
              Banana
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expectNoHighlight(trigger);

    // arrows/Home/End all no-op, never highlighting a disabled option
    await user.keyboard("{ArrowDown}{ArrowUp}{Home}{End}");
    expectNoHighlight(trigger);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("useSelect arrow navigation", () => {
  it("skips disabled options while navigating", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");

    await user.keyboard("{ArrowDown}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "cherry");
  });

  it("wraps from last to first and from first to last", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await waitForPositioning();
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "cherry");

    await user.keyboard("{ArrowDown}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");

    await user.keyboard("{ArrowUp}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "cherry");
  });

  it("jumps to the first/last enabled option on Home/End", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <SelectRoot>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="a" label="A" disabled>
              A
            </SelectItem>
            <SelectItem value="b" label="B">
              B
            </SelectItem>
            <SelectItem value="c" label="C">
              C
            </SelectItem>
            <SelectItem value="d" label="D" disabled>
              D
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();

    await user.keyboard("{End}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "c");

    await user.keyboard("{Home}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "b");
  });

  it("moves DOM focus into the listbox on open and keeps it there while navigating", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);

    const listbox = getListbox(trigger);
    await waitFor(() => expect(listbox).toHaveFocus());

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(listbox).toHaveFocus();
    expectSingleHighlight(trigger);
  });
});

describe("useSelect hover highlight", () => {
  it("moves the single highlight to the hovered option", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.hover(getAllByRole("option")[2]);

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "cherry");
  });

  it("continues arrow navigation from the hovered option", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.hover(getAllByRole("option")[1]);
    await user.keyboard("{ArrowDown}");

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "cherry");
  });

  it("does not highlight a disabled option on hover", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.hover(getAllByRole("option")[1]);

    expectNoHighlight(trigger);
  });

  // A touch tap fires a compatibility mouse sequence (mouseover/mousemove/…)
  // after touchend; that synthetic mousemove must not be mistaken for a hover
  // and leave a highlight stuck under the finger. Multiple mode keeps the
  // listbox open after a commit, so the leak is observable there (mobile-first:
  // a stuck highlight reads as a pressed state).
  it("leaves no highlight after a touch tap on an option in multiple mode", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<BasicSelect multiple />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);

    const banana = getAllByRole("option")[1];
    await user.pointer([{ keys: "[TouchA]", target: banana }]);

    expect(banana).toHaveAttribute("data-selected");
    expectNoHighlight(trigger);
  });
});

describe("useSelect keyboard commit", () => {
  it("commits the highlighted option on Enter exactly once", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("commits the highlighted option on Space", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();
    await user.keyboard(" ");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes without selecting on Enter/Space when nothing is highlighted", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("{Enter}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openWithClick(user, trigger);
    await user.keyboard(" ");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the highlight in place when toggling selection in multiple mode", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect multiple defaultValue={["apple"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");

    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");
    const afterSelect = expectSingleHighlight(trigger);
    expect(afterSelect).toHaveAttribute("data-value", "banana");
    expect(afterSelect).toHaveAttribute("data-selected");

    // deselecting the highlighted option keeps the highlight there
    await user.keyboard(" ");
    const afterDeselect = expectSingleHighlight(trigger);
    expect(afterDeselect).toHaveAttribute("data-value", "banana");
    expect(afterDeselect).not.toHaveAttribute("data-selected");
  });
});

function CitySelect(props: SelectRootProps) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="City">
        <SelectValue />
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectItem value="new-york" label="New York">
            New York
          </SelectItem>
          <SelectItem value="new-jersey" label="New Jersey">
            New Jersey
          </SelectItem>
          <SelectItem value="newark" label="Newark">
            Newark
          </SelectItem>
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

function LetterSelect(props: SelectRootProps) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectItem value="apple" label="Apple">
            Apple
          </SelectItem>
          <SelectItem value="apricot" label="Apricot">
            Apricot
          </SelectItem>
          <SelectItem value="banana" label="Banana">
            Banana
          </SelectItem>
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

describe("useSelect typeahead (open)", () => {
  it("moves the highlight to the multi-character prefix match", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<LetterSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("apr");

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apricot");
  });

  it("never matches disabled options", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <SelectRoot>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="apple" label="Apple" disabled>
              Apple
            </SelectItem>
            <SelectItem value="avocado" label="Avocado">
              Avocado
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("a");

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "avocado");
  });

  it("treats Space during an in-progress typeahead as typing, not a commit", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<CitySelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("new j");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "new-jersey");

    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["new-jersey"]);
  });

  it("wraps the match search past the end of the list", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<LetterSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.hover(getAllByRole("option")[1]); // highlight Apricot
    await user.keyboard("a");

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");
  });

  it("cycles through options sharing the same first letter on repeated presses", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<LetterSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);

    await user.keyboard("a");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");
    await user.keyboard("a");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apricot");
    await user.keyboard("a");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");
  });

  it("keeps narrowing across prefix-adjacent options", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <SelectRoot>
        <SelectTrigger aria-label="Word">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="alpha" label="Alpha">
              Alpha
            </SelectItem>
            <SelectItem value="alphabet" label="Alphabet">
              Alphabet
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("alphab");

    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "alphabet");
  });

  // each case renders fresh so the 750ms typeahead buffer never
  // couples the searches ("z" then "c" would otherwise search for "zc").
  function MatchStringSelect(props: SelectRootProps) {
    return (
      <SelectRoot {...props}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="first" label="Apple" typeaheadLabel="Zucchini">
              Apple
            </SelectItem>
            <SelectItem value="second" label={<b>Fancy</b>} textValue="Cherry">
              Wrong Words
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    );
  }

  it("matches typeaheadLabel over the string label", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<MatchStringSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("z");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "first");
  });

  it("matches the textValue when the label is a ReactNode", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<MatchStringSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    await user.keyboard("c");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "second");
  });

  it("never matches the rendered children textContent", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<MatchStringSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);
    // "Wrong Words" is the second item's DOM text; it must not be typeable
    await user.keyboard("w");
    expectNoHighlight(trigger);
  });
});

describe("useSelect typeahead (closed trigger)", () => {
  it("commits the matched value directly without opening (single-select)", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("b");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    expect(trigger).toHaveTextContent("Banana");
  });

  it("does nothing while closed in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect multiple onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("b");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does nothing while readOnly", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<BasicSelect readOnly onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("b");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps a mid-search Space from opening the listbox", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole } = render(<CitySelect onValueChange={onValueChange} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("new j");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(["new-jersey"]);
  });

  it("leaves no highlight behind for the next pointer open after a closed commit", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("b");
    expect(trigger).toHaveTextContent("Banana");

    await openWithClick(user, trigger);
    expectNoHighlight(trigger);
  });
});

describe("useSelect option registry", () => {
  it("re-registering identical entries causes no registry churn", async () => {
    const apiRef = createApiRef();
    const { rerender } = render(<BasicSelect apiRef={apiRef} />);
    await waitForPositioning();

    const before = apiRef.current?.optionRegistry;
    if (!before) throw new Error("api probe not ready");

    expect(before.size).toBe(3);

    rerender(<BasicSelect apiRef={apiRef} />);
    await waitForPositioning();

    expect(apiRef.current?.optionRegistry).toBe(before);
  });

  it("updates the trigger text when a selected item's label changes while closed", async () => {
    function Wrapper({ label }: { label: string }) {
      return (
        <SelectRoot defaultValue={["a"]}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectItem value="a" label={label}>
                {label}
              </SelectItem>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    const { getByRole, rerender } = render(<Wrapper label="Apple" />);
    await waitForPositioning();
    expect(getByRole("combobox")).toHaveTextContent("Apple");

    rerender(<Wrapper label="Golden Apple" />);
    await waitForPositioning();
    expect(getByRole("combobox")).toHaveTextContent("Golden Apple");
  });

  // The value is the source of truth for submission and onValueChange, so an
  // option unmounting never rewrites it — that would fire a change the consumer
  // never asked for and fight a controlled parent. Display degrades instead.
  it("keeps the value when the selected option unregisters, falling back to the placeholder", async () => {
    const onValueChange = jest.fn();
    const apiRef = createApiRef();

    function Wrapper({ showBanana }: { showBanana: boolean }) {
      return (
        <SelectRoot defaultValue={["banana"]} onValueChange={onValueChange}>
          <ApiProbe apiRef={apiRef} />
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
            <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
              {showBanana && (
                <SelectItem value="banana" label="Banana">
                  Banana
                </SelectItem>
              )}
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    const { getByRole, rerender, queryByText } = render(<Wrapper showBanana />);
    await waitForPositioning();
    expect(getByRole("combobox")).toHaveTextContent("Banana");

    rerender(<Wrapper showBanana={false} />);
    await waitForPositioning();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(apiRef.current?.value).toEqual(["banana"]);
    expect(queryByText("Choose a fruit")).toBeInTheDocument();
  });

  it("keeps every value when one of several selected options unregisters, showing the survivors", async () => {
    const onValueChange = jest.fn();
    const apiRef = createApiRef();

    function Wrapper({ showBanana }: { showBanana: boolean }) {
      return (
        <SelectRoot multiple defaultValue={["banana", "apple"]} onValueChange={onValueChange}>
          <ApiProbe apiRef={apiRef} />
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
            <SelectPlaceholder>Choose a fruit</SelectPlaceholder>
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
              {showBanana && (
                <SelectItem value="banana" label="Banana">
                  Banana
                </SelectItem>
              )}
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    const { getByRole, rerender, queryByText } = render(<Wrapper showBanana />);
    await waitForPositioning();

    rerender(<Wrapper showBanana={false} />);
    await waitForPositioning();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(apiRef.current?.value).toEqual(["banana", "apple"]);
    // one entry still resolves, so the trigger shows it rather than the placeholder
    expect(getByRole("combobox")).toHaveTextContent("Apple");
    expect(queryByText("Choose a fruit")).not.toBeInTheDocument();
  });

  it("never rewrites a defaultValue whose option has not registered", async () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <BasicSelect defaultValue={["cherry"]} onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(getByRole("combobox")).toHaveTextContent("Cherry");
  });
});

describe("useSelect hidden select", () => {
  it("mirrors name/form/required/disabled/multiple and the current value", async () => {
    const { container, rerender } = render(
      <BasicSelectWithHiddenSelect
        name="fruit"
        form="fruit-form"
        required
        defaultValue={["banana"]}
      />,
    );
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    expect(hidden).toHaveAttribute("name", "fruit");
    expect(hidden).toHaveAttribute("form", "fruit-form");
    expect(hidden).toBeRequired();
    expect(hidden).not.toBeDisabled();
    expect(hidden.multiple).toBe(false);
    expect(hidden.value).toBe("banana");
    expect(hidden).toHaveAttribute("aria-hidden");
    expect(hidden.tabIndex).toBe(-1);

    // options come from the registry with textValue as text, plus a leading
    // empty option so `required` constraint validation can fail
    const options = Array.from(hidden.querySelectorAll("option"));
    expect(options.map((option) => option.value)).toEqual(["", "apple", "banana", "cherry"]);
    expect(options[2]).toHaveTextContent("Banana");

    rerender(<BasicSelectWithHiddenSelect name="fruit" disabled defaultValue={["banana"]} />);
    expect(container.querySelector("select")).toBeDisabled();
  });

  // A controlled <select> silently drops a value that matches no <option>, so a
  // value the registry cannot resolve still needs an option of its own or the
  // form would submit nothing.
  it("submits a value whose option is not registered through a fallback option", async () => {
    const { container } = render(
      <BasicSelectWithHiddenSelect name="fruit" defaultValue={["ghost"]} />,
    );
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    expect(hidden.value).toBe("ghost");
    const options = Array.from(hidden.querySelectorAll("option"));
    expect(options.map((option) => option.value)).toEqual([
      "",
      "apple",
      "banana",
      "cherry",
      "ghost",
    ]);
  });

  it("carries every selected value on the multiple hidden select", async () => {
    const user = userEvent.setup();
    const { container, getByRole, getAllByRole } = render(
      <BasicSelectWithHiddenSelect name="fruits" multiple />,
    );
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[0]);
    await user.click(getAllByRole("option")[2]);

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    expect(hidden.multiple).toBe(true);
    // no leading empty option in multiple mode
    const options = Array.from(hidden.querySelectorAll("option"));
    expect(options.map((option) => option.value)).toEqual(["apple", "banana", "cherry"]);
    expect(Array.from(hidden.selectedOptions).map((option) => option.value)).toEqual([
      "apple",
      "cherry",
    ]);
  });

  it("propagates native change events back into the component (single)", async () => {
    const { container, getByRole } = render(<BasicSelectWithHiddenSelect name="fruit" />);
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    fireEvent.change(hidden, { target: { value: "cherry" } });
    await waitForPositioning();
    expect(getByRole("combobox")).toHaveTextContent("Cherry");

    fireEvent.change(hidden, { target: { value: "" } });
    await waitForPositioning();
    expect(getByRole("combobox")).not.toHaveTextContent("Cherry");
  });

  it("propagates native change events back into the component (multiple)", async () => {
    const apiRef = createApiRef();
    const { container } = render(<BasicSelectWithHiddenSelect apiRef={apiRef} multiple />);
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    const options = Array.from(hidden.querySelectorAll("option"));
    for (const option of options) option.selected = option.value !== "banana";
    fireEvent.change(hidden);
    await waitForPositioning();

    expect(apiRef.current?.value).toEqual(["apple", "cherry"]);
  });

  // label clicks, extensions, and autofill land focus on the hidden select
  it("forwards focus on the hidden select to the trigger", async () => {
    const { container, getByRole } = render(<BasicSelectWithHiddenSelect name="fruit" />);
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    act(() => hidden.focus());

    expect(getByRole("combobox")).toHaveFocus();
  });

  it("suppresses native validation reporting and focuses the trigger instead", async () => {
    const { container, getByRole } = render(
      <form>
        <BasicSelectWithHiddenSelect name="fruit" required />
      </form>,
    );
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    // fireEvent returns false when preventDefault was called — the reporting
    // step (UA bubble + focus into the aria-hidden subtree) must be cancelled.
    const reported = fireEvent.invalid(hidden);

    expect(reported).toBe(false);
    expect(getByRole("combobox")).toHaveFocus();
  });

  // Only the form's *first* invalid control takes focus (native ordering), so a
  // control failing ahead of the select must not have it stolen away.
  it("leaves focus alone when another control is the form's first invalid", async () => {
    const { container, getByRole } = render(
      <form>
        <input aria-label="Nickname" name="nickname" required />
        <BasicSelectWithHiddenSelect name="fruit" required />
      </form>,
    );
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    const reported = fireEvent.invalid(hidden);

    expect(reported).toBe(false);
    expect(getByRole("combobox")).not.toHaveFocus();
  });

  // Consumer handlers chain onto the internal ones rather than replacing them —
  // an onChange of the caller's own must not sever the native -> component sync.
  it("chains a consumer onChange onto the internal value sync", async () => {
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <BasicSelectWithHiddenSelect name="fruit" hiddenSelectProps={{ onChange }} />,
    );
    await waitForPositioning();

    const hidden = container.querySelector("select");
    if (!hidden) throw new Error("hidden select not rendered");

    fireEvent.change(hidden, { target: { value: "cherry" } });
    await waitForPositioning();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(getByRole("combobox")).toHaveTextContent("Cherry");
  });
});

function BasicSelectWithHiddenSelect({
  apiRef,
  hiddenSelectProps,
  ...props
}: SelectRootProps & {
  apiRef?: React.RefObject<UseSelectReturn | null>;
  hiddenSelectProps?: SelectHiddenSelectProps;
}) {
  return (
    <SelectRoot {...props}>
      {apiRef && <ApiProbe apiRef={apiRef} />}
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <SelectItem value="apple" label="Apple">
            Apple
          </SelectItem>
          <SelectItem value="banana" label="Banana">
            Banana
          </SelectItem>
          <SelectItem value="cherry" label="Cherry">
            Cherry
          </SelectItem>
        </SelectContent>
      </SelectPositioner>
      <SelectHiddenSelect {...hiddenSelectProps} />
    </SelectRoot>
  );
}

describe("useSelect open reveal", () => {
  async function withScrollReceivers(run: (received: HTMLElement[]) => Promise<void>) {
    const received: HTMLElement[] = [];
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = function () {
      received.push(this);
    };
    try {
      await run(received);
    } finally {
      HTMLElement.prototype.scrollIntoView = original;
    }
  }

  const flushFrame = () =>
    act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });

  it("scrolls the selected option into view on pointer open", async () => {
    await withScrollReceivers(async (received) => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect defaultValue={["banana"]} />);
      await waitForPositioning();

      await openWithClick(user, getByRole("combobox"));
      await flushFrame();

      expect(received.some((element) => element.getAttribute("data-value") === "banana")).toBe(
        true,
      );
    });
  });

  it("scrolls the seeded highlight into view on keyboard open", async () => {
    await withScrollReceivers(async (received) => {
      const user = userEvent.setup();
      const { getByRole } = render(<BasicSelect />);
      await waitForPositioning();

      act(() => getByRole("combobox").focus());
      await user.keyboard("{Enter}");
      await waitForPositioning();
      await flushFrame();

      // No selection: the keyboard seed lands on the first enabled option.
      expect(received.some((element) => element.getAttribute("data-value") === "apple")).toBe(true);
    });
  });
});

describe("useSelectGroup", () => {
  it("labels each group with its own rendered label", async () => {
    const { getAllByRole, getByText } = render(
      <SelectRoot>
        <SelectTrigger aria-label="Food">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectGroup>
              <SelectGroupLabel>Fruits</SelectGroupLabel>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectGroupLabel>Vegetables</SelectGroupLabel>
              <SelectItem value="carrot" label="Carrot">
                Carrot
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>,
    );
    await waitForPositioning();

    const groups = getAllByRole("group");
    expect(groups).toHaveLength(2);

    const fruitsLabel = getByText("Fruits");
    const vegetablesLabel = getByText("Vegetables");
    expect(fruitsLabel).toHaveAttribute("role", "presentation");
    expect(groups[0].getAttribute("aria-labelledby")).toBe(fruitsLabel.id);
    expect(groups[1].getAttribute("aria-labelledby")).toBe(vegetablesLabel.id);
    expect(fruitsLabel.id).not.toBe(vegetablesLabel.id);
  });

  it("drops aria-labelledby while the label is not rendered and restores it when it returns", async () => {
    function Wrapper({ showLabel }: { showLabel: boolean }) {
      return (
        <SelectRoot>
          <SelectTrigger aria-label="Food">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectGroup>
                {showLabel && <SelectGroupLabel>Fruits</SelectGroupLabel>}
                <SelectItem value="apple" label="Apple">
                  Apple
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    const { getByRole, getByText, rerender } = render(<Wrapper showLabel />);
    await waitForPositioning();

    expect(getByRole("group").getAttribute("aria-labelledby")).toBe(getByText("Fruits").id);

    rerender(<Wrapper showLabel={false} />);
    expect(getByRole("group")).not.toHaveAttribute("aria-labelledby");

    rerender(<Wrapper showLabel />);
    expect(getByRole("group").getAttribute("aria-labelledby")).toBe(getByText("Fruits").id);
  });
});

describe("useSelect icon channel", () => {
  function IconSelect({
    apiRef,
    showBanana = true,
    ...props
  }: SelectRootProps & {
    apiRef?: React.RefObject<UseSelectReturn | null>;
    showBanana?: boolean;
  }) {
    return (
      <SelectRoot {...props}>
        {apiRef && <ApiProbe apiRef={apiRef} />}
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            <SelectItem value="apple" label="Apple" icon={<svg data-icon="apple" />}>
              Apple
            </SelectItem>
            {showBanana && (
              <SelectItem value="banana" label="Banana" icon={<svg data-icon="banana" />}>
                Banana
              </SelectItem>
            )}
            <SelectItem value="cherry" label="Cherry">
              Cherry
            </SelectItem>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    );
  }

  it("registers icon without rendering it or leaking it as a DOM attribute", async () => {
    const apiRef = createApiRef();
    const { getAllByRole } = render(<IconSelect apiRef={apiRef} />);
    await waitForPositioning();

    const options = getAllByRole("option");
    expect(options[0]).not.toHaveAttribute("icon");
    expect(options[0].querySelector("svg")).toBeNull();

    expect(apiRef.current?.optionRegistry.get("apple")?.icon).toBeTruthy();
    expect(apiRef.current?.optionRegistry.get("cherry")?.icon).toBeUndefined();
  });

  it("surfaces the selected item's icon and drops it with the selection", async () => {
    const user = userEvent.setup();
    const apiRef = createApiRef();
    const { getByRole, getAllByRole, rerender } = render(<IconSelect apiRef={apiRef} />);
    await waitForPositioning();

    const getIconName = () => {
      const icon = apiRef.current?.selectedItems[0]?.icon;
      if (!React.isValidElement<{ "data-icon"?: string }>(icon)) return undefined;

      return icon.props["data-icon"];
    };

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[0]);
    expect(getIconName()).toBe("apple");

    await openWithClick(user, getByRole("combobox"));
    await user.click(getAllByRole("option")[1]);
    expect(getIconName()).toBe("banana");

    // unmounting the selected item keeps the value but drops the icon with the
    // rest of the registered entry
    rerender(<IconSelect apiRef={apiRef} showBanana={false} />);
    await waitForPositioning();
    expect(apiRef.current?.selectedItems).toHaveLength(1);
    expect(apiRef.current?.selectedItems[0]?.resolved).toBe(false);
    expect(getIconName()).toBeUndefined();
  });
});

describe("useSelect positioning", () => {
  it("positions with strategy 'absolute' by default and 'fixed' when requested", async () => {
    const user = userEvent.setup();
    const first = render(<BasicSelect />);
    await waitForPositioning();
    await openWithClick(user, first.getByRole("combobox"));
    expect(first.getByTestId("positioner").style.position).toBe("absolute");
    first.unmount();

    const second = render(<BasicSelect strategy="fixed" />);
    await waitForPositioning();
    await openWithClick(user, second.getByRole("combobox"));
    expect(second.getByTestId("positioner").style.position).toBe("fixed");
  });

  it("offsets the positioner from the trigger by the gutter", async () => {
    const user = userEvent.setup();
    const first = render(<BasicSelect />);
    await waitForPositioning();
    await openWithClick(user, first.getByRole("combobox"));
    const defaultTransform = first.getByTestId("positioner").style.transform;
    first.unmount();

    const second = render(<BasicSelect gutter={100} />);
    await waitForPositioning();
    await openWithClick(user, second.getByRole("combobox"));
    const customTransform = second.getByTestId("positioner").style.transform;

    expect(defaultTransform).toContain("8px");
    expect(customTransform).toContain("100px");
  });

  it("exposes --seed-select-available-height and --seed-select-reference-width on the floating element", async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(<BasicSelect />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));

    const positioner = getByTestId("positioner");
    // happy-dom has no layout, so availableHeight clamps to the 200px floor
    // and the reference width reads as 0.
    expect(positioner.style.getPropertyValue("--seed-select-available-height")).toBe("200px");
    expect(positioner.style.getPropertyValue("--seed-select-reference-width")).toBe("0px");
  });

  // y from side, x from alignment
  it.each([
    ["bottom", "center top"],
    ["bottom-start", "left top"],
    ["bottom-end", "right top"],
    ["right", "center center"],
  ] as const)("derives --seed-select-transform-origin from the resolved placement (%s)", async (placement, expected) => {
    const user = userEvent.setup();
    const { getByRole } = render(<BasicSelect placement={placement} />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    expect(getByRole("listbox").style.getPropertyValue("--seed-select-transform-origin")).toBe(
      expected,
    );
  });

  it("renders the listbox into a custom container", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const containerRef = React.useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={containerRef} data-testid="portal-root" />
          <SelectRoot>
            <SelectTrigger aria-label="Fruit">
              <SelectValue />
            </SelectTrigger>
            <SelectPositioner container={containerRef}>
              <SelectContent>
                <SelectItem value="apple" label="Apple">
                  Apple
                </SelectItem>
              </SelectContent>
            </SelectPositioner>
          </SelectRoot>
        </div>
      );
    }

    const { getByRole, getByTestId } = render(<Wrapper />);
    await waitForPositioning();

    await openWithClick(user, getByRole("combobox"));
    expect(getByTestId("portal-root")).toContainElement(getByRole("listbox"));
  });

  it("declares the safe-area inset custom properties on the positioner", async () => {
    const { getByTestId } = render(<BasicSelect />);
    await waitForPositioning();

    const positioner = getByTestId("positioner");
    expect(positioner.style.getPropertyValue("--seed-safe-area-top")).toBe(
      "env(safe-area-inset-top)",
    );
    expect(positioner.style.getPropertyValue("--seed-safe-area-bottom")).toBe(
      "env(safe-area-inset-bottom)",
    );
  });
});

describe("useSelect edges", () => {
  it("supports selecting from a defaultOpen listbox", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { getByRole, getAllByRole } = render(
      <BasicSelect defaultOpen onValueChange={onValueChange} />,
    );
    await waitForPositioning();

    await user.click(getAllByRole("option")[2]);
    expect(onValueChange).toHaveBeenCalledWith(["cherry"]);
    expect(getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("ignores Enter on a highlighted option that became disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    function Wrapper({ bananaDisabled }: { bananaDisabled: boolean }) {
      return (
        <SelectRoot onValueChange={onValueChange}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
              <SelectItem value="banana" label="Banana" disabled={bananaDisabled}>
                Banana
              </SelectItem>
            </SelectContent>
          </SelectPositioner>
        </SelectRoot>
      );
    }

    const { getByRole, rerender } = render(<Wrapper bananaDisabled={false} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    act(() => trigger.focus());
    await user.keyboard("{ArrowDown}");
    await waitForPositioning();
    await user.keyboard("{ArrowDown}");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "banana");

    rerender(<Wrapper bananaDisabled />);
    await user.keyboard("{Enter}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("suppresses no-op setValue calls", async () => {
    const apiRef = createApiRef();
    const onValueChange = jest.fn();
    render(<BasicSelect apiRef={apiRef} defaultValue={["apple"]} onValueChange={onValueChange} />);
    await waitForPositioning();

    await act(async () => {
      apiRef.current?.setValue(["apple"]);
    });
    expect(onValueChange).not.toHaveBeenCalled();

    await act(async () => {
      apiRef.current?.setValue(["banana"]);
    });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["banana"]);
  });

  it("keeps DOM focus in the listbox across item clicks in multiple mode", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<BasicSelect multiple />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await openWithClick(user, trigger);

    const listbox = getListbox(trigger);
    await waitFor(() => expect(listbox).toHaveFocus());

    await user.click(getAllByRole("option")[0]);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(listbox).toHaveFocus();

    // keyboard interaction keeps working right after the pointer commit
    await user.keyboard("{ArrowDown}");
    expectSingleHighlight(trigger);
  });
});

describe("useSelect virtual click", () => {
  // assistive-tech activation surfaces as a detail-0 click → keyboard open
  it("treats a detail-0 click as a keyboard open and seeds the highlight", async () => {
    const { getByRole } = render(<BasicSelect defaultValue={["banana"]} />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    // fireEvent.click dispatches a MouseEvent with detail 0, like a screen
    // reader virtual click or a programmatic element.click()
    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "banana");
  });

  // no selection to seed from → the keyboard seed falls through to the first
  // enabled option, skipping the disabled one.
  it("seeds the first enabled option on a detail-0 click with no selection", async () => {
    const { getByRole } = render(<SelectWithDisabledItem />);
    await waitForPositioning();

    const trigger = getByRole("combobox");
    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(expectSingleHighlight(trigger)).toHaveAttribute("data-value", "apple");
  });
});

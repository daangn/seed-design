import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";
import * as React from "react";

import {
  AttachmentDisplayRoot,
  AttachmentDisplayTrigger,
  AttachmentDisplayItemRemoveButton,
  AttachmentDisplayContext,
} from "./AttachmentDisplay";
import { AttachmentDisplayItemProvider } from "./useAttachmentDisplayContext";
import type { DisplayItemEntry } from "./types";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function createMockEntry(
  id: string,
  status: DisplayItemEntry["status"] = "success",
): DisplayItemEntry {
  return {
    id,
    thumbnailUrl: `https://example.com/${id}.jpg`,
    status,
  };
}

const BasicDisplay = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <AttachmentDisplayRoot ref={ref} {...props}>
      <AttachmentDisplayTrigger data-testid="trigger">Add</AttachmentDisplayTrigger>
      <ul data-testid="item-group">
        <AttachmentDisplayContext>
          {({ items }) =>
            items.map((entry, index) => (
              <AttachmentDisplayItemProvider key={entry.id} value={entry}>
                <li data-testid={`item-${index}`}>
                  <span>{entry.thumbnailUrl}</span>
                  <AttachmentDisplayItemRemoveButton data-testid={`delete-${index}`}>
                    Delete
                  </AttachmentDisplayItemRemoveButton>
                </li>
              </AttachmentDisplayItemProvider>
            ))
          }
        </AttachmentDisplayContext>
      </ul>
    </AttachmentDisplayRoot>
  );
});

describe("useAttachmentDisplay", () => {
  describe("basic rendering", () => {
    it("should render correctly", () => {
      const { getByText, getByTestId } = setUp(<BasicDisplay />);
      expect(getByText("Add")).toBeDefined();
      expect(getByTestId("item-group")).toBeDefined();
    });

    it("should render default items", () => {
      const items = [createMockEntry("1"), createMockEntry("2")];
      const { getByTestId } = setUp(<BasicDisplay defaultItems={items} maxItems={5} />);
      expect(getByTestId("item-0")).toBeDefined();
      expect(getByTestId("item-1")).toBeDefined();
    });
  });

  describe("trigger", () => {
    it("should call onTriggerClick when trigger is clicked", async () => {
      const onTriggerClick = mock(() => {});
      const { user, getByTestId } = setUp(
        <BasicDisplay onTriggerClick={onTriggerClick} maxItems={5} />,
      );
      await user.click(getByTestId("trigger"));
      expect(onTriggerClick).toHaveBeenCalledTimes(1);
    });

    it("should disable trigger when maxItems is reached", () => {
      const items = [createMockEntry("1")];
      const { getByTestId } = setUp(<BasicDisplay defaultItems={items} maxItems={1} />);
      const trigger = getByTestId("trigger") as HTMLButtonElement;
      expect(trigger.disabled).toBe(true);
    });

    it("should disable trigger when disabled prop is true", () => {
      const { getByTestId } = setUp(<BasicDisplay disabled maxItems={5} />);
      const trigger = getByTestId("trigger") as HTMLButtonElement;
      expect(trigger.disabled).toBe(true);
    });

    it("should not call onTriggerClick when disabled", async () => {
      const onTriggerClick = mock(() => {});
      const { user, getByTestId } = setUp(
        <BasicDisplay disabled onTriggerClick={onTriggerClick} maxItems={5} />,
      );
      await user.click(getByTestId("trigger"));
      expect(onTriggerClick).toHaveBeenCalledTimes(0);
    });
  });

  describe("remove item", () => {
    it("should remove item when remove button is clicked", async () => {
      const items = [createMockEntry("1"), createMockEntry("2")];
      const { user, getByTestId, queryByTestId } = setUp(
        <BasicDisplay defaultItems={items} maxItems={5} />,
      );
      await user.click(getByTestId("delete-0"));
      expect(queryByTestId("item-1")).toBeNull();
    });
  });

  describe("state props", () => {
    it("should set data-disabled on trigger when disabled", () => {
      const { getByTestId } = setUp(<BasicDisplay disabled maxItems={5} />);
      const trigger = getByTestId("trigger");
      expect(trigger.dataset.disabled).toBe("");
    });

    it("should set data-invalid on trigger when invalid", () => {
      const { getByTestId } = setUp(<BasicDisplay invalid maxItems={5} />);
      const trigger = getByTestId("trigger");
      expect(trigger.dataset.invalid).toBe("");
    });

    it("should set data-disabled on trigger when maxItems reached", () => {
      const items = [createMockEntry("1")];
      const { getByTestId } = setUp(<BasicDisplay defaultItems={items} maxItems={1} />);
      const trigger = getByTestId("trigger");
      expect(trigger.dataset.disabled).toBe("");
    });
  });
});

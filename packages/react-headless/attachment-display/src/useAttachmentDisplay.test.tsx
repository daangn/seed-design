import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";
import * as React from "react";

import {
  AttachmentDisplayContext,
  AttachmentDisplayDescription,
  AttachmentDisplayErrorMessage,
  AttachmentDisplayItemBackdrop,
  AttachmentDisplayItemRemoveButton,
  AttachmentDisplayRoot,
  type AttachmentDisplayRootProps,
  AttachmentDisplayTrigger,
} from "./AttachmentDisplay";
import type { DisplayItemEntry } from "./types";
import type { UseAttachmentDisplayReturn } from "./useAttachmentDisplay";
import {
  AttachmentDisplayItemProvider,
  useAttachmentDisplayContext,
} from "./useAttachmentDisplayContext";
import { useAttachmentDisplayItem } from "./useAttachmentDisplayItem";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function BasicItem({ entry, index }: { entry: DisplayItemEntry; index: number }) {
  const api = useAttachmentDisplayItem(entry);

  return (
    <AttachmentDisplayItemProvider value={api}>
      <li data-testid={`item-${index}`}>
        <span data-testid={`thumbnail-url-${index}`}>{entry.thumbnailUrl}</span>
        <AttachmentDisplayItemBackdrop
          status="uploading"
          data-testid={`backdrop-uploading-${index}`}
        >
          {(e) => <span>uploading: {"progress" in e ? e.progress : "n/a"}</span>}
        </AttachmentDisplayItemBackdrop>
        <AttachmentDisplayItemBackdrop status="error" data-testid={`backdrop-error-${index}`}>
          error
        </AttachmentDisplayItemBackdrop>
        <AttachmentDisplayItemRemoveButton data-testid={`remove-${index}`}>
          Remove
        </AttachmentDisplayItemRemoveButton>
      </li>
    </AttachmentDisplayItemProvider>
  );
}

const BasicDisplay = ({
  extraChildren,
  ...props
}: AttachmentDisplayRootProps & { extraChildren?: React.ReactNode }) => (
  <AttachmentDisplayRoot {...props}>
    <AttachmentDisplayTrigger data-testid="trigger">Add</AttachmentDisplayTrigger>
    <ul data-testid="items">
      <AttachmentDisplayContext>
        {({ entries }) =>
          entries.map((entry, index) => <BasicItem key={entry.id} entry={entry} index={index} />)
        }
      </AttachmentDisplayContext>
    </ul>
    {extraChildren}
  </AttachmentDisplayRoot>
);

function ApiHarness({ onApi }: { onApi: (api: UseAttachmentDisplayReturn) => void }) {
  const api = useAttachmentDisplayContext();
  React.useEffect(() => {
    onApi(api);
  });
  return null;
}

function setUpWithApi(props: AttachmentDisplayRootProps = {}) {
  let api!: UseAttachmentDisplayReturn;
  const result = setUp(
    <BasicDisplay
      {...props}
      extraChildren={
        <ApiHarness
          onApi={(value) => {
            api = value;
          }}
        />
      }
    />,
  );
  return { ...result, getApi: () => api };
}

const sampleSuccess = (id: string): DisplayItemEntry => ({
  id,
  thumbnailUrl: `https://picsum.photos/seed/${id}/100/100`,
  status: "success",
});

describe("useAttachmentDisplay", () => {
  describe("basic rendering", () => {
    it("renders trigger and items", () => {
      const { getByTestId, getAllByTestId } = setUp(
        <BasicDisplay defaultEntries={[sampleSuccess("a"), sampleSuccess("b")]} maxEntries={5} />,
      );

      expect(getByTestId("trigger")).toBeDefined();
      expect(getAllByTestId(/^item-/)).toHaveLength(2);
    });

    it("propagates entry data via item context", () => {
      const { getByTestId } = setUp(
        <BasicDisplay defaultEntries={[sampleSuccess("a")]} maxEntries={5} />,
      );

      expect(getByTestId("thumbnail-url-0").textContent).toBe(
        "https://picsum.photos/seed/a/100/100",
      );
    });
  });

  describe("trigger disabled state", () => {
    it("disables trigger when disabled prop is true", () => {
      const { getByTestId } = setUp(<BasicDisplay maxEntries={5} disabled />);
      const trigger = getByTestId("trigger") as HTMLButtonElement;

      expect(trigger.disabled).toBe(true);
      expect(trigger).toHaveAttribute("data-disabled");
    });

    it("disables trigger when maxEntries is reached", () => {
      const { getByTestId } = setUp(
        <BasicDisplay defaultEntries={[sampleSuccess("a"), sampleSuccess("b")]} maxEntries={2} />,
      );
      const trigger = getByTestId("trigger") as HTMLButtonElement;

      expect(trigger.disabled).toBe(true);
    });

    it("does not fire user onClick when disabled", async () => {
      const onClick = mock(() => {});
      const { getByTestId, user } = setUp(
        <AttachmentDisplayRoot maxEntries={1} disabled>
          <AttachmentDisplayTrigger data-testid="trigger" onClick={onClick}>
            Add
          </AttachmentDisplayTrigger>
        </AttachmentDisplayRoot>,
      );

      await user.click(getByTestId("trigger"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("fires user onClick when enabled", async () => {
      const onClick = mock(() => {});
      const { getByTestId, user } = setUp(
        <AttachmentDisplayRoot maxEntries={5}>
          <AttachmentDisplayTrigger data-testid="trigger" onClick={onClick}>
            Add
          </AttachmentDisplayTrigger>
        </AttachmentDisplayRoot>,
      );

      await user.click(getByTestId("trigger"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove via ItemRemoveButton", () => {
    it("removes entry on click (controlled)", async () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});

      function Controlled() {
        const [entries, setEntries] = React.useState<DisplayItemEntry[]>([
          sampleSuccess("a"),
          sampleSuccess("b"),
        ]);
        return (
          <BasicDisplay
            entries={entries}
            onEntriesChange={(next) => {
              onEntriesChange(next);
              setEntries(next);
            }}
            maxEntries={5}
          />
        );
      }

      const { getByTestId, queryAllByTestId, user } = setUp(<Controlled />);

      expect(queryAllByTestId(/^item-/)).toHaveLength(2);
      await user.click(getByTestId("remove-0"));

      expect(onEntriesChange).toHaveBeenCalledTimes(1);
      expect(onEntriesChange.mock.calls[0][0]).toEqual([sampleSuccess("b")]);
      expect(queryAllByTestId(/^item-/)).toHaveLength(1);
    });

    it("removes entry on click (uncontrolled)", async () => {
      const { queryAllByTestId, getByTestId, user } = setUp(
        <BasicDisplay
          defaultEntries={[sampleSuccess("a"), sampleSuccess("b"), sampleSuccess("c")]}
          maxEntries={5}
        />,
      );

      expect(queryAllByTestId(/^item-/)).toHaveLength(3);
      await user.click(getByTestId("remove-1"));
      expect(queryAllByTestId(/^item-/)).toHaveLength(2);
    });
  });

  describe("ItemBackdrop status filtering", () => {
    it("only renders backdrop matching entry's status", () => {
      const { queryByTestId } = setUp(
        <BasicDisplay
          defaultEntries={[
            { id: "u", thumbnailUrl: "/u", status: "uploading", progress: 50 },
            { id: "e", thumbnailUrl: "/e", status: "error" },
            { id: "s", thumbnailUrl: "/s", status: "success" },
          ]}
          maxEntries={5}
        />,
      );

      expect(queryByTestId("backdrop-uploading-0")).not.toBeNull();
      expect(queryByTestId("backdrop-error-0")).toBeNull();

      expect(queryByTestId("backdrop-uploading-1")).toBeNull();
      expect(queryByTestId("backdrop-error-1")).not.toBeNull();

      expect(queryByTestId("backdrop-uploading-2")).toBeNull();
      expect(queryByTestId("backdrop-error-2")).toBeNull();
    });

    it("exposes the entry via render-prop children", () => {
      const { getByTestId } = setUp(
        <BasicDisplay
          defaultEntries={[{ id: "u", thumbnailUrl: "/u", status: "uploading", progress: 42 }]}
          maxEntries={5}
        />,
      );

      expect(getByTestId("backdrop-uploading-0").textContent).toContain("42");
    });
  });

  describe("invalid prop", () => {
    it("sets data-invalid on root", () => {
      const { container } = setUp(<BasicDisplay maxEntries={5} invalid />);
      const root = container.firstChild as HTMLElement;

      expect(root).toHaveAttribute("data-invalid");
    });
  });

  describe("addEntries helper", () => {
    it("appends incoming entries when there is room", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().addEntries([sampleSuccess("b"), sampleSuccess("c")]));

      expect(onEntriesChange).toHaveBeenCalledTimes(1);
      expect(onEntriesChange.mock.calls[0][0]).toEqual([
        sampleSuccess("a"),
        sampleSuccess("b"),
        sampleSuccess("c"),
      ]);
    });

    it("silently caps incoming entries at maxEntries", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 3,
        onEntriesChange,
      });

      act(() => getApi().addEntries([sampleSuccess("c"), sampleSuccess("d"), sampleSuccess("e")]));

      expect(onEntriesChange.mock.calls[0][0]).toEqual([
        sampleSuccess("a"),
        sampleSuccess("b"),
        sampleSuccess("c"),
      ]);
    });

    it("replaces in single-mode (maxEntries=1)", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a")],
        maxEntries: 1,
        onEntriesChange,
      });

      act(() => getApi().addEntries([sampleSuccess("b"), sampleSuccess("c")]));

      expect(onEntriesChange.mock.calls[0][0]).toEqual([sampleSuccess("b")]);
    });

    it("is a no-op when incoming is empty", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({ maxEntries: 5, onEntriesChange });

      act(() => getApi().addEntries([]));

      expect(onEntriesChange).not.toHaveBeenCalled();
    });

    it("is a no-op when disabled or readOnly", () => {
      const onDisabledChange = mock((_next: DisplayItemEntry[]) => {});
      const disabled = setUpWithApi({
        maxEntries: 5,
        disabled: true,
        onEntriesChange: onDisabledChange,
      });
      act(() => disabled.getApi().addEntries([sampleSuccess("a")]));
      expect(onDisabledChange).not.toHaveBeenCalled();

      const onReadOnlyChange = mock((_next: DisplayItemEntry[]) => {});
      const readonly = setUpWithApi({
        maxEntries: 5,
        readOnly: true,
        onEntriesChange: onReadOnlyChange,
      });
      act(() => readonly.getApi().addEntries([sampleSuccess("a")]));
      expect(onReadOnlyChange).not.toHaveBeenCalled();
    });
  });

  describe("reorderEntry helper", () => {
    it("moves entry from fromIndex to toIndex", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b"), sampleSuccess("c")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().reorderEntry(0, 2));

      expect(onEntriesChange.mock.calls[0][0]).toEqual([
        sampleSuccess("b"),
        sampleSuccess("c"),
        sampleSuccess("a"),
      ]);
    });

    it("is a no-op when fromIndex/toIndex is out of bounds", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().reorderEntry(-1, 0));
      act(() => getApi().reorderEntry(0, 5));
      act(() => getApi().reorderEntry(5, 0));

      expect(onEntriesChange).not.toHaveBeenCalled();
    });

    it("is a no-op when fromIndex equals toIndex", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().reorderEntry(1, 1));

      expect(onEntriesChange).not.toHaveBeenCalled();
    });

    it("is a no-op when disabled or readOnly", () => {
      const onDisabledChange = mock((_next: DisplayItemEntry[]) => {});
      const disabled = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 5,
        disabled: true,
        onEntriesChange: onDisabledChange,
      });
      act(() => disabled.getApi().reorderEntry(0, 1));
      expect(onDisabledChange).not.toHaveBeenCalled();

      const onReadOnlyChange = mock((_next: DisplayItemEntry[]) => {});
      const readonly = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 5,
        readOnly: true,
        onEntriesChange: onReadOnlyChange,
      });
      act(() => readonly.getApi().reorderEntry(0, 1));
      expect(onReadOnlyChange).not.toHaveBeenCalled();
    });
  });

  describe("clearEntries helper", () => {
    it("removes all entries", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a"), sampleSuccess("b")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().clearEntries());

      expect(onEntriesChange.mock.calls[0][0]).toEqual([]);
    });

    it("is a no-op when readOnly (but works when disabled)", () => {
      const onReadOnlyChange = mock((_next: DisplayItemEntry[]) => {});
      const readonly = setUpWithApi({
        defaultEntries: [sampleSuccess("a")],
        maxEntries: 5,
        readOnly: true,
        onEntriesChange: onReadOnlyChange,
      });
      act(() => readonly.getApi().clearEntries());
      expect(onReadOnlyChange).not.toHaveBeenCalled();

      const onDisabledChange = mock((_next: DisplayItemEntry[]) => {});
      const disabled = setUpWithApi({
        defaultEntries: [sampleSuccess("a")],
        maxEntries: 5,
        disabled: true,
        onEntriesChange: onDisabledChange,
      });
      act(() => disabled.getApi().clearEntries());
      expect(onDisabledChange.mock.calls[0][0]).toEqual([]);
    });
  });

  describe("updateEntryStatus helper", () => {
    it("merges status details into the matching entry", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [
          { id: "a", thumbnailUrl: "/a", status: "uploading", progress: 10 },
          { id: "b", thumbnailUrl: "/b", status: "uploading", progress: 50 },
        ],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().updateEntryStatus("a", { status: "success" }));

      expect(onEntriesChange.mock.calls[0][0]).toEqual([
        { id: "a", thumbnailUrl: "/a", status: "success" },
        { id: "b", thumbnailUrl: "/b", status: "uploading", progress: 50 },
      ]);
    });

    it("is a no-op when id does not match", () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});
      const { getApi } = setUpWithApi({
        defaultEntries: [sampleSuccess("a")],
        maxEntries: 5,
        onEntriesChange,
      });

      act(() => getApi().updateEntryStatus("nonexistent", { status: "error" }));

      // map returns the same entries; useControllableState may or may not fire onChange for identity-equal results,
      // but the post-state must equal the pre-state.
      const lastCall = onEntriesChange.mock.calls.at(-1);
      if (lastCall) expect(lastCall[0]).toEqual([sampleSuccess("a")]);
    });

    it("works regardless of disabled/readOnly (external push category)", () => {
      const onReadOnlyChange = mock((_next: DisplayItemEntry[]) => {});
      const readonly = setUpWithApi({
        defaultEntries: [{ id: "a", thumbnailUrl: "/a", status: "uploading", progress: 10 }],
        maxEntries: 5,
        readOnly: true,
        onEntriesChange: onReadOnlyChange,
      });
      act(() => readonly.getApi().updateEntryStatus("a", { status: "success" }));
      expect(onReadOnlyChange.mock.calls[0][0]).toEqual([
        { id: "a", thumbnailUrl: "/a", status: "success" },
      ]);
    });
  });

  describe("readOnly prop", () => {
    it("sets data-readonly on root", () => {
      const { container } = setUp(<BasicDisplay maxEntries={5} readOnly />);
      const root = container.firstChild as HTMLElement;

      expect(root).toHaveAttribute("data-readonly");
    });

    it("disables trigger when readOnly", () => {
      const { getByTestId } = setUp(<BasicDisplay maxEntries={5} readOnly />);
      const trigger = getByTestId("trigger") as HTMLButtonElement;

      expect(trigger.disabled).toBe(true);
      expect(trigger).toHaveAttribute("data-disabled");
    });

    it("does not fire user trigger onClick when readOnly", async () => {
      const onClick = mock(() => {});
      const { getByTestId, user } = setUp(
        <AttachmentDisplayRoot maxEntries={5} readOnly>
          <AttachmentDisplayTrigger data-testid="trigger" onClick={onClick}>
            Add
          </AttachmentDisplayTrigger>
        </AttachmentDisplayRoot>,
      );

      await user.click(getByTestId("trigger"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("disables remove button when readOnly", () => {
      const { getByTestId } = setUp(
        <BasicDisplay defaultEntries={[sampleSuccess("a")]} maxEntries={5} readOnly />,
      );
      const removeButton = getByTestId("remove-0") as HTMLButtonElement;

      expect(removeButton.disabled).toBe(true);
    });

    it("does not remove entry on remove button click when readOnly", async () => {
      const onEntriesChange = mock((_next: DisplayItemEntry[]) => {});

      function Controlled() {
        const [entries, setEntries] = React.useState<DisplayItemEntry[]>([
          sampleSuccess("a"),
          sampleSuccess("b"),
        ]);
        return (
          <BasicDisplay
            entries={entries}
            onEntriesChange={(next) => {
              onEntriesChange(next);
              setEntries(next);
            }}
            maxEntries={5}
            readOnly
          />
        );
      }

      const { getByTestId, queryAllByTestId, user } = setUp(<Controlled />);

      expect(queryAllByTestId(/^item-/)).toHaveLength(2);
      await user.click(getByTestId("remove-0"));

      expect(onEntriesChange).not.toHaveBeenCalled();
      expect(queryAllByTestId(/^item-/)).toHaveLength(2);
    });
  });

  describe("aria-describedby + aria-invalid wiring", () => {
    it("trigger has no aria-describedby when neither Description nor ErrorMessage is rendered", () => {
      const { getByTestId } = setUp(<BasicDisplay maxEntries={5} />);
      const trigger = getByTestId("trigger");

      expect(trigger.getAttribute("aria-describedby")).toBeNull();
    });

    it("trigger aria-describedby includes the Description id when Description is rendered", () => {
      const { getByTestId } = setUp(
        <BasicDisplay
          maxEntries={5}
          extraChildren={
            <AttachmentDisplayDescription data-testid="description">
              help
            </AttachmentDisplayDescription>
          }
        />,
      );

      const trigger = getByTestId("trigger");
      const description = getByTestId("description");
      const describedBy = trigger.getAttribute("aria-describedby");

      expect(description.id).toBeTruthy();
      expect(describedBy).not.toBeNull();
      expect(describedBy?.split(" ")).toContain(description.id);
    });

    it("trigger aria-describedby includes the ErrorMessage id when ErrorMessage is rendered", () => {
      const { getByTestId } = setUp(
        <BasicDisplay
          maxEntries={5}
          extraChildren={
            <AttachmentDisplayErrorMessage data-testid="error">bad</AttachmentDisplayErrorMessage>
          }
        />,
      );

      const trigger = getByTestId("trigger");
      const error = getByTestId("error");
      const describedBy = trigger.getAttribute("aria-describedby");

      expect(error.id).toBeTruthy();
      expect(describedBy).not.toBeNull();
      expect(describedBy?.split(" ")).toContain(error.id);
    });

    it("trigger aria-describedby joins both ids when Description and ErrorMessage are rendered", () => {
      const { getByTestId } = setUp(
        <BasicDisplay
          maxEntries={5}
          extraChildren={
            <>
              <AttachmentDisplayDescription data-testid="description">
                help
              </AttachmentDisplayDescription>
              <AttachmentDisplayErrorMessage data-testid="error">bad</AttachmentDisplayErrorMessage>
            </>
          }
        />,
      );

      const trigger = getByTestId("trigger");
      const description = getByTestId("description");
      const error = getByTestId("error");
      const describedBy = trigger.getAttribute("aria-describedby");

      expect(description.id).not.toBe(error.id);
      const parts = describedBy?.split(" ") ?? [];
      expect(parts).toContain(description.id);
      expect(parts).toContain(error.id);
    });

    it("ErrorMessage carries aria-live=polite for assertive announcements", () => {
      const { getByTestId } = setUp(
        <BasicDisplay
          maxEntries={5}
          extraChildren={
            <AttachmentDisplayErrorMessage data-testid="error">bad</AttachmentDisplayErrorMessage>
          }
        />,
      );

      expect(getByTestId("error").getAttribute("aria-live")).toBe("polite");
    });

    it("trigger has aria-invalid=true when invalid prop is set", () => {
      const { getByTestId } = setUp(<BasicDisplay maxEntries={5} invalid />);
      const trigger = getByTestId("trigger");

      expect(trigger.getAttribute("aria-invalid")).toBe("true");
    });

    it("trigger does not carry aria-invalid when invalid is false", () => {
      const { getByTestId } = setUp(<BasicDisplay maxEntries={5} />);
      const trigger = getByTestId("trigger");

      expect(trigger.getAttribute("aria-invalid")).toBeNull();
    });
  });
});

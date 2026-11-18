import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { act, fireEvent, render, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  AttachmentDisplay,
  AttachmentDisplayItemProvider,
  useAttachmentDisplay,
  useAttachmentDisplayContext,
  useAttachmentDisplayItem,
  type DisplayItemEntry,
  type UseAttachmentDisplayContext,
  type UseAttachmentDisplayProps,
} from "./index.js";

function element(selector: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function entry(id: string, extra: Partial<DisplayItemEntry> = {}): DisplayItemEntry {
  return { id, thumbnailUrl: `https://fixture/${id}.png`, status: "success", ...extra };
}

function ids(entries: DisplayItemEntry[]) {
  return entries.map((current) => current.id);
}

function Item({ value }: { value: DisplayItemEntry }) {
  const item = useAttachmentDisplayItem(value);
  return (
    <AttachmentDisplayItemProvider value={item}>
      <view className={`item item-${value.id}`}>
        <AttachmentDisplay.ItemImage className={`image-${value.id}`} />
        <AttachmentDisplay.ItemBackdrop className={`progress-${value.id}`} status="uploading">
          {(current) => <text>{current.status === "uploading" ? current.progress : ""}</text>}
        </AttachmentDisplay.ItemBackdrop>
        <AttachmentDisplay.ItemRemoveButton className={`remove-${value.id}`} />
      </view>
    </AttachmentDisplayItemProvider>
  );
}

function Display(
  props: UseAttachmentDisplayProps & {
    onTrigger?: (api: UseAttachmentDisplayContext) => void;
    onApi?: (api: UseAttachmentDisplayContext) => void;
  },
) {
  const { onTrigger, onApi, ...rootProps } = props;
  return (
    <AttachmentDisplay.Root className="root" {...rootProps}>
      <AttachmentDisplay.Context>
        {(api) => {
          onApi?.(api);
          return (
            <>
              <AttachmentDisplay.Trigger
                className="trigger"
                accessibility-label="사진 추가"
                bindtap={() => onTrigger?.(api)}
              />
              {api.entries.map((current) => (
                <Item key={current.id} value={current} />
              ))}
            </>
          );
        }}
      </AttachmentDisplay.Context>
    </AttachmentDisplay.Root>
  );
}

function renderedIds() {
  return Array.from(elementTree.root?.querySelectorAll(".item") ?? []).map((node) =>
    node.className.replace(/.*item-/, ""),
  );
}

describe("AttachmentDisplay trigger", () => {
  it("calls the trigger callback once per tap and caps added entries at maxEntries", () => {
    const onTrigger = vi.fn((api: UseAttachmentDisplayContext) =>
      api.addEntries([entry("b"), entry("c"), entry("d")]),
    );
    render(<Display defaultEntries={[entry("a")]} maxEntries={3} onTrigger={onTrigger} />);

    fireEvent.tap(element(".trigger"));

    expect(onTrigger).toHaveBeenCalledOnce();
    expect(renderedIds()).toEqual(["a", "b", "c"]);
    expect(element(".trigger")).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(element(".trigger"));
    expect(onTrigger).toHaveBeenCalledOnce();
  });

  it("replaces the list with the first entry when maxEntries is 1", () => {
    let api!: UseAttachmentDisplayContext;
    render(<Display defaultEntries={[entry("a")]} onApi={(current) => (api = current)} />);

    act(() => api.addEntries([entry("b"), entry("c")]));

    expect(renderedIds()).toEqual(["b"]);
  });

  it("does not clamp maxEntries to 1, so 0 keeps the trigger disabled", () => {
    const onTrigger = vi.fn();
    render(<Display maxEntries={0} onTrigger={onTrigger} />);

    fireEvent.tap(element(".trigger"));

    expect(onTrigger).not.toHaveBeenCalled();
    expect(element(".trigger")).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("blocks the trigger when disabled or readOnly", () => {
    const onTrigger = vi.fn();
    const { rerender } = render(<Display maxEntries={5} disabled onTrigger={onTrigger} />);
    fireEvent.tap(element(".trigger"));
    rerender(<Display maxEntries={5} readOnly onTrigger={onTrigger} />);
    fireEvent.tap(element(".trigger"));

    expect(onTrigger).not.toHaveBeenCalled();
  });
});

describe("AttachmentDisplay actions", () => {
  function setup(props: UseAttachmentDisplayProps) {
    const onEntriesChange = vi.fn();
    const hook = renderHook(
      (current: UseAttachmentDisplayProps) => useAttachmentDisplay({ onEntriesChange, ...current }),
      { initialProps: props },
    );
    return { onEntriesChange, hook };
  }

  it("does not report a change when nothing changes", () => {
    const { onEntriesChange, hook } = setup({
      defaultEntries: [entry("a"), entry("b")],
      maxEntries: 2,
    });

    act(() => hook.result.current.addEntries([entry("c")]));
    act(() => hook.result.current.addEntries([]));
    act(() => hook.result.current.reorderEntry(1, 1));
    act(() => hook.result.current.reorderEntry(0, 2));

    expect(onEntriesChange).not.toHaveBeenCalled();
    expect(ids(hook.result.current.entries)).toEqual(["a", "b"]);
  });

  it("lets disabled remove, clear and update status but not add or reorder", () => {
    const { hook } = setup({
      defaultEntries: [entry("a"), entry("b"), entry("c")],
      maxEntries: 5,
      disabled: true,
    });

    act(() => hook.result.current.addEntries([entry("d")]));
    act(() => hook.result.current.reorderEntry(0, 2));
    expect(ids(hook.result.current.entries)).toEqual(["a", "b", "c"]);

    act(() => hook.result.current.updateEntryStatus("a", { status: "error" }));
    act(() => hook.result.current.removeEntry("b"));
    expect(hook.result.current.entries.map((e) => [e.id, e.status])).toEqual([
      ["a", "error"],
      ["c", "success"],
    ]);

    act(() => hook.result.current.clearEntries());
    expect(hook.result.current.entries).toEqual([]);
  });

  it("lets readOnly only update status", () => {
    const { hook } = setup({
      defaultEntries: [entry("a"), entry("b")],
      maxEntries: 5,
      readOnly: true,
    });

    act(() => hook.result.current.addEntries([entry("c")]));
    act(() => hook.result.current.removeEntry("a"));
    act(() => hook.result.current.clearEntries());
    act(() => hook.result.current.reorderEntry(0, 1));
    act(() => hook.result.current.updateEntryStatus("b", { status: "uploading", progress: 30 }));

    expect(hook.result.current.entries.map((e) => [e.id, e.status])).toEqual([
      ["a", "success"],
      ["b", "uploading"],
    ]);
  });

  it("replaces status details while keeping remote metadata", () => {
    const { hook } = setup({
      defaultEntries: [
        entry("a", {
          name: "a.png",
          type: "image/png",
          size: 12,
          status: "uploading",
          progress: 80,
        }),
      ],
    });

    act(() => hook.result.current.updateEntryStatus("a", { status: "success" }));

    expect(hook.result.current.entries[0]).toEqual({
      id: "a",
      thumbnailUrl: "https://fixture/a.png",
      name: "a.png",
      type: "image/png",
      size: 12,
      status: "success",
    });
  });

  it("applies consecutive async helper calls to the latest list", () => {
    const { hook } = setup({ maxEntries: 5 });
    const { addEntries, updateEntryStatus } = hook.result.current;

    act(() => {
      addEntries([entry("a", { status: "uploading", progress: 0 })]);
      addEntries([entry("b")]);
      updateEntryStatus("a", { status: "uploading", progress: 50 });
    });

    expect(hook.result.current.entries.map((e) => [e.id, e.status])).toEqual([
      ["a", "uploading"],
      ["b", "success"],
    ]);
  });
});

describe("AttachmentDisplay controlled entries", () => {
  it("renders the parent value and follows external resets", () => {
    let setParent!: (entries: DisplayItemEntry[]) => void;
    const onEntriesChange = vi.fn();
    function Parent() {
      const [entries, setEntries] = useState<DisplayItemEntry[]>([entry("a")]);
      setParent = setEntries;
      return (
        <Display
          entries={entries}
          maxEntries={5}
          onEntriesChange={(next) => {
            onEntriesChange(ids(next));
            setEntries(next);
          }}
          onTrigger={(api) => api.addEntries([entry("b")])}
        />
      );
    }
    render(<Parent />);

    fireEvent.tap(element(".trigger"));
    expect(renderedIds()).toEqual(["a", "b"]);

    act(() => setParent([entry("x")]));
    expect(renderedIds()).toEqual(["x"]);

    fireEvent.tap(element(".remove-x"));
    expect(onEntriesChange.mock.calls).toEqual([[["a", "b"]], [[]]]);
    expect(renderedIds()).toEqual([]);
  });

  it("keeps the parent value when the parent ignores a change", () => {
    const onEntriesChange = vi.fn();
    render(
      <Display
        entries={[entry("a")]}
        maxEntries={5}
        onEntriesChange={onEntriesChange}
        onTrigger={(api) => api.addEntries([entry("b")])}
      />,
    );

    fireEvent.tap(element(".trigger"));

    expect(onEntriesChange).toHaveBeenCalledOnce();
    expect(renderedIds()).toEqual(["a"]);
  });
});

describe("AttachmentDisplay item parts", () => {
  it("removes after the consumer tap handler and blocks removal in readOnly", () => {
    const calls: string[] = [];
    function RemoveItem({ value }: { value: DisplayItemEntry }) {
      const item = useAttachmentDisplayItem(value);
      const { entries } = useAttachmentDisplayContext();
      return (
        <AttachmentDisplayItemProvider value={item}>
          <AttachmentDisplay.ItemRemoveButton
            className={`remove-${value.id}`}
            bindtap={() => calls.push(`tap:${ids(entries).join(",")}`)}
          />
        </AttachmentDisplayItemProvider>
      );
    }
    function Root({ readOnly }: { readOnly?: boolean }) {
      return (
        <AttachmentDisplay.Root
          defaultEntries={[entry("a"), entry("b")]}
          maxEntries={5}
          readOnly={readOnly}
          onEntriesChange={(next) => calls.push(`change:${ids(next).join(",")}`)}
        >
          <AttachmentDisplay.Context>
            {({ entries }) =>
              entries.map((current) => <RemoveItem key={current.id} value={current} />)
            }
          </AttachmentDisplay.Context>
        </AttachmentDisplay.Root>
      );
    }
    const { unmount } = render(<Root readOnly />);
    fireEvent.tap(element(".remove-a"));
    expect(calls).toEqual([]);
    expect(element(".remove-a")).toHaveAttribute("accessibility-traits", "disabled");
    unmount();

    render(<Root />);
    fireEvent.tap(element(".remove-a"));
    expect(calls).toEqual(["tap:a,b", "change:b"]);
  });

  it("renders the thumbnail with the entry name and status-matched backdrop only", () => {
    render(
      <Display
        defaultEntries={[
          entry("a", { name: "photo.png", status: "uploading", progress: 40 }),
          { id: "b", status: "pending" },
        ]}
        maxEntries={5}
      />,
    );

    expect(element(".image-a")).toHaveAttribute("src", "https://fixture/a.png");
    expect(element(".image-a")).toHaveAttribute("accessibility-label", "photo.png");
    expect(element(".progress-a")).toHaveTextContent("40");
    expect(elementTree.root?.querySelector(".image-b")).toBeNull();
    expect(elementTree.root?.querySelector(".progress-b")).toBeNull();
  });
});

describe("AttachmentDisplay context", () => {
  it("returns null outside the Root only when strict is false", () => {
    const loose = renderHook(() => useAttachmentDisplayContext({ strict: false }));
    expect(loose.result.current).toBeNull();
    expect(() => renderHook(() => useAttachmentDisplayContext())).toThrow(
      "useAttachmentDisplayContext must be used within an AttachmentDisplayRoot",
    );
  });
});

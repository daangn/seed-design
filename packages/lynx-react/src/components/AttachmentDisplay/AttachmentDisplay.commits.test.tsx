import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { AttachmentDisplay, type AttachmentDisplayEntry } from "./index";

const ENTRIES = {
  2: createEntries(2),
  6: createEntries(6),
};

function createEntries(count: number): AttachmentDisplayEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `entry-${index}`,
    thumbnailUrl: `photo-${index}.png`,
    status: "success",
  }));
}

function Example({ count }: { count: keyof typeof ENTRIES }) {
  return (
    <AttachmentDisplay.Root defaultEntries={ENTRIES[count]} maxEntries={10}>
      <AttachmentDisplay.Control>
        <AttachmentDisplay.Container>
          <AttachmentDisplay.Trigger accessibility-label="사진 추가">
            <AttachmentDisplay.TriggerItemCount />
          </AttachmentDisplay.Trigger>
          <AttachmentDisplay.ItemGroup>
            <AttachmentDisplay.Context>
              {({ entries }) =>
                entries.map((entry) => (
                  <AttachmentDisplay.Item key={entry.id} entry={entry}>
                    <AttachmentDisplay.ItemSurface>
                      <AttachmentDisplay.ItemImage />
                    </AttachmentDisplay.ItemSurface>
                    <AttachmentDisplay.ItemRemoveButton accessibility-label="삭제" />
                  </AttachmentDisplay.Item>
                ))
              }
            </AttachmentDisplay.Context>
          </AttachmentDisplay.ItemGroup>
        </AttachmentDisplay.Container>
      </AttachmentDisplay.Control>
    </AttachmentDisplay.Root>
  );
}

async function mount(count: keyof typeof ENTRIES) {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example count={count} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
  });
  return { view, commits };
}

describe("AttachmentDisplay commits", () => {
  it.each([
    2, 6,
  ] as const)("does not commit after hydration when %i entries mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it.each([2, 6] as const)("commits removing one of %i entries", async (count) => {
    const { view } = await mount(count);
    const remove = view.container.querySelector("[accessibility-label='삭제']");
    if (!remove) throw new Error("Missing remove button");
    const commits = await measureCommits(() => fireEvent.tap(remove));
    expect(view.container.querySelectorAll("image")).toHaveLength(count - 1);
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 2 } : { total: 3, nonEmpty: 2 },
    );
  });
});

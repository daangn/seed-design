import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import type { FileEntry } from "@seed-design/lynx-react-file-upload";

import { AttachmentInput } from "./AttachmentInput";

const ENTRIES = {
  2: createEntries(2),
  6: createEntries(6),
};

function createEntries(count: number): FileEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `entry-${index}`,
    status: "success",
    file: {
      uri: `file://photo-${index}.png`,
      name: `photo-${index}.png`,
      type: "image/png",
      size: 10,
    },
  }));
}

function Example({ count }: { count: keyof typeof ENTRIES }) {
  return (
    <AttachmentInput.Root
      defaultAcceptedFileEntries={ENTRIES[count]}
      accept="image/*"
      maxFiles={10}
    >
      <AttachmentInput.Container>
        <AttachmentInput.Trigger accessibility-label="사진 추가">
          <AttachmentInput.TriggerItemCount />
        </AttachmentInput.Trigger>
        <AttachmentInput.ItemGroup>
          <AttachmentInput.Context>
            {({ acceptedFileEntries }) =>
              acceptedFileEntries.map((fileEntry) => (
                <AttachmentInput.Item key={fileEntry.id} fileEntry={fileEntry}>
                  <AttachmentInput.ItemSurface>
                    <AttachmentInput.ItemImage />
                  </AttachmentInput.ItemSurface>
                  <AttachmentInput.ItemRemoveButton accessibility-label="삭제" />
                </AttachmentInput.Item>
              ))
            }
          </AttachmentInput.Context>
        </AttachmentInput.ItemGroup>
      </AttachmentInput.Container>
    </AttachmentInput.Root>
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

describe("AttachmentInput commits", () => {
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
    expect(view.container.querySelectorAll("[accessibility-label='삭제']")).toHaveLength(count - 1);
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 2 } : { total: 3, nonEmpty: 2 },
    );
  });
});

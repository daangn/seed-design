import type { ChangelogContentBlock } from "@/lib/parse-changelog";

type EntryWithContentBlocks = {
  contentBlocks: ChangelogContentBlock[];
};

export function getEntryPreviewHtml(entry: EntryWithContentBlocks): string {
  const block = entry.contentBlocks.find(
    (contentBlock): contentBlock is Extract<ChangelogContentBlock, { type: "markdown" }> =>
      contentBlock.type === "markdown",
  );

  return block?.html ?? "";
}

export function getEntrySearchText(entry: EntryWithContentBlocks): string {
  return entry.contentBlocks
    .map((block) => (block.type === "markdown" ? block.plainText : block.code))
    .join(" ")
    .trim();
}

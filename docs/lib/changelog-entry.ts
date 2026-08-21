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

/**
 * A search row is rendered as Markdown, and an entry reaches one as plain text carrying its own
 * code samples — so their JSX would be read as HTML, an unknown tag swallowing the rest of the
 * row into itself. Escaping the brackets doesn't hold, because the highlighter re-emits a line
 * it matched in raw, character references already decoded. Dropping them does.
 */
const dropAngleBrackets = (text: string) => text.replaceAll(/[<>]/g, "");

export function getEntrySearchText(entry: EntryWithContentBlocks): string {
  return dropAngleBrackets(
    entry.contentBlocks
      .map((block) => (block.type === "markdown" ? block.plainText : block.code))
      .join(" ")
      .trim(),
  );
}

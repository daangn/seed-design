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
 * A search row is rendered as Markdown with its HTML parsed, and an entry reaches one as plain
 * text carrying its own code samples — so their JSX would be read as HTML, an unknown tag
 * swallowing the rest of the row into itself. Escaping once doesn't hold: Fumadocs'
 * `highlightMarkdown` parses the row and re-emits every text node as raw HTML, character
 * references already decoded. Escaping twice leaves one layer for the row to decode into text.
 */
const escapeForSearchRow = (text: string) =>
  text.replaceAll("&", "&amp;amp;").replaceAll("<", "&amp;lt;").replaceAll(">", "&amp;gt;");

export function getEntrySearchText(entry: EntryWithContentBlocks): string {
  return escapeForSearchRow(
    entry.contentBlocks
      .map((block) => (block.type === "markdown" ? block.plainText : block.code))
      .join(" ")
      .trim(),
  );
}

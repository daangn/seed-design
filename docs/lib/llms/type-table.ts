import type { DocEntry, GeneratedDoc } from "fumadocs-typescript";

/**
 * A type is written by a human, so it can hold backticks of its own — `` `${string}px` ``
 * being the common one. The fence has to outrun the longest of them.
 */
function inlineCode(value: string): string {
  const longest = Math.max(0, ...[...value.matchAll(/`+/g)].map(([run]) => run.length));
  const pad = /^[`\s]|[`\s]$/.test(value) ? " " : "";
  const fence = "`".repeat(longest + 1);

  return `${fence}${pad}${value}${pad}${fence}`;
}

function fieldsOf(entry: DocEntry): string[] {
  const fields = [`type: ${inlineCode(entry.type)}`];

  const defaultValue = entry.tags?.find(
    (tag) => tag.name === "default" || tag.name === "defaultValue",
  )?.text;
  if (defaultValue) fields.push(`default: ${inlineCode(defaultValue)}`);

  if (entry.required) fields.push(`required: ${inlineCode("true")}`);
  if (entry.deprecated) fields.push(`deprecated: ${inlineCode("true")}`);

  // A description is prose and can span lines. Left as is, everything after the first
  // break would escape the item — a line opening with `-` would even start a new one.
  const description = entry.description?.replace(/\s+/g, " ").trim();
  if (description) fields.push(`description: ${description}`);

  return fields;
}

/**
 * The props table as a markdown list: each entry names the prop, with its type, default,
 * flags and description nested underneath.
 *
 * `undefined` for a doc with no entries, which has no table to show. The caller decides
 * what to leave in its place — dropping the node would take the section with it.
 *
 * Not an `LLMHandler`: the `<TypeTable>` a page carries holds Shiki-highlighted JSX in
 * its `type` attribute rather than the doc, so there is nothing for a handler to read.
 * `remarkTypeTableLlms` re-derives the doc from the props it captured and calls this.
 */
export function renderTypeTableMarkdown(doc: GeneratedDoc): string | undefined {
  if (doc.entries.length === 0) return undefined;

  return doc.entries
    .map((entry) =>
      [`- ${inlineCode(entry.name)}`, ...fieldsOf(entry).map((field) => `  - ${field}`)].join("\n"),
    )
    .join("\n");
}

import type { DocEntry, GeneratedDoc } from "fumadocs-typescript";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import type { JsxNode, LLMHandler } from "../types";

/**
 * Read here rather than through `ctx.attr`: `remarkAutoTypeTable` writes the payload as
 * an expression attribute, and `ctx.attr` covers string literals only.
 */
function readTypeJson(node: JsxNode): string | undefined {
  const attribute = node.attributes.find(
    (candidate): candidate is MdxJsxAttribute =>
      candidate.type === "mdxJsxAttribute" && candidate.name === "type",
  );
  if (!attribute?.value) return undefined;

  return typeof attribute.value === "string" ? attribute.value : attribute.value.value;
}

/**
 * The payload is JSON carried in an attribute, so it is only as well-formed as whatever
 * wrote it — the shape has to be checked rather than declared.
 */
function parseDoc(node: JsxNode): GeneratedDoc | undefined {
  const raw = readTypeJson(node);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as GeneratedDoc;
    return Array.isArray(parsed?.entries) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

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
 * `<TypeTable>` carries a whole props table as JSON in its `type` attribute, which llms.txt
 * would otherwise print verbatim. Each entry becomes a list item naming the prop, with its
 * type, default, flags and description nested underneath.
 */
export const typeTableHandler: LLMHandler = {
  names: ["TypeTable"],
  render: (node) => {
    const doc = parseDoc(node);
    if (!doc || doc.entries.length === 0) return undefined;

    return doc.entries
      .map((entry) =>
        [`- ${inlineCode(entry.name)}`, ...fieldsOf(entry).map((field) => `  - ${field}`)].join(
          "\n",
        ),
      )
      .join("\n");
  },
};

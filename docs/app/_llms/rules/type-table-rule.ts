import type { DocEntry, GeneratedDoc } from "fumadocs-typescript";
import type { List, ListItem, Paragraph, PhrasingContent, RootContent } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule } from "./types";

function parseTypeTableJson(node: MdxJsxFlowElement): GeneratedDoc | undefined {
  const typeAttr = node.attributes.find(
    (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "type",
  );
  if (!typeAttr) return undefined;

  const raw = typeof typeAttr.value === "string" ? typeAttr.value : typeAttr.value?.value;
  if (!raw) return undefined;

  try {
    return JSON.parse(raw) as GeneratedDoc;
  } catch {
    return undefined;
  }
}

function getDefaultValue(entry: DocEntry): string | undefined {
  return entry.tags.find((t) => t.name === "default" || t.name === "defaultValue")?.text;
}

function createFieldItem(label: string, value: string, asCode: boolean): ListItem {
  const children: PhrasingContent[] = [{ type: "text", value: `${label}: ` }];
  children.push(asCode ? { type: "inlineCode", value } : { type: "text", value });

  return {
    type: "listItem",
    spread: false,
    children: [{ type: "paragraph", children } as Paragraph],
  };
}

function entryToListItem(entry: DocEntry): ListItem {
  const nameParagraph: Paragraph = {
    type: "paragraph",
    children: [{ type: "inlineCode", value: entry.name }],
  };

  const details: ListItem[] = [];
  details.push(createFieldItem("type", entry.type, true));

  const defaultValue = getDefaultValue(entry);
  if (defaultValue) details.push(createFieldItem("default", defaultValue, true));

  if (entry.required) details.push(createFieldItem("required", "true", true));
  if (entry.deprecated) details.push(createFieldItem("deprecated", "true", true));

  if (entry.description) {
    const normalized = entry.description.replace(/\s+/g, " ").trim();
    if (normalized) details.push(createFieldItem("description", normalized, false));
  }

  const children: ListItem["children"] = [nameParagraph];
  if (details.length > 0) {
    children.push({
      type: "list",
      ordered: false,
      spread: false,
      children: details,
    } as List);
  }

  return { type: "listItem", spread: false, children };
}

export function docToMdastList(doc: GeneratedDoc): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: doc.entries.map(entryToListItem),
  };
}

export const typeTableRule: Rule = {
  name: "TypeTable",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "TypeTable",
  transform: (node) => {
    try {
      const doc = parseTypeTableJson(node);
      if (!doc || doc.entries.length === 0) return [node];

      return [docToMdastList(doc) as RootContent];
    } catch {
      return [node];
    }
  },
};

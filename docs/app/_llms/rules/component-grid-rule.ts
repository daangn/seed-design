import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { baseUrl } from "@/app/metadata";
import { getLLMMarkdownUrl } from "../config";
import { catalogGridManifest } from "./component-grid-manifest";
import type { Rule } from "./types";

export interface ComponentEntry {
  title: string;
  description: string;
  url: string;
}

const DEFAULT_PREFIX = "/components/";

/** "/foundations/" → ["foundation"], "/components/" → ["components"] */
function segmentsFromPrefix(pathPrefix: string): string[] {
  return pathPrefix
    .replace(/(^\/)|(\/$)/g, "")
    .split("/")
    .filter((segment) => segment && segment !== "docs");
}

function getEntries(pathPrefix: string): ComponentEntry[] {
  const segments = segmentsFromPrefix(pathPrefix);
  const manifestPath = `/${segments.join("/")}/`;
  const entries = catalogGridManifest[manifestPath];
  if (!entries) return [];

  return entries.map((entry) => ({
    title: entry.title,
    description: entry.description,
    url: new URL(getLLMMarkdownUrl("docs", [...segments, entry.slug]), baseUrl).toString(),
  }));
}

function readPathPrefix(node: MdxJsxFlowElement): string {
  for (const attr of node.attributes) {
    if (
      attr.type === "mdxJsxAttribute" &&
      attr.name === "pathPrefix" &&
      typeof attr.value === "string"
    ) {
      return attr.value;
    }
  }
  return DEFAULT_PREFIX;
}

export function buildMarkdown(entries: ComponentEntry[]): string {
  return [...entries]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((entry) => {
      const suffix = entry.description ? ` — ${entry.description}` : "";
      return `- [${entry.title}](${entry.url})${suffix}`;
    })
    .join("\n");
}

export const componentGridRule: Rule<MdxJsxFlowElement> = {
  name: "CatalogGrid",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "CatalogGrid",
  transform: (node) => {
    try {
      const entries = getEntries(readPathPrefix(node));
      if (entries.length === 0) return [node];
      return [{ type: "html", value: buildMarkdown(entries) }];
    } catch (error) {
      console.warn("[CatalogGrid] transform failed; falling back to original MDX node:", error);
      return [node];
    }
  },
};

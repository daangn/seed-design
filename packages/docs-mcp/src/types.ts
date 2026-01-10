import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Tool interface for MCP tools
export interface Tool<T = unknown> {
  name: string;
  description: string;
  ctx?(): Promise<T> | void;
  exec(
    server: McpServer,
    opts: { ctx: T; name: string; description: string },
  ): Promise<void> | void;
}

// Component and documentation types
export interface ComponentInfo {
  name: string;
  title: string;
  description?: string;
}

export interface FoundationInfo {
  name: string;
  title: string;
  category?: string;
}

export interface ChangelogEntry {
  version: string;
  date?: string;
  changes: string[];
}

export interface SearchResult {
  content: string;
  context: string;
  score?: number;
}

export type PackageType = "react" | "breeze" | "docs";

export interface DocInfo {
  title: string;
  path: string;
  url: string;
  category?: string;
}

// Icon types
export interface IconEntry {
  name: string;
  metadatas: string[];
  variant?: "line" | "fill";
  service?: string;
}

export interface IconIndex {
  version: string;
  generatedAt: string;
  monochrome: IconEntry[];
  multicolor: IconEntry[];
}

export interface IconSearchResult {
  name: string;
  type: "monochrome" | "multicolor";
  variant?: "line" | "fill";
  service?: string;
  matchedKeywords: string[];
  allKeywords: string[];
}

export interface IconDetails {
  name: string;
  type: "monochrome" | "multicolor";
  keywords: string[];
  variant?: "line" | "fill";
  service?: string;
  docsUrl: string;
  usage: {
    package: string;
    import: string;
    component: string;
  };
}

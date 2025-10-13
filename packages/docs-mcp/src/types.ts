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

// Package types
export type PackageType = "react" | "breeze" | "docs";

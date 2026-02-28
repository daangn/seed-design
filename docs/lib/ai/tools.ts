import { tool } from "ai";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { findRelatedLinks as searchRelatedLinks } from "./sitemap-links";

const SITEMAP_URL = "https://seed-design.io/sitemap.xml";

async function findExamplesDir(): Promise<string | null> {
  const cwd = process.cwd();
  const candidates = [path.join(cwd, "examples"), path.join(cwd, "docs", "examples")];

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) return candidate;
    } catch {
      // ignore and try next candidate
    }
  }

  return null;
}

async function loadExampleCode(name: string): Promise<string | null> {
  const examplesDir = await findExamplesDir();
  if (!examplesDir) return null;

  const relativePath = path.normalize(`${name}.tsx`);
  if (relativePath.startsWith("..")) return null;

  const rootPath = path.resolve(examplesDir);
  const targetPath = path.resolve(examplesDir, relativePath);
  if (!targetPath.startsWith(`${rootPath}${path.sep}`)) return null;

  try {
    return await fs.readFile(targetPath, "utf8");
  } catch {
    return null;
  }
}

/**
 * 채팅 UI 렌더링용 도구.
 * 서버에서도 execute를 제공해 tool result가 누락되지 않도록 한다.
 */
export const clientTools = {
  showComponentExample: tool({
    description:
      "Show an interactive component example preview in the chat. Use when the user asks to see how a component looks or works.",
    inputSchema: z.object({
      name: z
        .string()
        .min(3, "Component example path is too short")
        .max(120, "Component example path is too long")
        .regex(
          /^(react|lynx|breeze)\/[a-z0-9]+(?:-[a-z0-9]+)*\/preview$/,
          "Expected '<platform>/<component>/preview' format",
        )
        .describe(
          'Component example path, e.g., "react/action-button/preview", "react/checkbox/preview"',
        ),
    }),
    execute: async ({ name }) => {
      const code = await loadExampleCode(name);
      return {
        shown: true,
        language: "tsx",
        code,
      };
    },
  }),

  showInstallation: tool({
    description: "Show the CLI installation command for a SEED Design component.",
    inputSchema: z.object({
      name: z
        .string()
        .min(1, "Component name is required")
        .max(64, "Component name is too long")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Expected kebab-case component name (lowercase letters, numbers, hyphen)",
        )
        .describe('Component name in kebab-case, e.g., "action-button", "checkbox", "tabs"'),
    }),
    execute: async ({ name }) => ({ shown: true, component: name }),
  }),

  showCodeBlock: tool({
    description: "Show a syntax-highlighted code block in the chat.",
    inputSchema: z.object({
      code: z.string().describe("The code to display"),
      language: z.string().default("tsx").describe("Programming language"),
      title: z.string().optional().describe("Optional title for the code block"),
    }),
    execute: async ({ language, title }) => ({
      shown: true,
      language,
      hasTitle: Boolean(title),
    }),
  }),

  findRelatedLinks: tool({
    description:
      "Find related documentation URLs from the SEED Design sitemap. Use this before final response and attach related links when available. Prefer a mix of docs and react links when relevant.",
    inputSchema: z.object({
      query: z.string().min(2).describe("User question or topic keyword"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(3)
        .describe("Maximum number of links to return"),
    }),
    execute: async ({ query, limit }) => {
      const links = await searchRelatedLinks(query, limit);
      return {
        links,
        count: links.length,
        sitemapUrl: SITEMAP_URL,
      };
    },
  }),
};

import { tool } from "ai";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { typeTableGenerator } from "../../components/type-table/generator";
import { getReactTypeTableOutput } from "../../components/type-table/get-react-type-table";
import { findRelatedLinks as searchRelatedLinks } from "./sitemap-links";

const SITEMAP_URL = "https://seed-design.io/sitemap.xml";

async function findDocsRoot(): Promise<string | null> {
  const cwd = process.cwd();
  const candidates = [path.join(cwd, "docs"), cwd];

  for (const candidate of candidates) {
    try {
      const [hasRegistry, hasComponents] = await Promise.all([
        fs
          .stat(path.join(candidate, "registry"))
          .then((stat) => stat.isDirectory())
          .catch(() => false),
        fs
          .stat(path.join(candidate, "components"))
          .then((stat) => stat.isDirectory())
          .catch(() => false),
      ]);

      if (hasRegistry && hasComponents) {
        return candidate;
      }
    } catch {
      // ignore and try next candidate
    }
  }

  return null;
}

async function findExamplesDir(): Promise<string | null> {
  const docsRoot = await findDocsRoot();
  if (!docsRoot) return null;
  const candidates = [path.join(docsRoot, "examples")];

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

function toPascalCase(kebabCase: string): string {
  return kebabCase
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function resolveDocsRelativePath(docsRoot: string, docsRelativePath: string): string | null {
  const normalizedPath = path.normalize(docsRelativePath);
  const withoutDotPrefix = normalizedPath.startsWith("./")
    ? normalizedPath.slice(2)
    : normalizedPath;

  if (withoutDotPrefix.startsWith("..")) return null;

  const resolvedPath = path.resolve(docsRoot, withoutDotPrefix);
  const rootPath = path.resolve(docsRoot);
  if (!resolvedPath.startsWith(`${rootPath}${path.sep}`)) return null;

  return resolvedPath;
}

async function loadReactTypeTable(input: {
  component?: string;
  path?: string;
  name?: string;
}): Promise<{
  shown: boolean;
  typeName: string;
  sourcePath: string;
  rows: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue: string | null;
  }>;
  error?: string;
}> {
  const docsRoot = await findDocsRoot();
  if (!docsRoot) {
    return {
      shown: false,
      typeName: input.name ?? "",
      sourcePath: input.path ?? "",
      rows: [],
      error: "docs 루트를 찾지 못했어요.",
    };
  }

  const componentName = input.component?.trim();
  const sourcePath =
    input.path?.trim() ||
    (componentName ? `./registry/ui/${componentName}.tsx` : "./registry/ui/action-button.tsx");
  const typeName =
    input.name?.trim() || (componentName ? `${toPascalCase(componentName)}Props` : "");

  if (!typeName) {
    return {
      shown: false,
      typeName: "",
      sourcePath,
      rows: [],
      error: "타입 이름(name)이 비어 있습니다.",
    };
  }

  const resolvedPath = resolveDocsRelativePath(docsRoot, sourcePath);
  if (!resolvedPath) {
    return {
      shown: false,
      typeName,
      sourcePath,
      rows: [],
      error: "유효하지 않은 타입 경로입니다.",
    };
  }

  try {
    const output = await getReactTypeTableOutput({
      generator: typeTableGenerator,
      path: resolvedPath,
      name: typeName,
    });

    const table = output.find((item) => item.name === typeName) ?? output[0];
    const rows =
      table?.entries.map((entry) => ({
        name: entry.name,
        type: entry.type,
        required: entry.required,
        description: entry.description,
        defaultValue:
          entry.tags.find((tag) => tag.name === "default" || tag.name === "defaultValue")?.text ??
          null,
      })) ?? [];

    return {
      shown: rows.length > 0,
      typeName: table?.name ?? typeName,
      sourcePath,
      rows,
      ...(rows.length === 0 ? { error: "타입 테이블 항목을 찾지 못했어요." } : {}),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "타입 테이블 로딩에 실패했습니다.";
    return {
      shown: false,
      typeName,
      sourcePath,
      rows: [],
      error: message,
    };
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

  showReactTypeTable: tool({
    description:
      "Show React props type table. Use when users ask for props/types of a React component. Prefer component input like 'action-button'.",
    inputSchema: z
      .object({
        component: z
          .string()
          .min(1)
          .max(64)
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Expected kebab-case component name (lowercase letters, numbers, hyphen)",
          )
          .optional()
          .describe("React component name in kebab-case, e.g., action-button"),
        path: z
          .string()
          .min(1)
          .max(200)
          .optional()
          .describe("Path to source file from docs root, e.g., ./registry/ui/action-button.tsx"),
        name: z
          .string()
          .min(1)
          .max(120)
          .optional()
          .describe("Type name to extract, e.g., ActionButtonProps"),
      })
      .refine((value) => Boolean(value.component || value.path), {
        message: "Either component or path is required",
      }),
    execute: async ({ component, path: sourcePath, name }) => {
      return await loadReactTypeTable({
        component,
        path: sourcePath,
        name,
      });
    },
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

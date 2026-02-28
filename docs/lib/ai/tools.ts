import { tool } from "ai";
import { z } from "zod";
import {
  loadReactComponentCodeFromLlms,
  loadReactComponentPropsFromLlms,
  resolveReactComponentLlmsPath,
} from "./llms-props";

const COMPONENT_PREVIEW_PATH_REGEX = /^(react|lynx|breeze)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/preview$/;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function normalizeComponentName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const previewPathMatch = trimmed.match(COMPONENT_PREVIEW_PATH_REGEX);
  if (previewPathMatch?.[2]) {
    return previewPathMatch[2];
  }

  return trimmed
    .replace(/^ui:/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveComponentPreviewName(input: {
  name?: string;
  component?: string;
}): string | null {
  const previewName = input.name?.trim();
  if (previewName) {
    return previewName;
  }

  const componentName = input.component ? normalizeComponentName(input.component) : "";
  if (!componentName) {
    return null;
  }

  return `react/${componentName}/preview`;
}

export function resolveInstallationComponentName(input: {
  name?: string;
  component?: string;
}): string {
  const candidate = input.component?.trim() || input.name?.trim() || "";
  return normalizeComponentName(candidate);
}

function toPascalCase(kebabCase: string): string {
  return kebabCase
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function getComponentFromLlmsPath(path: string): string {
  const pathname = path.startsWith("http://") || path.startsWith("https://") ? new URL(path).pathname : path;
  const fileName = pathname.split("/").pop() ?? "";
  return normalizeComponentName(fileName.replace(/\.txt$/i, ""));
}

function normalizeLlmsPath(path: string): string | null {
  const trimmed = path.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const pathname = new URL(trimmed).pathname;
      return pathname.startsWith("/llms/react/") ? pathname : null;
    } catch {
      return null;
    }
  }

  const normalized = trimmed.replace(/^\.\/?/, "");
  if (normalized.startsWith("llms/react/")) {
    return `/${normalized}`;
  }

  if (normalized.startsWith("/llms/react/")) {
    return normalized;
  }

  return null;
}

async function loadReactTypeTable(
  input: {
    component?: string;
    path?: string;
    name?: string;
  },
  options: { baseUrl: string },
): Promise<{
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
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const fromInputPath = normalizeLlmsPath(input.path ?? "");
  const componentFromPath = fromInputPath ? getComponentFromLlmsPath(fromInputPath) : "";
  const componentName = normalizeComponentName(input.component ?? "") || componentFromPath;

  const typeName = input.name?.trim() || (componentName ? `${toPascalCase(componentName)}Props` : "");
  const sourcePath =
    fromInputPath || (componentName ? await resolveReactComponentLlmsPath(componentName, baseUrl) : null);

  if (!typeName) {
    return {
      shown: false,
      typeName: "",
      sourcePath: input.path?.trim() ?? "",
      rows: [],
      error: "타입 이름(name)이 비어 있습니다.",
    };
  }

  if (!sourcePath) {
    return {
      shown: false,
      typeName,
      sourcePath: input.path?.trim() ?? "",
      rows: [],
      error: "Props 타입 테이블을 찾지 못했어요.",
    };
  }

  const result = await loadReactComponentPropsFromLlms({
    baseUrl,
    component: componentName,
    path: sourcePath,
  });

  return {
    shown: result.rows.length > 0,
    typeName,
    sourcePath: result.sourcePath ?? sourcePath,
    rows: result.rows,
    ...(result.error ? { error: result.error } : {}),
  };
}

export async function getComponentExamplePayload(
  input: {
    name?: string;
    component?: string;
  },
  options?: { baseUrl?: string },
): Promise<{
  shown: boolean;
  previewName: string | null;
  component: string | null;
  language: string;
  previewFound: boolean;
  code: string | null;
  fallbackCode: string | null;
}> {
  const previewName = resolveComponentPreviewName(input);
  if (!previewName) {
    return {
      shown: false,
      previewName: null,
      component: null,
      language: "tsx",
      previewFound: false,
      code: null,
      fallbackCode: null,
    };
  }

  const baseUrl = normalizeBaseUrl(options?.baseUrl ?? "https://seed-design.io");
  const componentFromPreview = normalizeComponentName(previewName);
  const explicitComponent = normalizeComponentName(input.component ?? "");
  const componentName = explicitComponent || componentFromPreview;

  const previewPath = await resolveReactComponentLlmsPath(componentFromPreview, baseUrl);
  const previewFound = Boolean(previewPath);

  const codeResult = componentName
    ? await loadReactComponentCodeFromLlms({
        component: componentName,
        baseUrl,
      })
    : { code: null, sourcePath: null };

  const fallbackCode = previewFound ? null : codeResult.code;

  return {
    shown: true,
    previewName,
    component: componentName || null,
    language: "tsx",
    previewFound,
    code: codeResult.code,
    fallbackCode,
  };
}

/**
 * 채팅 UI 렌더링용 도구.
 * 서버에서도 execute를 제공해 tool result가 누락되지 않도록 한다.
 */
export function createClientTools(options: { baseUrl: string }) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);

  return {
    showComponentExample: tool({
      description:
        "Show an interactive component example preview in the chat. Use when the user asks to see how a component looks or works.",
      inputSchema: z
        .object({
          name: z
            .string()
            .min(3, "Component example path is too short")
            .max(120, "Component example path is too long")
            .regex(
              /^(react|lynx|breeze)\/[a-z0-9]+(?:-[a-z0-9]+)*\/preview$/,
              "Expected '<platform>/<component>/preview' format",
            )
            .optional()
            .describe(
              'Component example path, e.g., "react/action-button/preview", "react/checkbox/preview"',
            ),
          component: z
            .string()
            .min(1, "Component name is required")
            .max(80, "Component name is too long")
            .optional()
            .describe('Canonical component name, e.g., "alert-dialog", "action-button"'),
        })
        .refine((value) => Boolean(value.name || value.component), {
          message: "Either name or component is required",
        }),
      execute: async ({ name, component }) => {
        return await getComponentExamplePayload(
          {
            name,
            component,
          },
          { baseUrl },
        );
      },
    }),

    showInstallation: tool({
      description: "Show the CLI installation command for a SEED Design component.",
      inputSchema: z
        .object({
          name: z
            .string()
            .min(1, "Component name is required")
            .max(64, "Component name is too long")
            .optional()
            .describe(
              'Legacy component name input. Supports "alert-dialog" and "ui:alert-dialog". Prefer component.',
            ),
          component: z
            .string()
            .min(1, "Component name is required")
            .max(64, "Component name is too long")
            .optional()
            .describe('Canonical component name in kebab-case, e.g., "alert-dialog", "tabs"'),
        })
        .refine((value) => Boolean(value.name || value.component), {
          message: "Either name or component is required",
        }),
      execute: async ({ name, component }) => {
        const normalizedComponent = resolveInstallationComponentName({ name, component });
        if (!normalizedComponent) {
          return {
            shown: false,
            error: "유효한 컴포넌트 이름을 찾지 못했어요.",
          };
        }

        return {
          shown: true,
          component: normalizedComponent,
        };
      },
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
            .describe("Path to llms source, e.g., /llms/react/components/action-button.txt"),
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
        return await loadReactTypeTable(
          {
            component,
            path: sourcePath,
            name,
          },
          { baseUrl },
        );
      },
    }),
  };
}

export const clientTools = createClientTools({ baseUrl: "https://seed-design.io" });

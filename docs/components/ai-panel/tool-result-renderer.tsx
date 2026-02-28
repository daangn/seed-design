"use client";

import { ComponentPreview } from "@/components/component-preview";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { ProgressCircle } from "seed-design/ui/progress-circle";

interface ToolResultRendererProps {
  toolName: string;
  input: Record<string, unknown>;
  state: string;
  output?: unknown;
}

interface ReactTypeTableRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string | null;
}

interface GenericToolSummary {
  title: string;
  body: string;
  isError: boolean;
}

function getSafeInput(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object") return {};
  return input as Record<string, unknown>;
}

function getComponentName(input: Record<string, unknown>, output: unknown): string | null {
  const safeInput = getSafeInput(input);
  const outputComponent =
    output && typeof output === "object" ? (output as { component?: unknown }).component : undefined;
  const inputComponent = safeInput.component;
  const inputName = safeInput.name;
  const candidate =
    (typeof outputComponent === "string" && outputComponent) ||
    (typeof inputComponent === "string" && inputComponent) ||
    (typeof inputName === "string" && inputName) ||
    "";

  const previewPathMatch = candidate.match(/^(?:react|lynx|breeze)\/([a-z0-9-]+)\/preview$/i);
  if (previewPathMatch?.[1]) {
    return previewPathMatch[1];
  }

  const normalized = candidate
    .replace(/^ui:/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || null;
}

function resolvePreviewName(input: Record<string, unknown>, output: unknown): string | null {
  const safeInput = getSafeInput(input);
  const outputPreviewName =
    output && typeof output === "object"
      ? ((output as { previewName?: unknown }).previewName ?? (output as { name?: unknown }).name)
      : undefined;

  if (typeof outputPreviewName === "string" && outputPreviewName) {
    return outputPreviewName;
  }

  if (typeof safeInput.name === "string" && safeInput.name) {
    return safeInput.name;
  }

  const componentName = getComponentName(safeInput, output);
  if (!componentName) return null;
  return `react/${componentName}/preview`;
}

const INSTALL_COMMANDS = [
  { manager: "npm", commandPrefix: "npx" },
  { manager: "yarn", commandPrefix: "yarn dlx" },
  { manager: "pnpm", commandPrefix: "pnpm dlx" },
  { manager: "bun", commandPrefix: "bunx" },
] as const;
const TOOL_FADE_IN_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

function ToolLoading({ label }: { label: string }) {
  return (
    <div className="my-1 flex items-center gap-2 text-xs text-fd-muted-foreground">
      <ProgressCircle size="24" value={undefined} />
      {label}
    </div>
  );
}

function ToolFadeIn({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={TOOL_FADE_IN_TRANSITION}>
      {children}
    </m.div>
  );
}

function getToolOutputCode(output: unknown): { code: string; language: string } | null {
  if (!output || typeof output !== "object") return null;

  const code = (output as { code?: unknown }).code;
  if (typeof code !== "string") return null;

  const language = (output as { language?: unknown }).language;
  return {
    code,
    language: typeof language === "string" ? language : "tsx",
  };
}

function getReactTypeTableRows(output: unknown): ReactTypeTableRow[] {
  if (!output || typeof output !== "object") return [];

  const rows = (output as { rows?: unknown }).rows;
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;

      const safeRow = row as {
        name?: unknown;
        type?: unknown;
        required?: unknown;
        description?: unknown;
        defaultValue?: unknown;
      };

      if (
        typeof safeRow.name !== "string" ||
        typeof safeRow.type !== "string" ||
        typeof safeRow.required !== "boolean"
      ) {
        return null;
      }

      return {
        name: safeRow.name,
        type: safeRow.type,
        required: safeRow.required,
        description: typeof safeRow.description === "string" ? safeRow.description : "",
        defaultValue: typeof safeRow.defaultValue === "string" ? safeRow.defaultValue : null,
      };
    })
    .filter((row): row is ReactTypeTableRow => row !== null);
}

export function summarizeGenericToolOutput(toolName: string, output: unknown): GenericToolSummary {
  if (!output) {
    return {
      title: toolName,
      body: "툴 출력이 비어 있어요.",
      isError: false,
    };
  }

  if (typeof output === "string") {
    return {
      title: toolName,
      body: output,
      isError: false,
    };
  }

  if (typeof output === "object") {
    const safeOutput = output as { error?: unknown; content?: unknown };
    const error =
      typeof safeOutput.error === "string"
        ? safeOutput.error
        : typeof (safeOutput.error as { message?: unknown } | undefined)?.message === "string"
          ? ((safeOutput.error as { message: string }).message ?? "")
          : "";

    if (error) {
      return {
        title: toolName,
        body: error,
        isError: true,
      };
    }

    if (typeof safeOutput.content === "string" && safeOutput.content.trim()) {
      return {
        title: toolName,
        body: safeOutput.content,
        isError: false,
      };
    }

    return {
      title: toolName,
      body: JSON.stringify(output, null, 2),
      isError: false,
    };
  }

  return {
    title: toolName,
    body: String(output),
    isError: false,
  };
}

export function ToolResultRenderer({ toolName, input, state, output }: ToolResultRendererProps) {
  // 아직 입력이 완전하지 않으면 로딩 표시
  if (state === "input-streaming") {
    return (
      <ToolFadeIn>
        <ToolLoading label="처리 중..." />
      </ToolFadeIn>
    );
  }

  switch (toolName) {
    case "showComponentExample": {
      const previewName = resolvePreviewName(input, output);
      if (!previewName) {
        return (
          <ToolFadeIn>
            <div className="my-1 text-xs text-fd-muted-foreground">잘못된 미리보기 입력입니다.</div>
          </ToolFadeIn>
        );
      }

      const outputCode = getToolOutputCode(output);
      const inlineCode =
        typeof input.code === "string"
          ? input.code
          : output && typeof output === "object" && typeof (output as { fallbackCode?: unknown }).fallbackCode === "string"
            ? ((output as { fallbackCode: string }).fallbackCode ?? "")
            : null;
      const code = outputCode?.code ?? inlineCode;
      const language = outputCode?.language ?? "tsx";
      const isCodeLoading = state === "input-available" && !code;
      const previewFound =
        output && typeof output === "object" && typeof (output as { previewFound?: unknown }).previewFound === "boolean"
          ? Boolean((output as { previewFound: boolean }).previewFound)
          : true;

      if (!previewFound) {
        return (
          <ToolFadeIn>
            <div className="my-2">
              {code ? (
                <DynamicCodeBlock lang={language} code={code} />
              ) : (
                <div className="text-xs text-fd-muted-foreground">
                  미리보기를 찾지 못해 코드 폴백도 제공되지 않았어요.
                </div>
              )}
            </div>
          </ToolFadeIn>
        );
      }

      return (
        <ToolFadeIn>
          <div className="my-2">
            <Tabs items={["미리보기", "코드"]}>
              <Tab value="미리보기">
                <div className="flex min-h-80">
                  <ComponentPreview name={previewName} />
                </div>
              </Tab>
              <Tab value="코드">
                {code && <DynamicCodeBlock lang={language} code={code} />}
                {isCodeLoading && <ToolLoading label="예시 코드를 불러오는 중..." />}
                {!code && !isCodeLoading && (
                  <div className="text-xs text-fd-muted-foreground">예시 코드를 찾지 못했어요.</div>
                )}
              </Tab>
            </Tabs>
          </div>
        </ToolFadeIn>
      );
    }

    case "showInstallation": {
      const componentName = getComponentName(input, output);
      if (!componentName) {
        return (
          <ToolFadeIn>
            <div className="my-1 text-xs text-fd-muted-foreground">잘못된 설치 입력입니다.</div>
          </ToolFadeIn>
        );
      }

      return (
        <ToolFadeIn>
          <div className="my-2">
            <Tabs items={INSTALL_COMMANDS.map(({ manager }) => manager)}>
              {INSTALL_COMMANDS.map(({ manager, commandPrefix }) => (
                <Tab key={manager} value={manager}>
                  <DynamicCodeBlock
                    lang="bash"
                    code={`${commandPrefix} @seed-design/cli@latest add ${componentName}`}
                  />
                </Tab>
              ))}
            </Tabs>
          </div>
        </ToolFadeIn>
      );
    }

    case "showCodeBlock":
      if (typeof input.code !== "string") {
        return (
          <ToolFadeIn>
            <div className="my-1 text-xs text-fd-muted-foreground">
              코드 블록 입력이 올바르지 않습니다.
            </div>
          </ToolFadeIn>
        );
      }
      return (
        <ToolFadeIn>
          <div className="my-2">
            {typeof input.title === "string" && (
              <div className="text-xs font-medium text-fd-muted-foreground mb-1">{input.title}</div>
            )}
            <DynamicCodeBlock
              lang={typeof input.language === "string" ? input.language : "tsx"}
              code={input.code}
            />
          </div>
        </ToolFadeIn>
      );

    case "showReactTypeTable": {
      if (state === "input-available") {
        return (
          <ToolFadeIn>
            <ToolLoading label="Props 타입 테이블 생성 중..." />
          </ToolFadeIn>
        );
      }

      const rows = getReactTypeTableRows(output);
      if (rows.length === 0) {
        const error =
          output &&
          typeof output === "object" &&
          typeof (output as { error?: unknown }).error === "string"
            ? ((output as { error: string }).error ?? "")
            : "";

        return (
          <ToolFadeIn>
            <div className="my-1 text-xs text-fd-muted-foreground">
              {error || "Props 타입 테이블을 찾지 못했어요."}
            </div>
          </ToolFadeIn>
        );
      }

      const type = Object.fromEntries(
        rows.map((row) => [
          row.name,
          {
            type: row.type,
            required: row.required,
            ...(row.description ? { description: row.description } : {}),
            ...(row.defaultValue ? { default: row.defaultValue } : {}),
          },
        ]),
      );

      return (
        <ToolFadeIn>
          <div className="my-2">
            <TypeTable type={type} />
          </div>
        </ToolFadeIn>
      );
    }

    default:
      if (state === "input-available") {
        return (
          <ToolFadeIn>
            <ToolLoading label={`${toolName} 실행 중...`} />
          </ToolFadeIn>
        );
      }

      const summary = summarizeGenericToolOutput(toolName, output);
      return (
        <ToolFadeIn>
          <div
            className={`whitespace-pre-wrap text-xs ${
              summary.isError ? "text-fd-destructive" : "text-fd-muted-foreground"
            }`}
          >
            {summary.body}
          </div>
        </ToolFadeIn>
      );
  }
}

"use client";

import type { UIMessage } from "ai";
import {
  IconCheckmarkCircleLine,
  IconSquare2StackedLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { AnimatePresence, m } from "motion/react";
import { ActionButton } from "seed-design/ui/action-button";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  getToolDedupeKey,
  getToolPolicies,
  getToolPolicy,
  shouldCollapseToolResult,
  shouldDropFencedCodeFromText,
  type ToolPolicy,
  type ToolSection,
} from "@/lib/ai/tool-contract";
import { ChatMarkdown } from "./chat-markdown";
import { parseMarkdownCodeBlocks } from "./parse-markdown-code-blocks";
import { stripToolSectionLabels } from "./tool-section-labels";
import { ToolResultRenderer } from "./tool-result-renderer";

const INSTALL_COMMANDS = [
  "npx @seed-design/cli@latest add",
  "yarn dlx @seed-design/cli@latest add",
  "pnpm dlx @seed-design/cli@latest add",
  "bunx @seed-design/cli@latest add",
] as const;

interface ToolRenderContext {
  hasCodeTool: boolean;
  hasComponentExample: boolean;
  hasInstallation: boolean;
  hasReactTypeTable: boolean;
  activePolicies: ToolPolicy[];
  dropFencedCodeFromText: boolean;
}

interface VerifiedLink {
  title: string;
  url: string;
}

interface DerivedPropsRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string | null;
}

function getRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function getVerifiedLinksFromMessageMetadata(message: UIMessage): VerifiedLink[] {
  const metadata = getRecord(message.metadata);
  const rawLinks = metadata.verifiedLinks;
  if (!Array.isArray(rawLinks)) {
    return [];
  }

  const links: VerifiedLink[] = [];
  for (const rawLink of rawLinks) {
    const safeLink = getRecord(rawLink);
    if (typeof safeLink.title !== "string" || typeof safeLink.url !== "string") {
      continue;
    }

    links.push({
      title: safeLink.title,
      url: safeLink.url,
    });
  }

  return links;
}

function getReactTypeTableRowsFromOutput(output: unknown): Array<{
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string | null;
}> {
  const safeOutput = getRecord(output);
  const rows = safeOutput.rows;
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => {
      const safeRow = getRecord(row);

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
    .filter(
      (
        row,
      ): row is {
        name: string;
        type: string;
        required: boolean;
        description: string;
        defaultValue: string | null;
      } => row !== null,
    );
}


function parsePropNames(raw: string): string[] {
  const normalized = raw
    .replaceAll("`", "")
    .replaceAll("**", "")
    .replaceAll("'", "")
    .replaceAll('"', "")
    .trim();

  return normalized
    .split("/")
    .flatMap((token) => token.split(","))
    .map((token) => token.trim())
    .filter(Boolean);
}

function extractPropsTableRowsFromText(text: string): { text: string; rows: DerivedPropsRow[] } {
  const propsSectionRegex =
    /(?:^|\n)#{1,6}\s*(?:주요\s*)?props[^\n]*\n([\s\S]*?)(?=\n#{1,6}\s|\n---|\n$|$)/i;
  const match = text.match(propsSectionRegex);
  if (!match || !match[1]) {
    return { text, rows: [] };
  }

  const sectionBody = match[1];
  const rows: DerivedPropsRow[] = [];

  for (const line of sectionBody.split("\n")) {
    const bulletMatch = line.match(/^\s*[-*]\s*(.+?)\s*:\s*(.+)\s*$/);
    if (!bulletMatch) continue;

    const names = parsePropNames(bulletMatch[1]);
    const description = bulletMatch[2].trim();
    if (!description || names.length === 0) continue;

    for (const name of names) {
      rows.push({
        name,
        type: "-",
        required: false,
        description,
        defaultValue: null,
      });
    }
  }

  if (rows.length === 0) {
    return { text, rows: [] };
  }

  return {
    text: text.replace(propsSectionRegex, "\n"),
    rows,
  };
}

function extractInstallTargetFromCode(code: string, language: string): string | null {
  if (!/(bash|sh|zsh|shell|console)/i.test(language) && !code.includes("@seed-design/cli@latest")) {
    return null;
  }

  const match = code.match(/@seed-design\/cli@latest\s+add\s+([^\s]+)/i);
  if (!match?.[1]) return null;
  return match[1].trim();
}

function extractComponentPreviewNameFromCode(code: string, language: string): string | null {
  if (!/(tsx|jsx|typescript|javascript|ts|js)/i.test(language)) {
    return null;
  }

  const match = code.match(/from\s+["']seed-design\/ui\/([a-z0-9-]+)["']/i);
  if (!match?.[1]) return null;

  return `react/${match[1]}/preview`;
}

function getToolCopyText(toolName: string, input: unknown, output: unknown): string[] {
  const lines: string[] = [];
  const safeInput = getRecord(input);
  const safeOutput = getRecord(output);

  if (toolName === "showCodeBlock") {
    const code = safeInput.code;
    const language = safeInput.language;
    if (typeof code === "string") {
      lines.push(`\`\`\`${typeof language === "string" ? language : "tsx"}\n${code}\n\`\`\``);
    }
  }

  if (toolName === "showComponentExample") {
    const code = typeof safeOutput.code === "string" ? safeOutput.code : safeInput.code;
    const language =
      typeof safeOutput.language === "string"
        ? safeOutput.language
        : typeof safeInput.language === "string"
          ? safeInput.language
          : "tsx";

    if (typeof code === "string") {
      lines.push(`\`\`\`${language}\n${code}\n\`\`\``);
    }
  }

  if (toolName === "showInstallation") {
    const componentName =
      (typeof safeOutput.component === "string" && safeOutput.component) ||
      (typeof safeInput.component === "string" && safeInput.component) ||
      safeInput.name;
    if (typeof componentName === "string") {
      for (const commandPrefix of INSTALL_COMMANDS) {
        lines.push(`\`\`\`bash\n${commandPrefix} ${componentName}\n\`\`\``);
      }
    }
  }

  if (toolName === "showReactTypeTable") {
    const rows = getReactTypeTableRowsFromOutput(output);
    if (rows.length > 0) {
      lines.push("## Props");
      lines.push(
        ...rows.map((row) => {
          const requiredText = row.required ? " (required)" : "";
          const defaultText = row.defaultValue ? ` (default: ${row.defaultValue})` : "";
          const descriptionText = row.description ? ` - ${row.description}` : "";
          return `- ${row.name}${requiredText}: ${row.type}${defaultText}${descriptionText}`;
        }),
      );
    }
  }

  return lines;
}

function getMessageCopyText(message: UIMessage): string {
  const lines: string[] = [];

  for (const part of message.parts) {
    if (part.type === "text" && part.text) {
      lines.push(part.text);
      continue;
    }

    if (part.type === "dynamic-tool") {
      lines.push(
        ...getToolCopyText(part.toolName, part.input, "output" in part ? part.output : undefined),
      );
      continue;
    }

    if (typeof part.type === "string" && part.type.startsWith("tool-")) {
      const toolPart = part as unknown as {
        type: string;
        input: unknown;
        output?: unknown;
      };
      lines.push(
        ...getToolCopyText(toolPart.type.replace("tool-", ""), toolPart.input, toolPart.output),
      );
    }
  }

  return lines.join("\n\n").trim();
}

function getToolNameFromPart(part: UIMessage["parts"][number]): string | null {
  if (part.type === "dynamic-tool") {
    return part.toolName;
  }

  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.type.replace("tool-", "");
  }

  return null;
}

function getToolRenderContext(message: UIMessage): ToolRenderContext {
  const activeToolNames = new Set<string>();
  const context: ToolRenderContext = {
    hasCodeTool: false,
    hasComponentExample: false,
    hasInstallation: false,
    hasReactTypeTable: false,
    activePolicies: [],
    dropFencedCodeFromText: false,
  };

  for (const part of message.parts) {
    const toolName = getToolNameFromPart(part);
    if (!toolName) {
      continue;
    }

    activeToolNames.add(toolName);

    if (toolName === "showCodeBlock") context.hasCodeTool = true;
    if (toolName === "showComponentExample") context.hasComponentExample = true;
    if (toolName === "showInstallation") context.hasInstallation = true;
    if (toolName === "showReactTypeTable") context.hasReactTypeTable = true;
  }

  context.activePolicies = getToolPolicies(activeToolNames);
  context.dropFencedCodeFromText = shouldDropFencedCodeFromText(activeToolNames);
  return context;
}

function sanitizeTextForTools(text: string, toolContext: ToolRenderContext): string {
  let sanitized = stripToolSectionLabels(text);

  if (!sanitized.trim()) {
    return "";
  }

  if (toolContext.dropFencedCodeFromText && /```/.test(sanitized)) {
    // Keep conversational context while removing duplicated fenced code blocks.
    sanitized = sanitized.replace(/```[\s\S]*?```/g, "").trim();

    if (!sanitized) {
      return "";
    }
  }

  for (const policy of toolContext.activePolicies) {
    for (const pattern of policy.textSuppressionRules) {
      const replacer = new RegExp(pattern.source, pattern.flags);
      sanitized = sanitized.replace(replacer, "");
    }
  }

  sanitized = sanitized
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!sanitized) {
    return "";
  }

  for (const policy of toolContext.activePolicies) {
    if (policy.shortTextDiscardPattern && sanitized.length < 220) {
      const testPattern = new RegExp(
        policy.shortTextDiscardPattern.source,
        policy.shortTextDiscardPattern.flags,
      );
      if (testPattern.test(sanitized)) {
        return "";
      }
    }
  }

  return sanitized;
}

function ToolSectionLabel({ title }: { title: string }) {
  return (
    <div className="mt-3 mb-1 text-[12px] font-semibold text-fd-muted-foreground">{title}</div>
  );
}

function ToolResultDisclosure({
  toolName,
  state,
  children,
}: {
  toolName: string;
  state: string;
  children: ReactNode;
}) {
  const collapsed = shouldCollapseToolResult(toolName);

  if (!collapsed) {
    return <>{children}</>;
  }

  if (state === "input-streaming" || state === "input-available") {
    return (
      <div className="my-2 rounded-md border border-fd-border bg-fd-card px-3 py-2">
        <div className="text-xs font-semibold text-fd-foreground">{toolName}</div>
        <div className="mt-1">{children}</div>
      </div>
    );
  }

  return (
    <details open={!collapsed} className="my-2 rounded-md border border-fd-border bg-fd-card">
      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-fd-foreground">
        {toolName}
      </summary>
      <div className="px-3 pb-2">{children}</div>
    </details>
  );
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const metadataVerifiedLinks = isUser ? [] : getVerifiedLinksFromMessageMetadata(message);
  const toolContext = isUser
    ? {
        hasCodeTool: false,
        hasComponentExample: false,
        hasInstallation: false,
        hasReactTypeTable: false,
        activePolicies: [],
        dropFencedCodeFromText: false,
      }
    : getToolRenderContext(message);

  const copyText = isUser ? "" : getMessageCopyText(message);
  const canCopy = !isUser && copyText.length > 0;

  useEffect(() => {
    if (!isCopied) return;

    const timeout = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [isCopied]);

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  const assistantNodes: ReactNode[] = [];
  const renderedToolKeys = new Set<string>();
  let previousToolSection: ToolSection | null = null;

  const pushToolNode = ({
    toolName,
    input,
    state,
    output,
    keyHint,
  }: {
    toolName: string;
    input: Record<string, unknown>;
    state: string;
    output?: unknown;
    keyHint: string;
  }) => {
    const dedupeKey = getToolDedupeKey(toolName, input, output, keyHint);
    if (renderedToolKeys.has(dedupeKey)) {
      return;
    }

    renderedToolKeys.add(dedupeKey);
    const policy = getToolPolicy(toolName);

    if (policy.sectionTitle && previousToolSection !== policy.section) {
      assistantNodes.push(
        <ToolSectionLabel key={`tool-label-${dedupeKey}`} title={policy.sectionTitle} />,
      );
      previousToolSection = policy.section;
    }

    assistantNodes.push(
      <ToolResultDisclosure key={`tool-${dedupeKey}`} toolName={toolName} state={state}>
        <ToolResultRenderer toolName={toolName} input={input} state={state} output={output} />
      </ToolResultDisclosure>,
    );
  };

  if (!isUser) {
    for (let partIndex = 0; partIndex < message.parts.length; partIndex += 1) {
      const part = message.parts[partIndex];

      if (part.type === "text" && part.text) {
        const segments = parseMarkdownCodeBlocks(part.text);
        for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
          const segment = segments[segmentIndex];
          const segmentKey = `assistant-segment-${partIndex}-${segmentIndex}`;

          if (segment.type === "code") {
            if (
              toolContext.hasCodeTool ||
              toolContext.hasComponentExample ||
              toolContext.hasInstallation ||
              toolContext.hasReactTypeTable
            ) {
              continue;
            }

            const installTarget = !toolContext.hasInstallation
              ? extractInstallTargetFromCode(segment.code, segment.language)
              : null;

            if (installTarget) {
              pushToolNode({
                toolName: "showInstallation",
                input: { name: installTarget },
                state: "output-available",
                keyHint: `derived-install-${partIndex}-${segmentIndex}`,
              });
              continue;
            }

            const previewName =
              !toolContext.hasComponentExample && !toolContext.hasCodeTool
                ? extractComponentPreviewNameFromCode(segment.code, segment.language)
                : null;

            if (previewName) {
              pushToolNode({
                toolName: "showComponentExample",
                input: {
                  name: previewName,
                  code: segment.code,
                  language: segment.language,
                },
                state: "output-available",
                keyHint: `derived-preview-${partIndex}-${segmentIndex}`,
              });
              continue;
            }

            assistantNodes.push(
              <div key={segmentKey} className="my-1.5">
                <DynamicCodeBlock lang={segment.language} code={segment.code} />
              </div>,
            );
            continue;
          }

          if (!segment.text) {
            continue;
          }

          const visibleText = sanitizeTextForTools(segment.text, toolContext);
          if (!visibleText) {
            continue;
          }

          let derivedText = visibleText;
          let derivedProps: DerivedPropsRow[] = [];

          if (!toolContext.hasReactTypeTable) {
            const propsExtracted = extractPropsTableRowsFromText(derivedText);
            derivedProps = propsExtracted.rows;
            derivedText = propsExtracted.text;
          }

          if (derivedText.trim()) {
            assistantNodes.push(
              <div key={segmentKey} className="text-[13px] break-words">
                <ChatMarkdown markdown={derivedText} />
              </div>,
            );
          }

          if (derivedProps.length > 0) {
            pushToolNode({
              toolName: "showReactTypeTable",
              input: {},
              state: "output-available",
              output: { rows: derivedProps },
              keyHint: `derived-props-${partIndex}-${segmentIndex}`,
            });
          }
        }
        continue;
      }

      const toolName = getToolNameFromPart(part);
      if (!toolName) {
        continue;
      }

      if (part.type === "dynamic-tool") {
        pushToolNode({
          toolName,
          input:
            part.input && typeof part.input === "object"
              ? (part.input as Record<string, unknown>)
              : {},
          state: part.state,
          output: "output" in part ? part.output : undefined,
          keyHint: part.toolCallId,
        });
        continue;
      }

      const toolPart = part as unknown as {
        toolCallId?: string;
        state?: string;
        input?: Record<string, unknown>;
        output?: unknown;
      };
      pushToolNode({
        toolName,
        input: toolPart.input && typeof toolPart.input === "object" ? toolPart.input : {},
        state: typeof toolPart.state === "string" ? toolPart.state : "output-available",
        output: toolPart.output,
        keyHint: toolPart.toolCallId ?? `tool-${partIndex}`,
      });
    }
  }

  if (!isUser && metadataVerifiedLinks.length > 0) {
    const textParts = message.parts
      .filter((part): part is Extract<UIMessage["parts"][number], { type: "text"; text: string }> => {
        return part.type === "text" && typeof part.text === "string";
      })
      .map((part) => part.text)
      .join("\n");

    const missingLinks = metadataVerifiedLinks.filter((link) => !textParts.includes(link.url));
    if (missingLinks.length > 0) {
      const markdown = missingLinks.map((link) => `- [${link.title}](${link.url})`).join("\n");
      assistantNodes.push(
        <div key="assistant-verified-links-fallback" className="text-[13px] break-words">
          <ChatMarkdown markdown={markdown} />
        </div>,
      );
    }
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={isUser ? "max-w-[90%]" : "min-w-[85%] max-w-[90%]"}>
        <div
          className={`${
            isUser
              ? "bg-fd-primary text-fd-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2"
              : ""
          }`}
        >
          {isUser &&
            message.parts.map((part, partIndex) => {
              if (part.type !== "text" || !part.text) {
                return null;
              }

              return (
                <div
                  key={`user-text-${partIndex}`}
                  className="text-[13px] leading-[1.45] whitespace-pre-wrap break-words"
                >
                  {part.text}
                </div>
              );
            })}

          {!isUser && <>{assistantNodes}</>}
        </div>

        {!isUser && (
          <div className="mt-1">
            <ActionButton
              type="button"
              onClick={handleCopy}
              variant="ghost"
              layout="iconOnly"
              size="xsmall"
              bleedX="asPadding"
              bleedY="asPadding"
              aria-label={isCopied ? "응답 복사됨" : "응답 복사"}
              disabled={!canCopy}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <m.span
                    key="copied"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="inline-flex"
                  >
                    <Icon svg={<IconCheckmarkCircleLine />} />
                  </m.span>
                ) : (
                  <m.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="inline-flex"
                  >
                    <Icon svg={<IconSquare2StackedLine />} />
                  </m.span>
                )}
              </AnimatePresence>
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}

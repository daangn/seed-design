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
import { useEffect, useState } from "react";
import { parseMarkdownCodeBlocks } from "./parse-markdown-code-blocks";
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
  hasRelatedLinks: boolean;
  relatedLinkUrls: string[];
}

function getRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function getRelatedLinksFromOutput(output: unknown): Array<{ title: string; url: string }> {
  const safeOutput = getRecord(output);
  const links = safeOutput.links;
  if (!Array.isArray(links)) return [];

  return links
    .map((link) => {
      const safeLink = getRecord(link);
      if (typeof safeLink.title !== "string" || typeof safeLink.url !== "string") {
        return null;
      }
      return {
        title: safeLink.title,
        url: safeLink.url,
      };
    })
    .filter((link): link is { title: string; url: string } => link !== null);
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
    const componentName = safeInput.name;
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

  if (toolName === "findRelatedLinks") {
    const links = getRelatedLinksFromOutput(output);
    if (links.length > 0) {
      lines.push(...links.map((link) => `- ${link.title}: ${link.url}`));
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

function getToolRenderContext(message: UIMessage): ToolRenderContext {
  const context: ToolRenderContext = {
    hasCodeTool: false,
    hasComponentExample: false,
    hasInstallation: false,
    hasReactTypeTable: false,
    hasRelatedLinks: false,
    relatedLinkUrls: [],
  };

  for (const part of message.parts) {
    if (part.type === "dynamic-tool") {
      if (part.toolName === "showCodeBlock") context.hasCodeTool = true;
      if (part.toolName === "showComponentExample") context.hasComponentExample = true;
      if (part.toolName === "showInstallation") context.hasInstallation = true;
      if (part.toolName === "showReactTypeTable") context.hasReactTypeTable = true;
      if (part.toolName === "findRelatedLinks") {
        context.hasRelatedLinks = true;
        context.relatedLinkUrls.push(
          ...getRelatedLinksFromOutput("output" in part ? part.output : undefined).map(
            (link) => link.url,
          ),
        );
      }
      continue;
    }

    if (typeof part.type === "string" && part.type.startsWith("tool-")) {
      const toolName = part.type.replace("tool-", "");
      const toolPart = part as unknown as { output?: unknown };

      if (toolName === "showCodeBlock") context.hasCodeTool = true;
      if (toolName === "showComponentExample") context.hasComponentExample = true;
      if (toolName === "showInstallation") context.hasInstallation = true;
      if (toolName === "showReactTypeTable") context.hasReactTypeTable = true;
      if (toolName === "findRelatedLinks") {
        context.hasRelatedLinks = true;
        context.relatedLinkUrls.push(
          ...getRelatedLinksFromOutput(toolPart.output).map((link) => link.url),
        );
      }
    }
  }

  context.relatedLinkUrls = Array.from(new Set(context.relatedLinkUrls));
  return context;
}

function isCoveredRelatedUrl(urlInText: string, relatedLinkUrls: string[]): boolean {
  return relatedLinkUrls.some(
    (toolUrl) => toolUrl.includes(urlInText) || urlInText.includes(toolUrl),
  );
}

function sanitizeTextForTools(text: string, toolContext: ToolRenderContext): string {
  let sanitized = text;

  if (!sanitized.trim()) {
    return "";
  }

  if (
    (toolContext.hasCodeTool ||
      toolContext.hasComponentExample ||
      toolContext.hasInstallation ||
      toolContext.hasReactTypeTable) &&
    /```/.test(sanitized)
  ) {
    return "";
  }

  if (toolContext.hasInstallation) {
    sanitized = sanitized
      .replace(/^#{1,6}\s*(installation|install|설치)\s*$/gim, "")
      .replace(/^.*@seed-design\/cli@latest add.*$/gim, "")
      .replace(/^.*(run this command|to install|설치.*명령어|설치 방법).*$/gim, "");
  }

  if (toolContext.hasComponentExample) {
    sanitized = sanitized
      .replace(/^#{1,6}\s*(preview|미리보기|example|사용 예시)\s*$/gim, "")
      .replace(
        /^.*(here is a preview|preview of the|component preview|컴포넌트 미리보기|사용 예제|아래는 .*예제).*$/gim,
        "",
      );
  }

  if (toolContext.hasReactTypeTable) {
    const propsListPatterns = [
      /^#{1,6}\s*props\s*$/gim,
      /^.*(주요\s*props|props는 다음과 같습니다|prop table|props table|타입 테이블|프로퍼티 목록).*$/gim,
      /^\s*[-*]\s*\*\*[^*]+\*\*.*$/gim,
    ];

    for (const pattern of propsListPatterns) {
      sanitized = sanitized.replace(pattern, "");
    }

    if (/\b(props?|프로퍼티|속성)\b/i.test(sanitized) && /\|\s*undefined/.test(sanitized)) {
      return "";
    }
  }

  if (toolContext.hasRelatedLinks) {
    sanitized = sanitized
      .replace(/^#{1,6}\s*(related links?|관련 문서 링크|관련된 링크)\s*$/gim, "")
      .replace(/^.*(for more detailed information|자세한 정보).*$/gim, "");

    const sanitizedLines = sanitized
      .split("\n")
      .filter((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return true;

        const markdownLinkMatch = trimmedLine.match(/\[.*?\]\((https?:\/\/[^)]+)\)/);
        if (markdownLinkMatch) {
          return !isCoveredRelatedUrl(markdownLinkMatch[1], toolContext.relatedLinkUrls);
        }

        const urlMatches = trimmedLine.match(/https?:\/\/[^\s)\]]+/g) ?? [];
        if (urlMatches.length === 0) return true;

        return !urlMatches.every((urlInText) =>
          isCoveredRelatedUrl(urlInText, toolContext.relatedLinkUrls),
        );
      })
      .join("\n");

    if (sanitizedLines.trim().length === 0) {
      return "";
    }

    sanitized = sanitizedLines;
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

  if (
    toolContext.hasInstallation &&
    sanitized.length < 220 &&
    /(run this command|to install|설치.*명령어|설치 방법)/i.test(sanitized)
  ) {
    return "";
  }

  if (
    toolContext.hasComponentExample &&
    sanitized.length < 220 &&
    /(here is a preview|preview of the|component preview|컴포넌트 미리보기|사용 예제|아래는 .*예제)/i.test(
      sanitized,
    )
  ) {
    return "";
  }

  if (
    toolContext.hasRelatedLinks &&
    /(related links?|관련 문서 링크|관련된 링크|for more detailed information|자세한 정보)/i.test(
      sanitized,
    )
  ) {
    return "";
  }

  if (
    toolContext.hasReactTypeTable &&
    /(주요\s*props|props는 다음과 같습니다|prop table|props table|타입 테이블)/i.test(sanitized)
  ) {
    return "";
  }

  if (toolContext.hasRelatedLinks) {
    const urlMatches = sanitized.match(/https?:\/\/[^\s)\]]+/g) ?? [];
    if (
      urlMatches.length > 0 &&
      urlMatches.every((urlInText) => isCoveredRelatedUrl(urlInText, toolContext.relatedLinkUrls))
    ) {
      return "";
    }
  }

  return sanitized;
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const toolContext = isUser
    ? {
        hasCodeTool: false,
        hasComponentExample: false,
        hasInstallation: false,
        hasReactTypeTable: false,
        hasRelatedLinks: false,
        relatedLinkUrls: [],
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
          {message.parts.map((part, i) => {
            if (part.type === "text" && part.text) {
              const segments = !isUser
                ? parseMarkdownCodeBlocks(part.text)
                : [{ type: "text" as const, text: part.text }];
              return (
                <div key={`text-${i}`}>
                  {segments.map((segment, segmentIndex) => {
                    if (segment.type === "code") {
                      if (
                        !isUser &&
                        (toolContext.hasCodeTool ||
                          toolContext.hasComponentExample ||
                          toolContext.hasInstallation ||
                          toolContext.hasReactTypeTable)
                      ) {
                        return null;
                      }

                      return (
                        <div key={`segment-code-${segmentIndex}`} className="my-2">
                          <DynamicCodeBlock lang={segment.language} code={segment.code} />
                        </div>
                      );
                    }

                    if (!segment.text) {
                      return null;
                    }

                    const visibleText = !isUser
                      ? sanitizeTextForTools(segment.text, toolContext)
                      : segment.text;

                    if (!visibleText) {
                      return null;
                    }

                    return (
                      <div
                        key={`segment-text-${segmentIndex}`}
                        className={`text-sm whitespace-pre-wrap break-words ${
                          isUser
                            ? ""
                            : "prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        }`}
                      >
                        {visibleText}
                      </div>
                    );
                  })}
                </div>
              );
            }

            // 도구 호출 파트 (dynamic-tool 포함)
            if (part.type === "dynamic-tool") {
              return (
                <ToolResultRenderer
                  key={part.toolCallId}
                  toolName={part.toolName}
                  input={part.input as Record<string, unknown>}
                  state={part.state}
                  output={"output" in part ? part.output : undefined}
                />
              );
            }

            // 정적 도구 파트 (type: "tool-{name}")
            if (typeof part.type === "string" && part.type.startsWith("tool-")) {
              const toolPart = part as unknown as {
                type: string;
                toolCallId: string;
                state: string;
                input: Record<string, unknown>;
                output?: unknown;
              };
              const toolName = toolPart.type.replace("tool-", "");
              return (
                <ToolResultRenderer
                  key={toolPart.toolCallId}
                  toolName={toolName}
                  input={toolPart.input}
                  state={toolPart.state}
                  output={toolPart.output}
                />
              );
            }

            return null;
          })}
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

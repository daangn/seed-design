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
    hasRelatedLinks: false,
    relatedLinkUrls: [],
  };

  for (const part of message.parts) {
    if (part.type === "dynamic-tool") {
      if (part.toolName === "showCodeBlock") context.hasCodeTool = true;
      if (part.toolName === "showComponentExample") context.hasComponentExample = true;
      if (part.toolName === "showInstallation") context.hasInstallation = true;
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

function isRedundantTextForTools(text: string, toolContext: ToolRenderContext): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  if (
    (toolContext.hasCodeTool || toolContext.hasComponentExample || toolContext.hasInstallation) &&
    /```/.test(trimmed)
  ) {
    return true;
  }

  if (toolContext.hasInstallation) {
    if (/@seed-design\/cli@latest add/.test(trimmed)) {
      return true;
    }
    if (
      trimmed.length < 220 &&
      /(run this command|to install|설치.*명령어|설치 방법)/i.test(trimmed)
    ) {
      return true;
    }
  }

  if (toolContext.hasComponentExample) {
    if (
      trimmed.length < 220 &&
      /(here is a preview|preview of the|component preview|컴포넌트 미리보기|사용 예제|아래는 .*예제)/i.test(
        trimmed,
      )
    ) {
      return true;
    }
  }

  if (toolContext.hasRelatedLinks) {
    if (
      /(related links?|관련 문서 링크|관련된 링크|for more detailed information|자세한 정보)/i.test(
        trimmed,
      )
    ) {
      return true;
    }

    const urlMatches = trimmed.match(/https?:\/\/[^\s)\]]+/g) ?? [];
    if (urlMatches.length > 0) {
      const allCoveredByTool = urlMatches.every((urlInText) =>
        toolContext.relatedLinkUrls.some(
          (toolUrl) => toolUrl.includes(urlInText) || urlInText.includes(toolUrl),
        ),
      );
      if (allCoveredByTool) {
        return true;
      }
    }
  }

  return false;
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const toolContext = isUser
    ? {
        hasCodeTool: false,
        hasComponentExample: false,
        hasInstallation: false,
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
      <div className="max-w-[90%]">
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
                          toolContext.hasInstallation)
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

                    if (!isUser && isRedundantTextForTools(segment.text, toolContext)) {
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
                        {segment.text}
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
                    transition={{ duration: 0.15 }}
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
                    transition={{ duration: 0.15 }}
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

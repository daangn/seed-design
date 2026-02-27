"use client";

import type { UIMessage } from "ai";
import { ToolResultRenderer } from "./tool-result-renderer";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] ${
          isUser
            ? "bg-fd-primary text-fd-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2"
            : ""
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text" && part.text) {
            return (
              <div
                key={`text-${i}`}
                className={`text-sm whitespace-pre-wrap break-words ${
                  isUser
                    ? ""
                    : "prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                }`}
              >
                {part.text}
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
            };
            const toolName = toolPart.type.replace("tool-", "");
            return (
              <ToolResultRenderer
                key={toolPart.toolCallId}
                toolName={toolName}
                input={toolPart.input}
                state={toolPart.state}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

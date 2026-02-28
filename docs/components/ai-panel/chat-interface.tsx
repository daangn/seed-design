"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useAIPanel } from "./ai-panel-provider";
import { ChatMessage } from "./chat-message";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useEffect, useRef, useState, type FormEvent } from "react";

const SUGGESTIONS = [
  "ActionButton 컴포넌트 사용법을 알려줘",
  "Checkbox 설치 방법을 보여줘",
  "SEED Design 색상 토큰은 어떻게 사용해?",
];

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
});

export function ChatInterface() {
  const { close } = useAIPanel();
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-fd-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border shrink-0">
        <div className="flex items-center gap-2">
          <IconSparkle2 width={18} height={18} />
          <span className="font-semibold text-sm">SEED Assistant</span>
        </div>
        <ActionButton
          type="button"
          onClick={close}
          variant="ghost"
          layout="iconOnly"
          size="xsmall"
          bleedX="asPadding"
          bleedY="asPadding"
          aria-label="패널 닫기"
        >
          <Icon svg={<IconXmarkLine />} />
        </ActionButton>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <IconSparkle2 width={32} height={32} />
            <div>
              <p className="text-sm font-medium text-fd-foreground">
                SEED Design에 대해 물어보세요
              </p>
              <p className="text-xs text-fd-muted-foreground mt-1">컴포넌트, 토큰, 사용법 등</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {SUGGESTIONS.map((suggestion) => (
                <ActionButton
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="ghost"
                  className="h-auto w-full justify-start px-3 py-2 text-left text-xs text-fd-muted-foreground"
                >
                  {suggestion}
                </ActionButton>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}

        {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-fd-muted-foreground animate-pulse" />
              <span
                className="inline-block size-1.5 rounded-full bg-fd-muted-foreground animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="inline-block size-1.5 rounded-full bg-fd-muted-foreground animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-fd-border px-4 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <TextField
              label={<span className="sr-only">질문 입력</span>}
              value={input}
              onValueChange={(values) => setInput(values.value)}
              hideCharacterCount
            >
              <TextFieldInput
                ref={inputRef}
                aria-label="질문을 입력하세요"
                placeholder="질문을 입력하세요..."
                disabled={isLoading}
              />
            </TextField>
          </div>
          <ActionButton
            type="submit"
            variant="neutralSolid"
            disabled={isLoading || !input.trim()}
            loading={isLoading}
            className="shrink-0"
          >
            전송
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

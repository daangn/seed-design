"use client";

import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface AIPanelContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  chat: Chat<UIMessage>;
}

const AIPanelContext = createContext<AIPanelContextType | null>(null);

const STORAGE_KEY = "seed-ai-panel-open";
const CHAT_ID = "seed-ai-panel-chat";
const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
});

export function AIPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [chat] = useState(
    () =>
      new Chat<UIMessage>({
        id: CHAT_ID,
        transport: chatTransport,
      }),
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsOpen(stored === "true");
      } else {
        // 모바일에서는 기본 닫힘
        setIsOpen(window.innerWidth >= 768);
      }
    } catch {
      setIsOpen(window.innerWidth >= 768);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(isOpen));
    } catch {
      // ignore storage write errors
    }
  }, [isOpen, hydrated]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AIPanelContext.Provider value={{ isOpen, toggle, open, close, chat }}>
      {children}
    </AIPanelContext.Provider>
  );
}

export function useAIPanel() {
  const ctx = useContext(AIPanelContext);
  if (!ctx) throw new Error("useAIPanel must be used within AIPanelProvider");
  return ctx;
}

"use client";

import { useAIPanel } from "./ai-panel-provider";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";

export function AIPanelToggle() {
  const { isOpen, toggle } = useAIPanel();

  return (
    <button
      type="button"
      onClick={toggle}
      className="seed-ai-panel-toggle inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
      title={isOpen ? "AI 패널 닫기" : "AI 패널 열기"}
    >
      <IconSparkle2 width={16} height={16} />
      <span className="max-md:hidden">AI</span>
    </button>
  );
}

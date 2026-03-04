"use client";

import { useAIPanel } from "./ai-panel-provider";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent } from "react";

export const AIPanelToggle = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  function AIPanelToggle({ className, onClick, ...props }: ComponentPropsWithoutRef<"button">, ref) {
  const { isOpen, toggle } = useAIPanel();
  const mergedClassName = [
    "seed-ai-panel-toggle inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      toggle();
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={mergedClassName}
      aria-label={props["aria-label"] ?? (isOpen ? "AI 패널 닫기" : "AI 패널 열기")}
      aria-pressed={props["aria-pressed"] ?? isOpen}
      title={props.title ?? (isOpen ? "AI 패널 닫기" : "AI 패널 열기")}
      {...props}
    >
      <IconSparkle2 width={16} height={16} />
      <span className="max-md:hidden">AI</span>
    </button>
  );
  },
);

AIPanelToggle.displayName = "AIPanelToggle";

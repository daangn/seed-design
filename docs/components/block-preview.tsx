"use client";

import {
  IconArrowUpRightArrowDownLeftLine,
  IconCheckmarkFill,
  IconLaptopLine,
  IconMobileLine,
  IconSquare2StackedLine,
} from "@karrotmarket/react-monochrome-icon";
import * as React from "react";
import { Group, Panel, Separator, type GroupImperativeHandle } from "react-resizable-panels";

import ErrorBoundary from "./error-boundary";

interface BlockPreviewProps {
  name: string;
  iframeHeight?: number;
  children?: React.ReactNode;
}

type View = "preview" | "code";
type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

export function BlockPreview({ name, iframeHeight = 400, children }: BlockPreviewProps) {
  const [view, setView] = React.useState<View>("preview");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const groupRef = React.useRef<GroupImperativeHandle>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsLoaded(false);
  }, [name]);

  const handleViewportChange = (v: Viewport) => {
    setViewport(v);
    requestAnimationFrame(() => {
      if (!containerRef.current || !groupRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth === 0) return;
      const targetWidth = VIEWPORT_WIDTHS[v];
      const percentage = Math.min((targetWidth / containerWidth) * 100, 100);
      groupRef.current.setLayout({ preview: percentage, spacer: 100 - percentage });
    });
  };

  const cliCommand = `npx @seed-design/cli@latest add block:${name}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  };

  const iframeSrc = `/blocks/${name}`;

  return (
    <ErrorBoundary>
      <div className="not-prose my-6 space-y-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-fd-border px-3 py-1.5 font-mono text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <span className="text-fd-foreground">{">"}_</span>
          {cliCommand}
          {copied ? <IconCheckmarkFill size={14} /> : <IconSquare2StackedLine size={14} />}
        </button>

        <div className="overflow-hidden rounded-lg border border-fd-border">
          <div className="flex items-center justify-between border-b border-fd-border px-4">
            <div className="flex items-center">
              <TabButton active={view === "preview"} onClick={() => setView("preview")}>
                미리보기
              </TabButton>
              {children && (
                <TabButton active={view === "code"} onClick={() => setView("code")}>
                  코드
                </TabButton>
              )}
            </div>
            {view === "preview" && (
              <div className="flex items-center gap-1">
                <ViewportButton
                  active={viewport === "desktop"}
                  onClick={() => handleViewportChange("desktop")}
                  label="Desktop"
                >
                  <IconLaptopLine size={16} />
                </ViewportButton>
                <ViewportButton
                  active={viewport === "tablet"}
                  onClick={() => handleViewportChange("tablet")}
                  label="Tablet"
                >
                  <TabletIcon />
                </ViewportButton>
                <ViewportButton
                  active={viewport === "mobile"}
                  onClick={() => handleViewportChange("mobile")}
                  label="Mobile"
                >
                  <IconMobileLine size={16} />
                </ViewportButton>
                <div className="mx-0.5 h-4 w-px bg-fd-border" />
                <ViewportButton
                  active={false}
                  onClick={() => window.open(iframeSrc, "_blank")}
                  label="새 탭에서 열기"
                >
                  <IconArrowUpRightArrowDownLeftLine size={16} />
                </ViewportButton>
              </div>
            )}
          </div>
          {view === "preview" ? (
            <div ref={containerRef}>
              <Group groupRef={groupRef} orientation="horizontal">
                <Panel id="preview" defaultSize={100} minSize={20}>
                  <div className="relative" style={{ height: iframeHeight }}>
                    <iframe
                      src={iframeSrc}
                      title="Block Preview"
                      onLoad={() => setIsLoaded(true)}
                      className="h-full w-full border-none bg-white dark:bg-neutral-950"
                    />
                    {!isLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-950">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
                      </div>
                    )}
                  </div>
                </Panel>
                <Separator className="w-2 bg-fd-secondary transition-colors hover:bg-fd-accent" />
                <Panel id="spacer" defaultSize={0} minSize={0} />
              </Group>
            </div>
          ) : (
            <div className="[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-fd-primary text-fd-primary"
          : "border-transparent text-fd-muted-foreground hover:text-fd-accent-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ViewportButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md p-1.5 transition-colors ${
        active
          ? "bg-fd-accent text-fd-accent-foreground"
          : "text-fd-muted-foreground hover:text-fd-foreground"
      }`}
      title={label}
    >
      {children}
    </button>
  );
}

function TabletIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

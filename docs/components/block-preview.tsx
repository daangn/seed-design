"use client";

import {
  IconArrowUpRightArrowDownLeftLine,
  IconLaptopLine,
  IconMobileLine,
} from "@karrotmarket/react-monochrome-icon";
import * as React from "react";
import { Group, Panel, Separator, type PanelImperativeHandle } from "react-resizable-panels";

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
  const panelRef = React.useRef<PanelImperativeHandle>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleViewportChange = (v: Viewport) => {
    setViewport(v);
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const targetWidth = VIEWPORT_WIDTHS[v];
      const percentage = Math.min((targetWidth / containerWidth) * 100, 100);
      panelRef.current?.resize(percentage);
    }
  };

  const iframeSrc = `/blocks/${name}`;

  return (
    <ErrorBoundary>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <Toolbar
          view={view}
          onViewChange={setView}
          viewport={viewport}
          onViewportChange={handleViewportChange}
          iframeSrc={iframeSrc}
          hasCode={!!children}
        />
        {view === "preview" ? (
          <PreviewPanel
            iframeSrc={iframeSrc}
            iframeHeight={iframeHeight}
            isLoaded={isLoaded}
            onLoad={() => setIsLoaded(true)}
            panelRef={panelRef}
            containerRef={containerRef}
          />
        ) : (
          <div>{children}</div>
        )}
      </div>
    </ErrorBoundary>
  );
}

function Toolbar({
  view,
  onViewChange,
  viewport,
  onViewportChange,
  iframeSrc,
  hasCode,
}: {
  view: View;
  onViewChange: (v: View) => void;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  iframeSrc: string;
  hasCode: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <div className="flex items-center gap-1">
        <TabButton active={view === "preview"} onClick={() => onViewChange("preview")}>
          미리보기
        </TabButton>
        {hasCode && (
          <TabButton active={view === "code"} onClick={() => onViewChange("code")}>
            코드
          </TabButton>
        )}
      </div>
      {view === "preview" && (
        <div className="flex items-center gap-1">
          <ViewportButton
            active={viewport === "desktop"}
            onClick={() => onViewportChange("desktop")}
            label="Desktop"
          >
            <IconLaptopLine size={16} />
          </ViewportButton>
          <ViewportButton
            active={viewport === "tablet"}
            onClick={() => onViewportChange("tablet")}
            label="Tablet"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </ViewportButton>
          <ViewportButton
            active={viewport === "mobile"}
            onClick={() => onViewportChange("mobile")}
            label="Mobile"
          >
            <IconMobileLine size={16} />
          </ViewportButton>
          <div className="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
          <button
            type="button"
            onClick={() => window.open(iframeSrc, "_blank")}
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            title="새 탭에서 열기"
          >
            <IconArrowUpRightArrowDownLeftLine size={16} />
          </button>
        </div>
      )}
    </div>
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
      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
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
          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      }`}
      title={label}
    >
      {children}
    </button>
  );
}

function PreviewPanel({
  iframeSrc,
  iframeHeight,
  isLoaded,
  onLoad,
  panelRef,
  containerRef,
}: {
  iframeSrc: string;
  iframeHeight: number;
  isLoaded: boolean;
  onLoad: () => void;
  panelRef: React.RefObject<PanelImperativeHandle | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={containerRef}>
      <Group orientation="horizontal">
        <Panel panelRef={panelRef} defaultSize={100} minSize={25}>
          <div className="relative" style={{ height: iframeHeight }}>
            <iframe
              src={iframeSrc}
              title="Block Preview"
              onLoad={onLoad}
              className="h-full w-full border-none bg-white dark:bg-neutral-950"
            />
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-950">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
              </div>
            )}
          </div>
        </Panel>
        <Separator className="w-2 bg-neutral-100 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" />
        <Panel defaultSize={0} minSize={0} />
      </Group>
    </div>
  );
}

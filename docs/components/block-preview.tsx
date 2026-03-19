"use client";

import { Tab, Tabs } from "fumadocs-ui/components/tabs";
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

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_SIZES: Record<Viewport, number> = {
  desktop: 100,
  tablet: 55,
  mobile: 30,
};

export function BlockPreview({ name, iframeHeight = 400, children }: BlockPreviewProps) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const panelRef = React.useRef<PanelImperativeHandle>(null);

  const handleViewportChange = (v: Viewport) => {
    setViewport(v);
    panelRef.current?.resize(VIEWPORT_SIZES[v]);
  };

  const iframeSrc = `/blocks/${name}`;

  const preview = (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <Toolbar viewport={viewport} onViewportChange={handleViewportChange} iframeSrc={iframeSrc} />
      <PreviewPanel
        iframeSrc={iframeSrc}
        iframeHeight={iframeHeight}
        isLoaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
        panelRef={panelRef}
        viewport={viewport}
      />
    </div>
  );

  if (!children) {
    return (
      <ErrorBoundary>
        <div className="not-prose my-6">{preview}</div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]} className="my-6">
        <Tab value="미리보기">{preview}</Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}

function Toolbar({
  viewport,
  onViewportChange,
  iframeSrc,
}: {
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  iframeSrc: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
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
      </div>
      <button
        type="button"
        onClick={() => window.open(iframeSrc, "_blank")}
        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        title="새 탭에서 열기"
      >
        <IconArrowUpRightArrowDownLeftLine size={16} />
      </button>
    </div>
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
  viewport,
}: {
  iframeSrc: string;
  iframeHeight: number;
  isLoaded: boolean;
  onLoad: () => void;
  panelRef: React.RefObject<PanelImperativeHandle | null>;
  viewport: Viewport;
}) {
  return (
    <Group orientation="horizontal">
      <Panel panelRef={panelRef} defaultSize={VIEWPORT_SIZES[viewport]} minSize={25}>
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
  );
}

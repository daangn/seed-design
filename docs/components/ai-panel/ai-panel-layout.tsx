"use client";

import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import { useAIPanel } from "./ai-panel-provider";
import { ChatInterface } from "./chat-interface";
import { AnimatePresence, m } from "motion/react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

const PANEL_TRANSITION = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const AIPanelLayout = forwardRef<unknown, { children: ReactNode }>(function AIPanelLayout(
  { children }: { children: ReactNode },
  _ref,
) {
  const { isOpen } = useAIPanel();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [renderDesktopContent, setRenderDesktopContent] = useState(isOpen);
  const [isVisibilityTransitioning, setIsVisibilityTransitioning] = useState(false);
  const aiPanelRef = usePanelRef();
  const closeTimerRef = useRef<number | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile === null || isMobile) return;

    setIsVisibilityTransitioning(true);
    const timer = window.setTimeout(() => {
      setIsVisibilityTransitioning(false);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (isMobile === null || isMobile) return;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      setRenderDesktopContent(true);
      window.requestAnimationFrame(() => aiPanelRef.current?.resize(32));
      return;
    }

    closeTimerRef.current = window.setTimeout(() => {
      aiPanelRef.current?.resize(0);
      setRenderDesktopContent(false);
      closeTimerRef.current = null;
    }, 190);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [aiPanelRef, isMobile, isOpen]);

  // iOS Safari: Visual Viewport API로 가상 키보드가 올라올 때 패널 높이/위치 조정
  // Android Chrome는 interactive-widget=resizes-content meta 태그로 처리되므로 보조적으로 동작
  useEffect(() => {
    if (!isMobile || !isOpen || typeof window === "undefined" || !window.visualViewport) return;

    const update = () => {
      const vv = window.visualViewport;
      const el = mobilePanelRef.current;
      if (!vv || !el) return;
      // visualViewport.height: 키보드를 제외한 실제 보이는 높이
      // visualViewport.offsetTop: 페이지 최상단으로부터의 뷰포트 오프셋 (iOS 스크롤 시 변경됨)
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
    };

    update();
    window.visualViewport.addEventListener("resize", update);
    window.visualViewport.addEventListener("scroll", update);

    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [isMobile, isOpen]);

  if (isMobile === null) {
    return <>{children}</>;
  }

  // 모바일: 풀스크린 오버레이
  if (isMobile) {
    return (
      <>
        {children}
        <AnimatePresence initial={false}>
          {isOpen ? (
            <m.div
              ref={mobilePanelRef}
              key="seed-ai-mobile-panel"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={PANEL_TRANSITION}
              className="fixed inset-0 z-50 bg-fd-background"
            >
              <ChatInterface />
            </m.div>
          ) : null}
        </AnimatePresence>
      </>
    );
  }

  // 데스크톱: 전체 뷰포트를 좌우로 분할
  // 왼쪽 = 기존 문서 (헤더/사이드바/푸터 포함), 오른쪽 = AI 패널
  return (
    <Group
      orientation="horizontal"
      id="seed-ai-panel"
      data-ai-open={isOpen ? "true" : "false"}
      data-ai-transitioning={isVisibilityTransitioning ? "true" : "false"}
      style={{ height: "100dvh" }}
      resizeTargetMinimumSize={{ coarse: 36, fine: 12 }}
    >
      <Panel id="main-content" defaultSize="68%" minSize="45%">
        <div className="seed-docs-pane relative h-full min-w-0 overflow-y-auto overflow-x-hidden [transform:translateZ(0)]">
          {children}
        </div>
      </Panel>
      <Separator className="ai-panel-resize-handle" />
      <Panel
        id="ai-panel"
        panelRef={aiPanelRef}
        data-ai-open={isOpen ? "true" : "false"}
        defaultSize={isOpen ? "24%" : 0}
        minSize={isOpen ? "24%" : 0}
        maxSize="55%"
      >
        <AnimatePresence initial={false}>
          {renderDesktopContent ? (
            <m.div
              key="seed-ai-desktop-panel"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={PANEL_TRANSITION}
              className="h-full min-w-0 border-l border-fd-border bg-fd-background"
            >
              <ChatInterface />
            </m.div>
          ) : null}
        </AnimatePresence>
      </Panel>
    </Group>
  );
});

AIPanelLayout.displayName = "AIPanelLayout";

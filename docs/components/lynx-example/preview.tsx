"use client";

import { useTheme } from "@/hooks/useTheme";
import type { LynxViewElement } from "@lynx-js/web-core/client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getLynxErrorMessage,
  getLynxPreviewSizing,
  initializeLynxView,
  isLynxPageReady,
  loadLynxWebCoreStyleRules,
} from "./preview-lifecycle";

const INITIALIZE_MARGIN = "200px";
const LOAD_TIMEOUT_MS = 15_000;

export function LynxComponentPreview({ url, height }: { url: string; height?: number }) {
  const { userColorScheme } = useTheme();
  const sizing = getLynxPreviewSizing(height);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<LynxViewElement | null>(null);
  const themeRef = useRef(userColorScheme);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const setElementRef = useCallback((element: LynxViewElement | null) => {
    elementRef.current = element;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: INITIALIZE_MARGIN },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    void retryKey;
    themeRef.current = userColorScheme;
    const element = elementRef.current;
    if (element) element.globalProps = { theme: userColorScheme };
  }, [userColorScheme, retryKey]);

  useEffect(() => {
    void retryKey;
    if (!visible) return;
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let element: LynxViewElement | null = null;
    const styleAbortController = new AbortController();

    const markReady = () => {
      if (cancelled) return;
      if (isLynxPageReady(element?.shadowRoot ?? null)) {
        setStatus("ready");
        observer?.disconnect();
        if (timer) clearTimeout(timer);
      }
    };
    const handleError = (event: Event) => {
      if (cancelled) return;
      setErrorMessage(getLynxErrorMessage(event));
      setStatus("error");
      observer?.disconnect();
      if (timer) clearTimeout(timer);
    };

    setStatus("loading");
    setErrorMessage("");
    void import("@lynx-js/web-core/client")
      .then(async () => {
        await customElements.whenDefined("lynx-view");
        if (cancelled) return;
        element = elementRef.current;
        if (!element) throw new Error("lynx-view element가 준비되지 않았습니다.");
        element.addEventListener("error", handleError);
        const styleRules = await loadLynxWebCoreStyleRules(undefined, styleAbortController.signal);
        if (cancelled) return;
        initializeLynxView(element, {
          theme: themeRef.current,
          styleRules,
          transformVH: !sizing.autoHeight,
          url,
        });
        const shadowRoot = element.shadowRoot;
        if (!shadowRoot) throw new Error("lynx-view shadow root가 준비되지 않았습니다.");
        observer = new MutationObserver(markReady);
        observer.observe(shadowRoot, { childList: true, subtree: true });
        await Promise.resolve();
        if (cancelled) return;
        timer = setTimeout(() => {
          if (!cancelled) {
            setErrorMessage("15초 안에 Lynx 페이지가 준비되지 않았습니다.");
            setStatus("error");
            observer?.disconnect();
          }
        }, LOAD_TIMEOUT_MS);
        markReady();
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : String(error));
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      styleAbortController.abort();
      observer?.disconnect();
      if (timer) clearTimeout(timer);
      element?.removeEventListener("error", handleError);
    };
  }, [retryKey, sizing.autoHeight, url, visible]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center"
      style={sizing.containerStyle}
    >
      <lynx-view
        key={retryKey}
        ref={setElementRef}
        height={sizing.autoHeight ? "auto" : undefined}
        style={{ display: "block", width: "100%", ...sizing.viewStyle }}
      />
      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-fd-card text-sm text-fd-muted-foreground">
          {status === "error" ? (
            <div className="flex max-w-md flex-col items-center gap-3 px-x4 text-center">
              <p className="m-0">{errorMessage}</p>
              <button
                type="button"
                className="rounded-r2 border border-solid border-stroke-neutral-muted px-x3 py-x2 text-fd-foreground"
                onClick={() => setRetryKey((key) => key + 1)}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <span>Lynx 예제를 불러오는 중입니다.</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

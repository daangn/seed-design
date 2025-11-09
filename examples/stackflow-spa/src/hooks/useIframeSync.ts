import { useEffect } from "react";

interface UseIframeSyncOptions {
  onThemeChange?: (theme: "cupertino" | "android") => void;
}

export function useIframeSync({ onThemeChange }: UseIframeSyncOptions = {}) {
  useEffect(() => {
    if (window.parent === window) return;

    const sendUrl = () =>
      window.parent.postMessage({ type: "URL_CHANGE", url: window.location.href }, "*");

    sendUrl();

    const handleMessage = (event: MessageEvent) => {
      switch (event.data.type) {
        case "NAVIGATE_BACK": {
          history.back();

          break;
        }

        case "NAVIGATE_FORWARD": {
          history.forward();

          break;
        }

        case "THEME_CHANGE": {
          if (event.data.theme === "cupertino" || event.data.theme === "android") {
            onThemeChange?.(event.data.theme);
          }

          break;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("popstate", sendUrl);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);

      sendUrl();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);

      sendUrl();
    };

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("popstate", sendUrl);

      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [onThemeChange]);
}

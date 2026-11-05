import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface RenderTrackingContextValue {
  /** Whether the tracked sibling element is currently rendered. */
  isRendered: boolean;
  /** Ref callback the tracked element composes onto its node to register that it is rendered. */
  trackRef: (node: HTMLElement | null) => void;
}

/**
 * Tracks whether an optional sub-component is rendered, so a sibling slot can emit a
 * styling-only data-attribute (e.g. `data-show-close-button`, `data-has-overlay`).
 *
 * This lives in the styled `@seed-design/react` layer on purpose: the attribute exists
 * solely to drive a `@seed-design/css` selector, so the styled layer — which already holds
 * the version contract with css — owns it, rather than leaking a css↔headless contract.
 *
 * Unrelated to `@seed-design/react-presence`: that handles enter/exit animation, whereas
 * this only records whether a sibling is in the tree.
 */
export function createRenderTrackingContext(name: string) {
  const RenderTrackingContext = createContext<RenderTrackingContextValue | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const [isRendered, setIsRendered] = useState(false);
    const trackRef = useCallback((node: HTMLElement | null) => {
      setIsRendered(!!node);
    }, []);

    const value = useMemo<RenderTrackingContextValue>(
      () => ({ isRendered, trackRef }),
      [isRendered, trackRef],
    );

    return (
      <RenderTrackingContext.Provider value={value}>{children}</RenderTrackingContext.Provider>
    );
  }
  Provider.displayName = `${name}RenderTrackingProvider`;

  function useRenderTracking() {
    const context = useContext(RenderTrackingContext);
    if (context === null) {
      throw new Error(`use${name}RenderTracking must be used within ${name}RenderTrackingProvider`);
    }
    return context;
  }

  return { Provider, useRenderTracking };
}

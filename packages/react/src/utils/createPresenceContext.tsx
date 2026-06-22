import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PresenceContextValue {
  /** Whether the tracked sibling element is currently mounted. */
  isPresent: boolean;
  /** Ref callback the tracked element composes onto its node to register its presence. */
  presenceRef: (node: HTMLElement | null) => void;
}

/**
 * Tracks whether an optional sub-component is rendered, so a sibling slot can emit a
 * styling-only data-attribute (e.g. `data-show-close-button`, `data-has-overlay`).
 *
 * This lives in the styled `@seed-design/react` layer on purpose: the attribute exists
 * solely to drive a `@seed-design/css` selector, so the styled layer — which already holds
 * the version contract with css — owns it, rather than leaking a css↔headless contract.
 */
export function createPresenceContext(name: string) {
  const PresenceContext = createContext<PresenceContextValue | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const [isPresent, setIsPresent] = useState(false);
    const presenceRef = useCallback((node: HTMLElement | null) => {
      setIsPresent(!!node);
    }, []);

    const value = useMemo<PresenceContextValue>(
      () => ({ isPresent, presenceRef }),
      [isPresent, presenceRef],
    );

    return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
  }
  Provider.displayName = `${name}PresenceProvider`;

  function usePresence() {
    const context = useContext(PresenceContext);
    if (context === null) {
      throw new Error(`use${name}Presence must be used within ${name}PresenceProvider`);
    }
    return context;
  }

  return { Provider, usePresence };
}

import * as React from "react";

/**
 * Factory for compound-component Context with a strict consumer hook.
 *
 * The returned hook throws when a sub-component is rendered outside its
 * required ancestor. `rootName` is the JSX tag name used in the error
 * message (e.g. `"SwitchRoot"`).
 */
export function createCompoundContext<T>(rootName: string) {
  const Context = React.createContext<T | null>(null);

  function useCompoundContext(component: string): T {
    const ctx = React.useContext(Context);
    if (!ctx) {
      throw new Error(`<${component}/> must be rendered inside <${rootName}/>.`);
    }
    return ctx;
  }

  return [Context, useCompoundContext] as const;
}

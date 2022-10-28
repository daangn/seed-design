import * as React from "react";

export function usePrefersColorScheme(): "light" | "dark" {
  const [getSnapshot, getServerSnapshot, subscribe] = React.useMemo(() => {
    const matchMedia = () => window.matchMedia("(prefers-color-scheme: dark)");

    return [
      () => (matchMedia().matches ? "dark" : "light"),
      () => "light",
      (notify: () => void) => {
        matchMedia().addEventListener("change", notify);
        return () => {
          matchMedia().removeEventListener("change", notify);
        };
      },
    ];
  }, []);

  return React.useSyncExternalStore(
    subscribe,
    typeof window !== "undefined" ? getSnapshot : getServerSnapshot,
    getServerSnapshot,
  );
}

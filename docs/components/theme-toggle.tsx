"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm"
    >
      {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}

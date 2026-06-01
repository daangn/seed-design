import { getSeedClassName } from "@seed-design/lynx-react";

export type ColorMode = "system" | "light-only" | "dark-only";

type LynxRuntime = typeof globalThis & {
  lynx?: {
    __globalProps?: Record<string, unknown> | null;
  };
};

const runtime = globalThis as LynxRuntime;

export function getGlobalProps() {
  return runtime.lynx?.__globalProps ?? {};
}

function getRuntimeTheme() {
  const globalProps = getGlobalProps();
  const themes = [globalProps.theme, globalProps.frontendTheme].map((value) =>
    String(value ?? "").toLowerCase(),
  );

  if (themes.includes("dark")) {
    return "dark";
  }

  if (themes.includes("light")) {
    return "light";
  }
}

export function getFallbackSeedClassName(colorMode: ColorMode) {
  const runtimeTheme = getRuntimeTheme();
  const resolvedTheme =
    colorMode === "dark-only" || (colorMode === "system" && runtimeTheme === "dark")
      ? "dark"
      : "light";

  return `seed-user-color-scheme-${resolvedTheme}`;
}

export function getSafeSeedClassName(colorMode: ColorMode) {
  try {
    const className = getSeedClassName({ colorMode });

    if (colorMode === "system" && getRuntimeTheme() === "dark") {
      return "seed-user-color-scheme-dark";
    }

    return className;
  } catch {
    return getFallbackSeedClassName(colorMode);
  }
}

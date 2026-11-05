import type { ReactNode } from "@lynx-js/react";
import { renderHook } from "@lynx-js/react/testing-library";
import { SafeAreaProvider } from "@seed-design/lynx-react-use-safe-area";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSafeArea } from "../hooks/useSafeArea";
import { useSeedClassName } from "../hooks/useSeedClassName";
import { resetDeprecatedGlobalPropWarnings } from "../utils/deprecated-global-props";
import { SeedProvider, useSeedContext } from "./SeedContext";

interface TestLynxGlobal {
  lynx?: { __globalProps?: Record<string, unknown> };
  lynxTestingEnv?: {
    backgroundThread: { globalThis: TestLynxGlobal };
    mainThread: { globalThis: TestLynxGlobal };
  };
}

function setGlobalProps(globalProps: Record<string, unknown>) {
  const env = (globalThis as unknown as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as unknown as TestLynxGlobal,
    env?.backgroundThread.globalThis,
    env?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    global.lynx = { ...global.lynx, __globalProps: globalProps };
  }
}

describe("useSeedContext", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setGlobalProps({});
    resetDeprecatedGlobalPropWarnings();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it("returns empty values without a provider or host global props", () => {
    const { result } = renderHook(() => useSeedContext());

    expect(result.current).toEqual({
      preferredColorScheme: undefined,
      preferredMotion: undefined,
      safeAreaInsets: undefined,
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("prefers provider values over deprecated global props without warning", () => {
    setGlobalProps({ theme: "light", motion: "preferred" });
    const insets = { top: 0, right: 0, bottom: 34, left: 0 };

    const { result } = renderHook(() => useSeedContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SeedProvider preferredColorScheme="dark" preferredMotion="reduced" safeAreaInsets={insets}>
          {children}
        </SeedProvider>
      ),
    });

    expect(result.current).toEqual({
      preferredColorScheme: "dark",
      preferredMotion: "reduced",
      safeAreaInsets: insets,
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("fills missing fields from deprecated global props and warns once per key", () => {
    setGlobalProps({
      theme: "DARK",
      motion: "reduced",
      safeAreaInsetTop: 47,
    });

    const { result, rerender } = renderHook(() => useSeedContext(), {
      wrapper: ({ children }: { children: ReactNode }) => <SeedProvider>{children}</SeedProvider>,
    });
    rerender();

    expect(result.current).toEqual({
      preferredColorScheme: "dark",
      preferredMotion: "reduced",
      safeAreaInsets: undefined,
    });
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      expect.stringContaining("lynx.__globalProps.theme"),
      expect.stringContaining("lynx.__globalProps.motion"),
    ]);
  });

  it("inherits omitted fields from an outer provider and nested safe area", () => {
    const outerInsets = { top: 47, right: 0, bottom: 34, left: 0 };
    const overlayInsets = { top: 0, right: 0, bottom: 0, left: 0 };

    const { result } = renderHook(() => useSeedContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SeedProvider
          preferredColorScheme="dark"
          preferredMotion="reduced"
          safeAreaInsets={outerInsets}
        >
          <SeedProvider preferredColorScheme="light">
            <SafeAreaProvider insets={overlayInsets}>{children}</SafeAreaProvider>
          </SeedProvider>
        </SeedProvider>
      ),
    });

    expect(result.current).toEqual({
      preferredColorScheme: "light",
      preferredMotion: "reduced",
      safeAreaInsets: overlayInsets,
    });
  });

  it("passes safeAreaInsets to useSafeArea", () => {
    const { result } = renderHook(() => useSafeArea(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SeedProvider safeAreaInsets={{ top: 47, right: 0, bottom: 0, left: 0 }}>
          {children}
        </SeedProvider>
      ),
    });

    expect(result.current).toEqual({
      safeAreaInsetTop: "47px",
      safeAreaInsetRight: "0px",
      safeAreaInsetBottom: "0px",
      safeAreaInsetLeft: "0px",
    });
  });

  it("keeps the same value when the provider receives equal inset literals", () => {
    let top = 47;
    const { result, rerender } = renderHook(() => useSeedContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SeedProvider safeAreaInsets={{ top, right: 0, bottom: 34, left: 0 }}>
          {children}
        </SeedProvider>
      ),
    });
    const first = result.current;

    rerender();
    expect(result.current).toBe(first);

    top = 0;
    rerender();
    expect(result.current.safeAreaInsets).toEqual({ top: 0, right: 0, bottom: 34, left: 0 });
  });
});

describe("useSeedClassName", () => {
  beforeEach(() => {
    setGlobalProps({});
    resetDeprecatedGlobalPropWarnings();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the provider color scheme and follows changes", () => {
    let scheme: "light" | "dark" = "dark";
    const { result, rerender } = renderHook(() => useSeedClassName(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SeedProvider preferredColorScheme={scheme}>{children}</SeedProvider>
      ),
    });

    expect(result.current).toBe("seed-user-color-scheme-dark");

    scheme = "light";
    rerender();
    expect(result.current).toBe("seed-user-color-scheme-light");
  });

  it("lets an explicit colorScheme option and colorMode win over the provider", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SeedProvider preferredColorScheme="dark">{children}</SeedProvider>
    );

    expect(
      renderHook(() => useSeedClassName({ colorScheme: "light" }), { wrapper }).result.current,
    ).toBe("seed-user-color-scheme-light");
    expect(
      renderHook(() => useSeedClassName({ colorMode: "light-only" }), { wrapper }).result.current,
    ).toBe("seed-user-color-scheme-light");
  });

  it("falls back to the deprecated theme global prop, then light", () => {
    setGlobalProps({ theme: "dark" });
    expect(renderHook(() => useSeedClassName()).result.current).toBe("seed-user-color-scheme-dark");

    setGlobalProps({});
    expect(renderHook(() => useSeedClassName()).result.current).toBe(
      "seed-user-color-scheme-light",
    );
  });
});

import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  getQueriesForElement,
  render,
  waitFor,
} from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as AppBar from "./AppBar.namespace";

type TestSystemInfo = { platform?: string };

interface TestLynxGlobal {
  SystemInfo?: TestSystemInfo;
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetBottom?: number;
    };
  };
  lynxTestingEnv?: {
    backgroundThread: {
      globalThis: TestLynxGlobal;
    };
    mainThread: {
      globalThis: TestLynxGlobal;
    };
  };
}

function getRenderedQueries() {
  return getQueriesForElement(getAppBarRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getAppBarRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-app-bar__root")) return root;

  const appBarRoot = root.querySelector<HTMLElement>(".seed-app-bar__root");
  if (!appBarRoot) {
    throw new Error("Expected AppBar root to exist.");
  }

  return appBarRoot;
}

function expectStyle(style: CSSStyleDeclaration, expected: Record<string, string>) {
  for (const [key, value] of Object.entries(expected)) {
    expect(style.getPropertyValue(key)).toBe(value);
  }
}

function setSystemInfo(systemInfo: TestSystemInfo | undefined) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv?.backgroundThread.globalThis,
    lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    if (systemInfo == null) {
      delete global.SystemInfo;
    } else {
      global.SystemInfo = systemInfo;
    }
  }
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv?.backgroundThread.globalThis,
    lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    global.lynx = {
      ...global.lynx,
      __globalProps: globalProps,
    };
  }
}

function stubPlatform(platform: string | undefined) {
  setSystemInfo(platform == null ? {} : { platform });
}

describe("AppBar", () => {
  afterEach(() => {
    setSystemInfo({ platform: "iOS" });
    setGlobalProps({});
    vi.unstubAllGlobals();
  });

  it("uses android theme by default on Android", () => {
    stubPlatform("Android");

    render(<AppBar.Root />);

    expect(getAppBarRoot()).toHaveClass("seed-app-bar__root--theme_android");
  });

  it("uses cupertino theme by default outside Android", () => {
    stubPlatform("iOS");

    render(<AppBar.Root />);

    expect(getAppBarRoot()).toHaveClass("seed-app-bar__root--theme_cupertino");
  });

  it("uses cupertino theme when SystemInfo.platform is unavailable", () => {
    stubPlatform(undefined);

    render(<AppBar.Root />);

    expect(getAppBarRoot()).toHaveClass("seed-app-bar__root--theme_cupertino");
  });

  it("lets explicit theme override the platform default", () => {
    stubPlatform("Android");

    render(<AppBar.Root theme="cupertino" />);

    expect(getAppBarRoot()).toHaveClass("seed-app-bar__root--theme_cupertino");
    expect(getAppBarRoot()).not.toHaveClass("seed-app-bar__root--theme_android");
  });

  it("applies safe area from useSafeArea to the root layout", () => {
    setGlobalProps({ safeAreaInsetTop: 47 });

    render(<AppBar.Root theme="cupertino" />);

    expectStyle(getAppBarRoot().style, {
      height: "calc(91px)",
      "padding-top": "47px",
    });
  });

  it("does not read the safe area CSS variable override as the JS layout source", () => {
    setGlobalProps({ safeAreaInsetTop: 47 });

    render(
      <AppBar.Root
        theme="cupertino"
        style={{ "--seed-safe-area-top": "0px" } as AppBar.RootProps["style"]}
      />,
    );

    expectStyle(getAppBarRoot().style, {
      height: "calc(91px)",
      "padding-top": "47px",
    });
  });

  it("keeps Cupertino title-only main centered in the safe-area adjusted bar", () => {
    setGlobalProps({ safeAreaInsetTop: 47 });

    render(
      <AppBar.Root theme="cupertino">
        <AppBar.Main>
          <AppBar.Title>Title</AppBar.Title>
        </AppBar.Main>
      </AppBar.Root>,
    );

    const main = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar-main__root");

    expect(main).toBeInTheDocument();
    expectStyle(main!.style, {
      top: "47px",
      bottom: "0px",
    });
  });

  it("renders slots with recipe class names", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton accessibility-label="Back" />
        </AppBar.Left>
        <AppBar.Main layout="withSubtitle">
          <AppBar.Title>Title</AppBar.Title>
          <AppBar.Subtitle>Subtitle</AppBar.Subtitle>
        </AppBar.Main>
        <AppBar.Right>
          <AppBar.Slot>
            <text>Done</text>
          </AppBar.Slot>
        </AppBar.Right>
      </AppBar.Root>,
    );

    const { getByText } = getRenderedQueries();
    const root = getAppBarRoot();

    expect(root.querySelector(".seed-app-bar__left")).toBeInTheDocument();
    expect(root.querySelector(".seed-app-bar__right")).toBeInTheDocument();
    expect(root.querySelector(".seed-app-bar__iconButton")).toBeInTheDocument();
    expect(root.querySelector(".seed-app-bar__custom")).toBeInTheDocument();
    expect(getByText("Title")).toHaveClass("seed-app-bar-main__title");
    expect(getByText("Subtitle")).toHaveClass("seed-app-bar-main__subtitle");
  });

  it("maps icon button labels to Lynx accessibility props", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton accessibility-label="Back" />
        </AppBar.Left>
      </AppBar.Root>,
    );

    const iconButton = getAppBarRoot().querySelector(".seed-app-bar__iconButton");

    expect(iconButton).toHaveAttribute("accessibility-label", "Back");
    expect(iconButton).toHaveAttribute("accessibility-element", "true");
    expect(iconButton).toHaveAttribute("accessibility-traits", "button");
  });

  it("updates centered title padding from left and right layout widths", async () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <text>Left</text>
        </AppBar.Left>
        <AppBar.Main>
          <AppBar.Title>Title</AppBar.Title>
        </AppBar.Main>
        <AppBar.Right>
          <text>Right</text>
        </AppBar.Right>
      </AppBar.Root>,
    );

    const root = getAppBarRoot();
    const main = root.querySelector(".seed-app-bar-main__root");
    const left = root.querySelector(".seed-app-bar__left");
    const right = root.querySelector(".seed-app-bar__right");

    if (!main || !left || !right) {
      throw new Error("Expected AppBar main, left, and right slots to exist.");
    }

    act(() => {
      fireEvent.layoutchange(left, { width: 48 });
      fireEvent.layoutchange(right, { width: 72 });
    });

    await waitFor(() => {
      expect(main).toHaveStyle({ paddingLeft: "72px", paddingRight: "72px" });
    });
  });

  it("applies leading bleed to the first icon button in the left slot", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton accessibility-label="Back" />
        </AppBar.Left>
      </AppBar.Root>,
    );

    const iconButton = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar__iconButton");
    expect(iconButton).toBeInTheDocument();
    expectStyle(iconButton!.style, { "margin-left": "var(--app-bar-icon-button-bleed)" });
    expect(iconButton!.style.getPropertyValue("margin-right")).toBe("");
  });

  it("applies trailing bleed to the last icon button in the right slot", () => {
    render(
      <AppBar.Root>
        <AppBar.Right>
          <AppBar.IconButton accessibility-label="Close" />
        </AppBar.Right>
      </AppBar.Root>,
    );

    const iconButton = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar__iconButton");
    expect(iconButton).toBeInTheDocument();
    expectStyle(iconButton!.style, { "margin-right": "var(--app-bar-icon-button-bleed)" });
    expect(iconButton!.style.getPropertyValue("margin-left")).toBe("");
  });

  it("only bleeds the trailing-most icon button when several are in the right slot", () => {
    render(
      <AppBar.Root>
        <AppBar.Right>
          <AppBar.IconButton accessibility-label="Search" />
          <AppBar.IconButton accessibility-label="Close" />
        </AppBar.Right>
      </AppBar.Root>,
    );

    const iconButtons = getAppBarRoot().querySelectorAll<HTMLElement>(".seed-app-bar__iconButton");
    expect(iconButtons).toHaveLength(2);
    // 선두(Search) 버튼은 가장자리가 아니므로 보정하지 않는다.
    expect(iconButtons[0].style.getPropertyValue("margin-left")).toBe("");
    expect(iconButtons[0].style.getPropertyValue("margin-right")).toBe("");
    // 마지막(Close) 버튼만 trailing 보정을 받는다.
    expectStyle(iconButtons[1].style, { "margin-right": "var(--app-bar-icon-button-bleed)" });
  });

  it("does not bleed a custom slot sitting at the slot edge", () => {
    render(
      <AppBar.Root>
        <AppBar.Right>
          <AppBar.Slot>
            <text>Done</text>
          </AppBar.Slot>
        </AppBar.Right>
      </AppBar.Root>,
    );

    const custom = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar__custom");
    expect(custom).toBeInTheDocument();
    expect(custom!.style.getPropertyValue("margin-left")).toBe("");
    expect(custom!.style.getPropertyValue("margin-right")).toBe("");
  });

  it("bleeds the trailing icon button but not a preceding custom slot", () => {
    render(
      <AppBar.Root>
        <AppBar.Right>
          <AppBar.Slot>
            <text>Done</text>
          </AppBar.Slot>
          <AppBar.IconButton accessibility-label="Close" />
        </AppBar.Right>
      </AppBar.Root>,
    );

    const root = getAppBarRoot();
    const custom = root.querySelector<HTMLElement>(".seed-app-bar__custom");
    const iconButton = root.querySelector<HTMLElement>(".seed-app-bar__iconButton");
    expect(custom!.style.getPropertyValue("margin-right")).toBe("");
    expectStyle(iconButton!.style, { "margin-right": "var(--app-bar-icon-button-bleed)" });
  });

  it("respects an explicitly provided edge over auto-injection", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton accessibility-label="Back" edge="trailing" />
        </AppBar.Left>
      </AppBar.Root>,
    );

    const iconButton = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar__iconButton");
    // Left 슬롯이지만 명시한 trailing이 유지되고 leading을 덮어쓰지 않는다.
    expectStyle(iconButton!.style, { "margin-right": "var(--app-bar-icon-button-bleed)" });
    expect(iconButton!.style.getPropertyValue("margin-left")).toBe("");
  });
});

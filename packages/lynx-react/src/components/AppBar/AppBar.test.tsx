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

function stubPlatform(platform: string | undefined) {
  setSystemInfo(platform == null ? {} : { platform });
}

describe("AppBar", () => {
  afterEach(() => {
    setSystemInfo({ platform: "iOS" });
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

  it("renders slots with recipe class names", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton aria-label="Back" />
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
});

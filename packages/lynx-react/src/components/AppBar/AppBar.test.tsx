import "@testing-library/jest-dom";
import { Fragment, useEffect } from "@lynx-js/react";
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

  it.each([
    "left",
    "right",
  ] as const)("bleeds both sides of a single button in the %s slot", (side) => {
    const Slot = side === "left" ? AppBar.Left : AppBar.Right;
    render(
      <AppBar.Root>
        <Slot>
          <AppBar.IconButton accessibility-label="Back" />
        </Slot>
      </AppBar.Root>,
    );
    const button = getAppBarRoot().querySelector(".seed-app-bar__iconButton");
    expect(button).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(button).toHaveClass("seed-app-bar__icon-button-edge-trailing");
  });

  it.each([
    "left",
    "right",
  ] as const)("bleeds only the outer sides of buttons in the %s slot", (side) => {
    const Slot = side === "left" ? AppBar.Left : AppBar.Right;
    render(
      <AppBar.Root>
        <Slot>
          <AppBar.IconButton accessibility-label="Search" />
          <AppBar.IconButton accessibility-label="Share" />
          <AppBar.IconButton accessibility-label="Close" />
        </Slot>
      </AppBar.Root>,
    );
    const buttons = getAppBarRoot().querySelectorAll(".seed-app-bar__iconButton");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(buttons[0]).not.toHaveClass("seed-app-bar__icon-button-edge-trailing");
    expect(buttons[1]).not.toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(buttons[1]).not.toHaveClass("seed-app-bar__icon-button-edge-trailing");
    expect(buttons[2]).not.toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(buttons[2]).toHaveClass("seed-app-bar__icon-button-edge-trailing");
  });

  it("updates both edges when a conditional sibling changes without remounting the button", () => {
    const mount = vi.fn();
    function WrappedButton() {
      useEffect(() => {
        mount();
      }, []);
      return <AppBar.IconButton accessibility-label="Back" />;
    }
    function Example({ showCustom }: { showCustom: boolean }) {
      return (
        <AppBar.Root>
          <AppBar.Left>
            <WrappedButton />
            {showCustom && (
              <AppBar.Slot>
                <text>Done</text>
              </AppBar.Slot>
            )}
          </AppBar.Left>
        </AppBar.Root>
      );
    }
    const { rerender } = render(<Example showCustom={false} />);
    const button = () => getAppBarRoot().querySelector(".seed-app-bar__iconButton");
    expect(button()).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(button()).toHaveClass("seed-app-bar__icon-button-edge-trailing");
    rerender(<Example showCustom />);
    expect(button()).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(button()).not.toHaveClass("seed-app-bar__icon-button-edge-trailing");
    rerender(<Example showCustom={false} />);
    expect(button()).toHaveClass("seed-app-bar__icon-button-edge-trailing");
    expect(mount).toHaveBeenCalledTimes(1);
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
    expect(iconButton).toHaveClass("seed-app-bar__icon-button-edge-trailing");
  });

  it.each([
    "leading",
    "trailing",
    "both",
  ] as const)("respects explicit edge=%s over automatic edges", (edge) => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton accessibility-label="Back" edge={edge} />
        </AppBar.Left>
      </AppBar.Root>,
    );
    const button = getAppBarRoot().querySelector(".seed-app-bar__iconButton");
    expect(button?.classList.contains("seed-app-bar__icon-button-edge-leading")).toBe(
      edge !== "trailing",
    );
    expect(button?.classList.contains("seed-app-bar__icon-button-edge-trailing")).toBe(
      edge !== "leading",
    );
  });

  it("preserves caller styles when automatic edge compensation applies", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton
            accessibility-label="Back"
            {...{ style: { width: "60px", opacity: 0.5 } }}
          />
        </AppBar.Left>
      </AppBar.Root>,
    );
    const button = getAppBarRoot().querySelector<HTMLElement>(".seed-app-bar__iconButton");
    expect(button).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expectStyle(button!.style, { width: "60px", opacity: "0.5" });
  });

  it("finds the physical edge through nested fragments and conditional children", () => {
    render(
      <AppBar.Root>
        <AppBar.Right>
          <Fragment>
            {false && <AppBar.IconButton accessibility-label="Hidden" />}
            <AppBar.IconButton accessibility-label="Search" />
            <Fragment key="actions">
              <AppBar.IconButton accessibility-label="Close" />
              {null}
              <Fragment />
            </Fragment>
          </Fragment>
        </AppBar.Right>
      </AppBar.Root>,
    );
    const buttons = getAppBarRoot().querySelectorAll<HTMLElement>(".seed-app-bar__iconButton");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(buttons[0]).not.toHaveClass("seed-app-bar__icon-button-edge-trailing");
    expect(buttons[1]).not.toHaveClass("seed-app-bar__icon-button-edge-leading");
    expect(buttons[1]).toHaveClass("seed-app-bar__icon-button-edge-trailing");
  });

  it("does not leak edge to native children or bleed buttons inside custom layout boxes", () => {
    render(
      <AppBar.Root>
        <AppBar.Left>
          <view id="native-edge">
            <AppBar.IconButton accessibility-label="Nested" />
          </view>
        </AppBar.Left>
        <AppBar.Right>
          <AppBar.Slot>
            <AppBar.IconButton accessibility-label="Custom" />
          </AppBar.Slot>
        </AppBar.Right>
      </AppBar.Root>,
    );
    const root = getAppBarRoot();
    expect(root.querySelector("#native-edge")).not.toHaveAttribute("edge");
    expect(root.querySelector("[edge]")).toBeNull();
    for (const button of root.querySelectorAll(".seed-app-bar__iconButton")) {
      expect(button).not.toHaveClass("seed-app-bar__icon-button-edge-leading");
      expect(button).not.toHaveClass("seed-app-bar__icon-button-edge-trailing");
    }
  });

  it("passes edge through wrapper components without changing their props or remounting", () => {
    const mount = vi.fn();
    const received = vi.fn();
    function WrappedButton(props: { edge?: "leading" | "trailing" }) {
      received(props);
      useEffect(() => {
        mount();
      }, []);
      return <AppBar.IconButton accessibility-label="Wrapped" {...props} />;
    }
    const { rerender } = render(
      <AppBar.Root>
        <AppBar.Left>
          <WrappedButton />
        </AppBar.Left>
      </AppBar.Root>,
    );
    expect(getAppBarRoot().querySelector(".seed-app-bar__iconButton")).toHaveClass(
      "seed-app-bar__icon-button-edge-leading",
    );
    expect(received.mock.lastCall?.[0]).not.toHaveProperty("edge");
    rerender(
      <AppBar.Root>
        <AppBar.Left>
          <WrappedButton edge="trailing" />
        </AppBar.Left>
      </AppBar.Root>,
    );
    expect(getAppBarRoot().querySelector(".seed-app-bar__iconButton")).toHaveClass(
      "seed-app-bar__icon-button-edge-trailing",
    );
    expect(mount).toHaveBeenCalledTimes(1);
  });
});

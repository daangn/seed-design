import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { SafeAreaProvider } from "@seed-design/lynx-react-use-safe-area";
import { describe, expect, it, vi } from "vitest";
import { AppBar, useAppBarContext } from "./index.js";

function node(selector: string): HTMLElement {
  const result = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!result) throw new Error(`Missing ${selector}`);
  return result;
}

function Probe() {
  const { safeAreaInsetTop, centeredTitlePaddingX } = useAppBarContext();
  return <text className="probe">{`top=${safeAreaInsetTop} x=${centeredTitlePaddingX}`}</text>;
}

describe("AppBar headless", () => {
  it("provides the host safe area without applying layout styles", () => {
    render(
      <SafeAreaProvider insets={{ top: 47, right: 0, bottom: 0, left: 0 }}>
        <AppBar.Root className="root">
          <Probe />
        </AppBar.Root>
      </SafeAreaProvider>,
    );

    expect(node(".probe")).toHaveTextContent("top=47px x=0px");
    expect(node(".root").getAttribute("style")).toBeNull();
  });

  it("uses the wider valid side width and calls the caller layout handler", () => {
    const onLeftLayout = vi.fn();
    render(
      <AppBar.Root>
        <AppBar.Left className="left" bindlayoutchange={onLeftLayout} />
        <Probe />
        <AppBar.Right className="right" />
      </AppBar.Root>,
    );

    act(() => {
      fireEvent.layoutchange(node(".left"), { detail: { width: 48 } });
      fireEvent.layoutchange(node(".right"), { width: 72 });
    });
    expect(node(".probe")).toHaveTextContent("x=72px");
    expect(onLeftLayout).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.layoutchange(node(".left"), { width: 96 });
      fireEvent.layoutchange(node(".right"), { width: Number.NaN });
    });
    expect(node(".probe")).toHaveTextContent("x=96px");

    act(() => {
      fireEvent.layoutchange(node(".left"), { width: -10 });
    });
    expect(node(".probe")).toHaveTextContent("x=72px");
  });

  it("exposes icon buttons as labelled native buttons", () => {
    render(
      <AppBar.Root>
        <AppBar.IconButton className="back" accessibility-label="뒤로" />
        <AppBar.IconButton
          className="decorative"
          accessibility-element={false}
          accessibility-traits="none"
        />
      </AppBar.Root>,
    );

    expect(node(".back")).toHaveAttribute("accessibility-element", "true");
    expect(node(".back")).toHaveAttribute("accessibility-traits", "button");
    expect(node(".back")).toHaveAttribute("accessibility-label", "뒤로");
    expect(node(".decorative")).toHaveAttribute("accessibility-element", "false");
    expect(node(".decorative")).toHaveAttribute("accessibility-traits", "none");
  });

  it("rejects side slots outside Root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<AppBar.Left />)).toThrow();
  });
});

import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { pullToRefreshPreventPull } from "./dom";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
  type PullToRefreshRootProps,
} from "./PullToRefresh";
import { usePullToRefreshContext, type UsePullToRefreshContext } from "./usePullToRefreshContext";

/** A gesture opens with `press`: the hook takes the pull origin from the contact. */
function press(root: HTMLElement, clientY: number, { scrollTop = 0, buttons = 1 } = {}) {
  root.scrollTop = scrollTop;
  fireEvent.pointerDown(root, { buttons, clientY });
}

function movePointer(root: HTMLElement, clientY: number, { scrollTop = 0, buttons = 1 } = {}) {
  root.scrollTop = scrollTop;
  fireEvent.pointerMove(root, { buttons, clientY });
}

function renderPullToRefresh(props: PullToRefreshRootProps = {}) {
  const values: Array<number | undefined> = [];
  const utils = render(
    <PullToRefreshRoot data-testid="root" threshold={100} displacementMultiplier={1} {...props}>
      <PullToRefreshIndicator data-testid="indicator">
        {(renderProps) => {
          values.push(renderProps.value);
          return <span data-testid="indicator-child">{String(renderProps.value)}</span>;
        }}
      </PullToRefreshIndicator>
      <PullToRefreshContent data-testid="content">
        <span data-testid="child">child</span>
        <span data-testid="no-pull" {...pullToRefreshPreventPull}>
          inner
        </span>
      </PullToRefreshContent>
    </PullToRefreshRoot>,
  );

  return { ...utils, root: utils.getByTestId("root"), values };
}

describe("PullToRefreshRoot", () => {
  it("renders a div carrying the state attributes and the scroll container styles", () => {
    const { root } = renderPullToRefresh();

    expect(root.tagName).toBe("DIV");
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(root).not.toHaveAttribute("data-ptr-dragging");
    expect(root.style.overflowY).toBe("auto");
  });

  it("forwards unrelated props and keeps the hook props off the DOM", () => {
    const { root } = renderPullToRefresh({ id: "ptr", className: "custom", role: "region" });

    expect(root).toHaveAttribute("id", "ptr");
    expect(root).toHaveAttribute("role", "region");
    expect(root).toHaveClass("custom");
    expect(root).not.toHaveAttribute("threshold");
    expect(root).not.toHaveAttribute("disabled");
  });

  it("composes the caller ref with the internal root ref", () => {
    // A callback ref records the node the caller actually received. Sampling
    // `useRef().current` during render would only ever see the pre-commit null.
    const seen: Array<HTMLElement | null> = [];

    const { getByTestId } = render(
      <PullToRefreshRoot
        data-testid="root"
        ref={(node) => {
          seen.push(node);
        }}
        threshold={100}
        displacementMultiplier={1}
      >
        <PullToRefreshContent data-testid="content">child</PullToRefreshContent>
      </PullToRefreshRoot>,
    );
    const root = getByTestId("root");

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);

    // The caller ref got the root element...
    expect(seen).toContain(root);
    // ...and the CSS variable proves the internal ref is attached alongside it.
    expect(root.style.getPropertyValue("--ptr-displacement")).toBe("40px");
  });

  it("renders the child element when asChild is set", () => {
    const { getByTestId } = render(
      <PullToRefreshRoot asChild threshold={100}>
        <section data-testid="root">
          <PullToRefreshContent data-testid="content">child</PullToRefreshContent>
        </section>
      </PullToRefreshRoot>,
    );
    const root = getByTestId("root");

    expect(root.tagName).toBe("SECTION");
    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("runs a caller pointer handler before the internal one", () => {
    const onPointerMove = mock(() => {});
    const { root } = renderPullToRefresh({ onPointerMove });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);

    expect(onPointerMove).toHaveBeenCalledTimes(2);
    expect(root).toHaveAttribute("data-ptr-state", "pulling");
  });

  it("lets a caller pointer handler suppress the pull with preventDefault", () => {
    const { root } = renderPullToRefresh({ onPointerMove: (e) => e.preventDefault() });

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);

    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });

  it("exposes a displayName", () => {
    expect(PullToRefreshRoot.displayName).toBe("PullToRefreshRoot");
    expect(PullToRefreshContent.displayName).toBe("PullToRefreshContent");
  });
});

describe("PullToRefreshIndicator", () => {
  it("renders the indicator props and hands the render props to children", () => {
    const { getByTestId, values } = renderPullToRefresh();
    const indicator = getByTestId("indicator");

    expect(indicator).toHaveAttribute("data-ptr-state", "idle");
    expect(indicator.style.pointerEvents).toBe("none");
    expect(getByTestId("indicator-child")).toHaveTextContent("0");
    expect(values).toEqual([0]);
  });

  it("updates the render props value as the pull grows", () => {
    const { root, getByTestId, values } = renderPullToRefresh();

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 150);

    expect(getByTestId("indicator-child")).toHaveTextContent("40");
    expect(values.at(-1)).toBe(40);
  });

  it("merges caller props onto the indicator element", () => {
    const { getByTestId } = renderPullToRefresh();

    expect(getByTestId("indicator")).toHaveAttribute("data-testid", "indicator");
  });
});

describe("PullToRefreshContent", () => {
  it("renders the state attributes and the idle transition", () => {
    const { getByTestId } = renderPullToRefresh();
    const content = getByTestId("content");

    expect(content).toHaveAttribute("data-ptr-state", "idle");
    expect(getByTestId("child")).toHaveTextContent("child");
  });

  it("switches to the dragging attributes while pulling", () => {
    const { root, getByTestId } = renderPullToRefresh();

    press(root, 100);
    movePointer(root, 110);

    expect(getByTestId("content")).toHaveAttribute("data-ptr-state", "pulling");
    expect(getByTestId("content")).toHaveAttribute("data-ptr-dragging", "");
  });

  it("renders the child element when asChild is set", () => {
    const { getByTestId } = render(
      <PullToRefreshRoot data-testid="root" threshold={100}>
        <PullToRefreshContent asChild>
          <section data-testid="content">child</section>
        </PullToRefreshContent>
      </PullToRefreshRoot>,
    );
    const content = getByTestId("content");

    expect(content.tagName).toBe("SECTION");
    expect(content).toHaveAttribute("data-ptr-state", "idle");
  });

  it("does not start a pull for a gesture inside a preventPull subtree", () => {
    const { root, getByTestId } = renderPullToRefresh();

    movePointer(root, 100);
    fireEvent.pointerMove(getByTestId("no-pull"), { buttons: 1, clientY: 110 });

    expect(root).toHaveAttribute("data-ptr-state", "idle");
  });
});

describe("usePullToRefreshContext", () => {
  it("throws when used outside a PullToRefreshRoot", () => {
    function StrictProbe() {
      usePullToRefreshContext();

      return null;
    }

    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => render(<StrictProbe />)).toThrow(
        "usePullToRefreshContext must be used within a PullToRefresh",
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it("returns null outside a PullToRefreshRoot when strict is false", () => {
    const onContext = mock((_context: UsePullToRefreshContext | null) => {});
    function LooseProbe() {
      onContext(usePullToRefreshContext({ strict: false }));

      return null;
    }

    render(<LooseProbe />);

    expect(onContext).toHaveBeenCalledWith(null);
  });

  it("returns the api inside a PullToRefreshRoot", () => {
    const onContext = mock((_context: UsePullToRefreshContext) => {});
    function Probe() {
      onContext(usePullToRefreshContext());

      return null;
    }

    render(
      <PullToRefreshRoot data-testid="root" threshold={100}>
        <Probe />
      </PullToRefreshRoot>,
    );

    expect(onContext).toHaveBeenCalledTimes(1);
    expect(onContext.mock.calls[0][0].state).toBe("idle");
  });
});

describe("PullToRefresh composition", () => {
  it("drives every part through a full refresh gesture", async () => {
    let settle = () => {};
    const onPtrRefresh = mock(
      () =>
        new Promise<void>((resolve) => {
          settle = () => resolve();
        }),
    );
    const { root, getByTestId, values } = renderPullToRefresh({ onPtrRefresh });
    const content = getByTestId("content");

    press(root, 100);
    movePointer(root, 110);
    movePointer(root, 250);
    expect(root).toHaveAttribute("data-ptr-state", "ready");
    expect(content).toHaveAttribute("data-ptr-state", "ready");

    fireEvent.pointerUp(root);
    expect(root).toHaveAttribute("data-ptr-state", "loading");
    expect(getByTestId("indicator-child")).toHaveTextContent("undefined");

    await act(async () => settle());
    expect(root).toHaveAttribute("data-ptr-state", "idle");
    expect(values.at(-1)).toBe(0);
  });
});

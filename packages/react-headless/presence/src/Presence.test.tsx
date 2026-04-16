import { render, act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "bun:test";
import * as React from "react";
import { Presence } from "./Presence";

function PresenceHarness({
  present,
  lazyMount = false,
  unmountOnExit = true,
}: {
  present: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
}) {
  return (
    <Presence present={present} lazyMount={lazyMount} unmountOnExit={unmountOnExit}>
      <div data-testid="content">Content</div>
    </Presence>
  );
}

describe("Presence", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  describe("basic", () => {
    it("renders children when present is true", () => {
      const { queryByTestId } = render(<PresenceHarness present={true} />);
      expect(queryByTestId("content")).not.toBeNull();
    });

    it("renders children when present is false and unmountOnExit is true (never been present)", () => {
      // unmountOnExit only applies AFTER the component has been present at least once.
      // To prevent initial render, use lazyMount.
      const { queryByTestId } = render(<PresenceHarness present={false} unmountOnExit={true} />);
      expect(queryByTestId("content")).not.toBeNull();
    });

    it("renders children when present is false and unmountOnExit is false", () => {
      const { queryByTestId } = render(<PresenceHarness present={false} unmountOnExit={false} />);
      expect(queryByTestId("content")).not.toBeNull();
    });
  });
  describe("lazyMount", () => {
    it("does not render initially when lazyMount is true and present is false", () => {
      const { queryByTestId } = render(<PresenceHarness present={false} lazyMount={true} />);
      expect(queryByTestId("content")).toBeNull();
    });

    it("renders when lazyMount is true and present becomes true", () => {
      const { queryByTestId, rerender } = render(
        <PresenceHarness present={false} lazyMount={true} />,
      );
      expect(queryByTestId("content")).toBeNull();

      rerender(<PresenceHarness present={true} lazyMount={true} />);
      expect(queryByTestId("content")).not.toBeNull();
    });

    it("renders initially when lazyMount is false even if present is false", () => {
      const { queryByTestId } = render(
        <PresenceHarness present={false} lazyMount={false} unmountOnExit={false} />,
      );
      expect(queryByTestId("content")).not.toBeNull();
    });
  });
  describe("unmountOnExit", () => {
    it("unmounts when present changes from true to false (no animation)", () => {
      const { queryByTestId, rerender } = render(<PresenceHarness present={true} />);
      expect(queryByTestId("content")).not.toBeNull();

      rerender(<PresenceHarness present={false} unmountOnExit={true} />);
      expect(queryByTestId("content")).toBeNull();
    });

    it("keeps mounted when present changes from true to false with unmountOnExit false", () => {
      const { queryByTestId, rerender } = render(
        <PresenceHarness present={true} unmountOnExit={false} />,
      );
      expect(queryByTestId("content")).not.toBeNull();

      rerender(<PresenceHarness present={false} unmountOnExit={false} />);
      expect(queryByTestId("content")).not.toBeNull();
    });
  });
  describe("re-open", () => {
    it("remounts after unmount when present becomes true again", () => {
      const { queryByTestId, rerender } = render(
        <PresenceHarness present={true} unmountOnExit={true} />,
      );
      expect(queryByTestId("content")).not.toBeNull();

      rerender(<PresenceHarness present={false} unmountOnExit={true} />);
      expect(queryByTestId("content")).toBeNull();

      rerender(<PresenceHarness present={true} unmountOnExit={true} />);
      expect(queryByTestId("content")).not.toBeNull();
    });
  });
});

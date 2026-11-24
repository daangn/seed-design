import "@testing-library/jest-dom";
import { runOnBackground } from "@lynx-js/react";
import * as React from "@lynx-js/react";
import {
  fireEvent,
  getQueriesForElement,
  render,
  waitSchedule,
} from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "./index";

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function expectRefOn(ref: unknown, element: Element | null) {
  // Lynx ref는 native node 대신 RefProxy이고, 붙은 요소에 `react-ref-<refAttr>` 속성을 남긴다.
  const { refAttr } = ref as { refAttr: number[] };
  expect(element).toHaveAttribute(`react-ref-${refAttr.join("-")}`);
}

describe("Badge", () => {
  it("passes Root variants to every slot", () => {
    render(
      <Badge.Root size="large" variant="outline" tone="brand">
        <Badge.Prefix>인증</Badge.Prefix>
        <Badge.Label>추천</Badge.Label>
        <Badge.Action>닫기</Badge.Action>
      </Badge.Root>,
    );

    const root = getRenderedRoot().querySelector(".seed-badge__root");
    const prefix = getRenderedQueries().getByText("인증");
    const label = getRenderedQueries().getByText("추천");
    const action = getRenderedQueries().getByText("닫기");

    for (const [slot, element] of [
      ["root", root],
      ["prefix", prefix],
      ["label", label],
      ["action", action],
    ] as const) {
      expect(element).toHaveClass(`seed-badge__${slot}--tone_brand-variant_outline`);
    }
  });

  it("preserves each slot's className, inline style and ref", () => {
    const rootRef = React.createRef<unknown>();
    const prefixRef = React.createRef<unknown>();
    const labelRef = React.createRef<unknown>();
    const actionRef = React.createRef<unknown>();

    render(
      <Badge.Root ref={rootRef} className="user-root" style={{ opacity: 0.9 }}>
        <Badge.Prefix ref={prefixRef} className="user-prefix" style={{ opacity: 0.8 }}>
          인증
        </Badge.Prefix>
        <Badge.Label ref={labelRef} className="user-label" style={{ opacity: 0.7 }}>
          추천
        </Badge.Label>
        <Badge.Action ref={actionRef} className="user-action" style={{ opacity: 0.6 }}>
          닫기
        </Badge.Action>
      </Badge.Root>,
    );

    const root = getRenderedRoot().querySelector(".user-root");
    const prefix = getRenderedQueries().getByText("인증");
    const label = getRenderedQueries().getByText("추천");
    const action = getRenderedQueries().getByText("닫기");

    for (const [element, className, opacity, ref] of [
      [root, "user-root", "0.9", rootRef],
      [prefix, "user-prefix", "0.8", prefixRef],
      [label, "user-label", "0.7", labelRef],
      [action, "user-action", "0.6", actionRef],
    ] as const) {
      expect(element).toHaveClass(className);
      expect(element).toHaveStyle({ opacity });
      expectRefOn(ref.current, element);
    }
  });

  it("forwards native text props to Label", () => {
    render(
      <Badge.Root>
        <Badge.Label id="badge-label" text-maxline="2">
          추천
        </Badge.Label>
      </Badge.Root>,
    );

    const label = getRenderedQueries().getByText("추천");
    expect(label).toHaveAttribute("id", "badge-label");
    expect(label).toHaveAttribute("text-maxline", "2");
  });

  it("exposes native accessibility defaults and the supplied label on Action", () => {
    render(
      <Badge.Root>
        <Badge.Action accessibility-label="알림 닫기">닫기</Badge.Action>
      </Badge.Root>,
    );

    const action = getRenderedQueries().getByText("닫기");
    expect(action).toHaveAttribute("accessibility-element", "true");
    expect(action).toHaveAttribute("accessibility-traits", "button");
    expect(action).toHaveAttribute("accessibility-label", "알림 닫기");
  });

  it("rejects Prefix and Action outside Badge.Root", () => {
    expect(() => render(<Badge.Prefix>인증</Badge.Prefix>)).toThrow();
    expect(() => render(<Badge.Action>닫기</Badge.Action>)).toThrow();
  });

  it("allows native accessibility defaults to be overridden", () => {
    render(
      <Badge.Root>
        <Badge.Action accessibility-element={false} accessibility-traits="none">
          닫기
        </Badge.Action>
      </Badge.Root>,
    );

    const action = getRenderedQueries().getByText("닫기");
    expect(action).toHaveAttribute("accessibility-element", "false");
    expect(action).toHaveAttribute("accessibility-traits", "none");
  });

  it("delivers a supplied main-thread touchstart handler alongside scale feedback", async () => {
    const report = vi.fn();
    function Example() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(report)();
      }
      return (
        <Badge.Root>
          <Badge.Action main-thread:bindtouchstart={handleTouchStart}>닫기</Badge.Action>
        </Badge.Root>
      );
    }

    const { container } = render(<Example />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const action = container.querySelector(".seed-badge__action");
    expect(action).not.toBeNull();
    fireEvent.touchstart(action as Element, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
  });
});

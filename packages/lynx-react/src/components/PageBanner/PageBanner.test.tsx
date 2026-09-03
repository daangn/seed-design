import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "@lynx-js/react";

import type { LynxViewProps } from "../../types";

vi.mock("../ScaleFeedback", async () => {
  const { cloneElement } = await import("@lynx-js/react");

  return {
    ScaleFeedback: ({
      children,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
    }: {
      children: ReactElement<LynxViewProps>;
      onTouchStart?: () => void;
      onTouchEnd?: () => void;
      onTouchCancel?: () => void;
    }) =>
      cloneElement(children, {
        bindtouchstart: onTouchStart,
        bindtouchend: onTouchEnd,
        bindtouchcancel: onTouchCancel,
      }),
  };
});

import * as PageBanner from "./PageBanner.namespace";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getPageBannerRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-page-banner__root")) return root;

  const pageBannerRoot = root.querySelector<HTMLElement>(".seed-page-banner__root");
  if (!pageBannerRoot) {
    throw new Error("Expected PageBanner root to exist.");
  }

  return pageBannerRoot;
}

describe("PageBanner", () => {
  it("renders compound slots with the default neutral weak style", () => {
    render(
      <PageBanner.Root>
        <PageBanner.Content>
          <PageBanner.Body>
            <PageBanner.Title>Title</PageBanner.Title>
            <PageBanner.Description>Description</PageBanner.Description>
          </PageBanner.Body>
          <PageBanner.Button>Action</PageBanner.Button>
        </PageBanner.Content>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );

    const root = getPageBannerRoot();

    expect(root).toHaveClass("seed-page-banner__root--tone_neutral-variant_weak");
    expect(root.querySelector(".seed-page-banner__content")?.tagName.toLowerCase()).toBe("view");
    expect(root.querySelector(".seed-page-banner__body")?.tagName.toLowerCase()).toBe("text");
    expect(root.querySelector(".seed-page-banner__title")).toHaveClass(
      "seed-page-banner__title--tone_neutral-variant_weak",
    );
    expect(root.querySelector(".seed-page-banner__description")).toHaveClass(
      "seed-page-banner__description--tone_neutral-variant_weak",
    );
    expect(root.querySelector(".seed-page-banner__button")).toHaveAttribute(
      "accessibility-traits",
      "button",
    );
  });

  it("tracks pressed state and maps actionable accessibility", () => {
    const onTap = vi.fn();

    render(
      <PageBanner.Root tone="positive" variant="solid" bindtap={onTap}>
        <PageBanner.Content>
          <PageBanner.Body>
            <PageBanner.Description>Actionable</PageBanner.Description>
          </PageBanner.Body>
        </PageBanner.Content>
      </PageBanner.Root>,
    );

    const root = getPageBannerRoot();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");

    fireEvent.touchstart(root, {});
    expect(root).toHaveClass("seed-page-banner__root--tone_positive-variant_solid-pressed_true");

    fireEvent.tap(root);
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("dismisses an uncontrolled banner and composes the close tap handler", () => {
    const onTap = vi.fn();
    const onDismiss = vi.fn();

    render(
      <PageBanner.Root onDismiss={onDismiss}>
        <PageBanner.CloseButton bindtap={onTap} accessibility-label="Close" />
      </PageBanner.Root>,
    );

    const closeButton = getPageBannerRoot().querySelector(".seed-page-banner__closeButton");
    if (!closeButton) throw new Error("Expected close button to exist.");

    fireEvent.tap(closeButton);

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getRenderedRoot().querySelector(".seed-page-banner__root")).not.toBeInTheDocument();
  });

  it("notifies without hiding a controlled banner", () => {
    const onDismiss = vi.fn();

    render(
      <PageBanner.Root open onDismiss={onDismiss}>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );

    const closeButton = getPageBannerRoot().querySelector(".seed-page-banner__closeButton");
    if (!closeButton) throw new Error("Expected close button to exist.");

    fireEvent.tap(closeButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getPageBannerRoot()).toBeInTheDocument();
  });
});

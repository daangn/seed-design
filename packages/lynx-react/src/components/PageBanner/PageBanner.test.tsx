import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

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
    const closeButton = root.querySelector(".seed-page-banner__closeButton");
    expect(closeButton?.parentElement).toBe(root);
    expect(closeButton).toHaveAttribute("flatten", "false");
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

  it("scales the actionable content group without its background or independent close button", () => {
    render(
      <PageBanner.Root bindtap={() => {}}>
        <React.Fragment key="fragment-slots">
          <view id="prefix" />
          <PageBanner.Content>
            <PageBanner.Description>Body</PageBanner.Description>
          </PageBanner.Content>
          <view id="suffix" />
          <PageBanner.CloseButton accessibility-label="Close" />
        </React.Fragment>
      </PageBanner.Root>,
    );
    const root = getPageBannerRoot();
    const target = root.querySelector(".seed-page-banner__scaleContent");
    const close = root.querySelector(".seed-page-banner__closeButton");
    expect(target).toHaveAttribute("flatten", "false");
    expect(target?.parentElement).toBe(root);
    expect(target?.querySelector("#prefix")).toBeTruthy();
    expect(target?.querySelector("#suffix")).toBeTruthy();
    expect(target?.contains(close)).toBe(false);
    expect(close?.parentElement).toBe(root);
  });

  it("measures the action text itself and prevents action taps from reaching the banner", () => {
    const onBanner = vi.fn();
    const onAction = vi.fn();
    render(
      <PageBanner.Root bindtap={onBanner}>
        <PageBanner.Content>
          <PageBanner.Button bindtap={onAction}>Action</PageBanner.Button>
        </PageBanner.Content>
      </PageBanner.Root>,
    );
    const root = getPageBannerRoot();
    const action = root.querySelector(".seed-page-banner__button") as HTMLElement;
    expect(action).toHaveAttribute("flatten", "false");
    expect(action.parentElement).toHaveClass("seed-page-banner__content");
    fireEvent.tap(action, { eventType: "catchEvent" });
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onBanner).not.toHaveBeenCalled();
  });

  it("does not activate the banner when its independent close action is tapped", () => {
    const onBanner = vi.fn();
    const onDismiss = vi.fn();
    render(
      <PageBanner.Root open bindtap={onBanner} onDismiss={onDismiss}>
        <PageBanner.Content>
          <PageBanner.Description>Body</PageBanner.Description>
        </PageBanner.Content>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );
    const root = getPageBannerRoot();
    fireEvent.tap(root.querySelector(".seed-page-banner__closeButton") as HTMLElement, {
      eventType: "catchEvent",
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onBanner).not.toHaveBeenCalled();
  });

  it("bridges banner feedback and preserves independent Main Thread handlers", async () => {
    function Example({ report }: { report: () => void }) {
      function handleTouch() {
        "main thread";
        runOnBackground(report)();
      }
      return (
        <PageBanner.Root open bindtap={() => {}}>
          <PageBanner.Content>
            <PageBanner.Description>Body</PageBanner.Description>
          </PageBanner.Content>
          <PageBanner.CloseButton
            accessibility-label="Close"
            main-thread:bindtouchstart={handleTouch}
          />
        </PageBanner.Root>
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const root = container.querySelector(".seed-page-banner__root");
    const close = container.querySelector(".seed-page-banner__closeButton");
    if (!root || !close) throw new Error("Expected banner and close button");
    fireEvent.touchstart(close, { eventType: "catchEvent" });
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
    expect(root.className).toContain("__root--pressed_false");
    expect(close.className).toContain("closeButtonPressed_true");
    fireEvent.touchend(close, { eventType: "catchEvent" });
    await waitSchedule();
    expect(close.className).not.toContain("closeButtonPressed_true");
    fireEvent.touchstart(root, {});
    await waitSchedule();
    expect(root.className).toContain("__root--pressed_true");
    fireEvent.touchcancel(root, {});
    await waitSchedule();
    expect(root.className).toContain("__root--pressed_false");
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

    fireEvent.tap(closeButton, { eventType: "catchEvent" });

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

    fireEvent.tap(closeButton, { eventType: "catchEvent" });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getPageBannerRoot()).toBeInTheDocument();
  });
});

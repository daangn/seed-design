import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { PrefixIcon, SuffixIcon } from "../Icon";
import * as PageBanner from "./PageBanner.namespace";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => {
  return <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} />;
});
TestIcon.displayName = "TestIcon";

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

function getRequiredElement(selector: string) {
  const element = getPageBannerRoot().querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Expected ${selector} to exist.`);
  return element;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PageBanner", () => {
  it("renders every compound slot with the default variants", () => {
    render(
      <PageBanner.Root>
        <PrefixIcon icon={<TestIcon />} />
        <PageBanner.Content>
          <PageBanner.Body>
            <PageBanner.Title>Title</PageBanner.Title>
            <PageBanner.Description>Description</PageBanner.Description>
          </PageBanner.Body>
          <PageBanner.Button>Action</PageBanner.Button>
        </PageBanner.Content>
        <PageBanner.CloseButton accessibility-label="Close">
          <SuffixIcon icon={<TestIcon />} />
        </PageBanner.CloseButton>
      </PageBanner.Root>,
    );

    const root = getPageBannerRoot();

    expect(root.tagName.toLowerCase()).toBe("view");
    expect(root).toHaveClass("seed-page-banner__root--tone_neutral-variant_weak");
    expect(getRequiredElement(".seed-page-banner__content").tagName.toLowerCase()).toBe("view");
    expect(getRequiredElement(".seed-page-banner__body").tagName.toLowerCase()).toBe("text");
    expect(getRequiredElement(".seed-page-banner__title")).toHaveClass(
      "seed-page-banner__title--tone_neutral-variant_weak",
    );
    expect(getRequiredElement(".seed-page-banner__description")).toHaveClass(
      "seed-page-banner__description--tone_neutral-variant_weak",
    );
    expect(getRequiredElement(".seed-page-banner__button")).toHaveAttribute(
      "accessibility-traits",
      "button",
    );
    expect(getRequiredElement(".seed-prefix-icon")).toHaveClass("seed-page-banner__prefixIcon");
    expect(getRequiredElement(".seed-suffix-icon")).toHaveClass("seed-page-banner__closeIcon");
  });

  it("applies an explicit tone and variant to visual slots", () => {
    render(
      <PageBanner.Root tone="critical" variant="solid">
        <PageBanner.Content>
          <PageBanner.Body>
            <PageBanner.Title>Title</PageBanner.Title>
            <PageBanner.Description>Description</PageBanner.Description>
          </PageBanner.Body>
          <PageBanner.Button>Action</PageBanner.Button>
        </PageBanner.Content>
      </PageBanner.Root>,
    );

    expect(getPageBannerRoot()).toHaveClass("seed-page-banner__root--tone_critical-variant_solid");
    expect(getRequiredElement(".seed-page-banner__title")).toHaveClass(
      "seed-page-banner__title--tone_critical-variant_solid",
    );
    expect(getRequiredElement(".seed-page-banner__button")).toHaveClass(
      "seed-page-banner__button--tone_critical-variant_solid",
    );
  });

  it("applies the magic gradient class to the weak variant", () => {
    render(<PageBanner.Root tone="magic" variant="weak" />);

    expect(getPageBannerRoot()).toHaveClass("seed-page-banner__root--tone_magic-variant_weak");
  });

  it("warns for the unsupported magic solid combination", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<PageBanner.Root tone="magic" variant="solid" />);

    expect(error).toHaveBeenCalledWith(
      '`magic` tone is not available for `solid` variant in PageBanner components. Please use variant="weak" or a different tone instead.',
    );
  });

  it("tracks root, button, and close button pressed styles independently", () => {
    render(
      <PageBanner.Root tone="positive" bindtap={() => undefined}>
        <PageBanner.Content>
          <PageBanner.Button>Action</PageBanner.Button>
        </PageBanner.Content>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );

    const root = getPageBannerRoot();
    const button = getRequiredElement(".seed-page-banner__button");
    const closeButton = getRequiredElement(".seed-page-banner__closeButton");

    fireEvent.touchstart(root, {});
    expect(root).toHaveClass("seed-page-banner__root--tone_positive-variant_weak-rootPressed_true");
    expect(button).not.toHaveClass("seed-page-banner__button--buttonPressed_true");
    fireEvent.touchend(root, {});

    fireEvent.touchstart(button, {});
    expect(button).toHaveClass("seed-page-banner__button--buttonPressed_true");
    expect(closeButton).not.toHaveClass("seed-page-banner__closeButton--closeButtonPressed_true");
    fireEvent.touchend(button, {});

    fireEvent.touchstart(closeButton, {});
    expect(closeButton).toHaveClass("seed-page-banner__closeButton--closeButtonPressed_true");
  });

  it("maps actionable accessibility and invokes the root tap handler", () => {
    const onTap = vi.fn();

    render(
      <PageBanner.Root bindtap={onTap} accessibility-label="Open details">
        <PageBanner.Content />
      </PageBanner.Root>,
    );

    const root = getPageBannerRoot();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");
    expect(root).toHaveAttribute("accessibility-label", "Open details");

    fireEvent.tap(root);
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("supports uncontrolled and controlled dismiss state", () => {
    const uncontrolledDismiss = vi.fn();
    const { unmount } = render(
      <PageBanner.Root onDismiss={uncontrolledDismiss}>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );

    fireEvent.tap(getRequiredElement(".seed-page-banner__closeButton"));
    expect(uncontrolledDismiss).toHaveBeenCalledTimes(1);
    expect(getRenderedRoot().querySelector(".seed-page-banner__root")).not.toBeInTheDocument();

    unmount();

    const controlledDismiss = vi.fn();
    render(
      <PageBanner.Root open onDismiss={controlledDismiss}>
        <PageBanner.Content>
          <PageBanner.Body>
            <PageBanner.Description>Controlled</PageBanner.Description>
          </PageBanner.Body>
        </PageBanner.Content>
        <PageBanner.CloseButton accessibility-label="Close" />
      </PageBanner.Root>,
    );

    fireEvent.tap(getRequiredElement(".seed-page-banner__closeButton"));
    expect(controlledDismiss).toHaveBeenCalledTimes(1);
    expect(getQueriesForElement(getRenderedRoot()).getByText("Controlled")).toBeInTheDocument();
  });

  it("composes the close button tap handler with dismiss", () => {
    const onTap = vi.fn();
    const onDismiss = vi.fn();

    render(
      <PageBanner.Root onDismiss={onDismiss}>
        <PageBanner.CloseButton bindtap={onTap} accessibility-label="Close" />
      </PageBanner.Root>,
    );

    fireEvent.tap(getRequiredElement(".seed-page-banner__closeButton"));

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("warns when an accessible close button has no label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    render(
      <PageBanner.Root>
        <PageBanner.CloseButton />
      </PageBanner.Root>,
    );

    expect(warn).toHaveBeenCalledWith(
      "PageBannerCloseButton requires `accessibility-label` for accessibility.",
    );
  });

  it("does not render when defaultOpen is false", () => {
    render(<PageBanner.Root defaultOpen={false} />);

    expect(getRenderedRoot().querySelector(".seed-page-banner__root")).not.toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type * as React from "react";
import type { ContentPlaceholderAssetType } from "./ContentPlaceholder";
import {
  ContentPlaceholderAsset,
  ContentPlaceholderContainer,
  ContentPlaceholderRoot,
} from "./ContentPlaceholder";

const contentPlaceholderAssetTypes: ContentPlaceholderAssetType[] = [
  "default",
  "coupon",
  "car",
  "realty",
  "food",
  "image",
  "group",
  "post",
  "localProfile",
  "buySell",
  "jobs",
];

function renderContentPlaceholderAsset(
  props: React.ComponentProps<typeof ContentPlaceholderAsset> = {},
) {
  return render(
    <ContentPlaceholderRoot>
      <ContentPlaceholderContainer>
        <ContentPlaceholderAsset {...props} />
      </ContentPlaceholderContainer>
    </ContentPlaceholderRoot>,
  );
}

describe("ContentPlaceholder.Asset", () => {
  for (const type of contentPlaceholderAssetTypes) {
    it(`renders \`${type}\` preset icon`, () => {
      const { container } = renderContentPlaceholderAsset({ type });

      const presetIcon = container.querySelector(`[data-seed-content-placeholder-type="${type}"]`);

      expect(presetIcon).toBeInTheDocument();
    });
  }

  it("renders custom svg asset", () => {
    const { getByTestId, container } = renderContentPlaceholderAsset({
      svg: <svg data-testid="custom-asset" viewBox="0 0 16 16" />,
    });

    expect(getByTestId("custom-asset")).toBeInTheDocument();
    expect(container.querySelector("[data-seed-content-placeholder-type]")).toBeNull();
  });

  it("renders default logo asset when no props are provided", () => {
    const { container } = renderContentPlaceholderAsset();

    const defaultPresetIcon = container.querySelector(
      '[data-seed-content-placeholder-type="default"]',
    );

    expect(defaultPresetIcon).toBeInTheDocument();
  });

  it("throws in development when `type` and `svg` are used together", () => {
    const previousConsoleError = console.error;
    console.error = () => {};

    try {
      const invalidProps = {
        type: "image",
        svg: <svg viewBox="0 0 16 16" />,
      } as unknown as React.ComponentProps<typeof ContentPlaceholderAsset>;

      expect(() => renderContentPlaceholderAsset(invalidProps)).toThrow(
        "ContentPlaceholder.Asset: `type` and `svg` cannot be used together.",
      );
    } finally {
      console.error = previousConsoleError;
    }
  });
});

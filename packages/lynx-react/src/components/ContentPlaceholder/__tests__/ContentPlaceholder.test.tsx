import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { LynxIconElementProps } from "../../../types";
import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { Icon } from "../../Icon";
import { ContentPlaceholderAsset, ContentPlaceholderRoot } from "../ContentPlaceholder";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} src="icon.png" mode="aspectFit" />
));
TestIcon.displayName = "TestIcon";

function getRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected a rendered placeholder.");
  return root;
}

describe("ContentPlaceholder", () => {
  it("preserves a custom image's source, tint, sizing, and load handler", () => {
    const onLoad = vi.fn();
    render(
      <ContentPlaceholderRoot style={{ width: "240px", height: "120px" }}>
        <ContentPlaceholderAsset>
          <image
            src="photo.png"
            mode="aspectFit"
            tint-color="#ff6600"
            style={{ width: "100%", height: "100%" }}
            bindload={onLoad}
          />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );

    const image = getRoot().querySelector("image");
    expect(image).toHaveAttribute("src", "photo.png");
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveAttribute("tint-color", "#ff6600");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
    const init = { eventType: "bindEvent", eventName: "load", detail: {} };
    const event = createEvent("bindEvent:load", image!, init);
    Object.assign(event, init);
    act(() => {
      fireEvent(image!, event);
    });
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("lets the public Icon fill the asset while preserving source properties", () => {
    render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset>
          <Icon icon={<TestIcon />} />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );

    const image = getRoot().querySelector("image");
    expect(image).toHaveAttribute("src", "icon.png");
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });
});

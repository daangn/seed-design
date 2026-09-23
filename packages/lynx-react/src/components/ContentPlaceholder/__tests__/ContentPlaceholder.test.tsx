import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import type { MainThread, IntrinsicElements } from "@lynx-js/types";
import type { LynxIconElementProps } from "../../../types";
import { act, createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { contentPlaceholderPresets } from "../presets";
import { ContentPlaceholderAsset, ContentPlaceholderRoot } from "../ContentPlaceholder";

const TestIcon = React.forwardRef<
  MainThread.Element,
  LynxIconElementProps & Pick<IntrinsicElements["image"], "binduiappear" | "tint-color">
>((props, ref) => (
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
    if (!image) throw new Error("Expected an asset image.");
    expect(image).toHaveAttribute("src", "photo.png");
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveAttribute("tint-color", "#ff6600");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
    const init = { eventType: "bindEvent", eventName: "load", detail: {} };
    const event = createEvent("bindEvent:load", image, init);
    Object.assign(event, init);
    act(() => {
      fireEvent(image, event);
    });
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("sizes a direct icon without an Icon wrapper and retains custom styles", () => {
    render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset>
          <TestIcon style={{ width: "24px", height: "24px", opacity: 0.5 }} />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelector("image")).toHaveStyle({
      width: "100%",
      height: "100%",
      opacity: "0.5",
    });
  });

  it.each(
    Object.keys(contentPlaceholderPresets) as Array<keyof typeof contentPlaceholderPresets>,
  )("renders %s with precolored theme assets on the first render", (type) => {
    render(
      <ContentPlaceholderRoot type={type}>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    const images = getRoot().querySelectorAll("image");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", contentPlaceholderPresets[type].light);
    expect(images[1]).toHaveAttribute("src", contentPlaceholderPresets[type].dark);
    for (const image of images) expect(image.getAttribute("tint-color")).toBeNull();
  });

  it("uses default preset and updates the selected type", async () => {
    const { rerender } = render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelector("image")).toHaveAttribute(
      "src",
      contentPlaceholderPresets.default.light,
    );
    rerender(
      <ContentPlaceholderRoot type="car">
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    await waitSchedule();
    expect(getRoot().querySelector("image")).toHaveAttribute(
      "src",
      contentPlaceholderPresets.car.light,
    );
  });

  it("keeps the caller's tint on first render, appearance and updates without adding a preset", async () => {
    const appear = vi.fn();
    const Example = ({ tint }: { tint: string }) => (
      <ContentPlaceholderRoot type="car">
        <ContentPlaceholderAsset>
          <TestIcon tint-color={tint} binduiappear={appear} />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>
    );
    const { rerender } = render(<Example tint="#ff6600" />);
    const image = getRoot().querySelector("image");
    if (!image) throw new Error("Expected custom image");
    expect(getRoot().querySelectorAll("image")).toHaveLength(1);
    expect(image).toHaveAttribute("tint-color", "#ff6600");
    const init = { eventType: "bindEvent", eventName: "uiappear", detail: {} };
    const event = createEvent("bindEvent:uiappear", image, init);
    Object.assign(event, init);
    act(() => {
      fireEvent(image, event);
    });
    await waitSchedule();
    expect(appear).toHaveBeenCalledOnce();
    expect(image).toHaveAttribute("tint-color", "#ff6600");
    rerender(<Example tint="#009978" />);
    await waitSchedule();
    expect(getRoot().querySelector("image")).toBe(image);
    expect(image).toHaveAttribute("tint-color", "#009978");
  });
});

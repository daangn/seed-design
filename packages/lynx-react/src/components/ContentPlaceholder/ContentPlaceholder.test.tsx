import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import type { MainThread, IntrinsicElements } from "@lynx-js/types";
import type { LynxIconElementProps } from "../../types";
import { act, createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { defaultPreset } from "../../content-placeholder-presets/default";
import { buySell } from "../../content-placeholder-presets/buy-sell";
import { car } from "../../content-placeholder-presets/car";
import { commerce } from "../../content-placeholder-presets/commerce";
import { coupon } from "../../content-placeholder-presets/coupon";
import { food } from "../../content-placeholder-presets/food";
import { group } from "../../content-placeholder-presets/group";
import { image } from "../../content-placeholder-presets/image";
import { jobs } from "../../content-placeholder-presets/jobs";
import { business } from "../../content-placeholder-presets/business";
import { post } from "../../content-placeholder-presets/post";
import { realty } from "../../content-placeholder-presets/realty";

import { ContentPlaceholderAsset, ContentPlaceholderRoot } from "./ContentPlaceholder";

const contentPlaceholderPresets = {
  default: defaultPreset,
  buySell,
  car,
  commerce,
  coupon,
  food,
  group,
  image,
  jobs,
  business,
  post,
  realty,
};

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
  it("forwards accessibility semantics without hiding custom content", () => {
    render(
      <ContentPlaceholderRoot accessibility-element accessibility-label="등록된 사진 없음">
        <ContentPlaceholderAsset
          accessibility-elements-hidden={false}
          accessibility-label="직접 지정한 이미지"
        >
          <image src="custom.png" accessibility-element accessibility-label="사용자 이미지" />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelector(".seed-content-placeholder__root")).toHaveAttribute(
      "accessibility-element",
      "true",
    );
    expect(getRoot().querySelector(".seed-content-placeholder__root")).toHaveAttribute(
      "accessibility-label",
      "등록된 사진 없음",
    );
    expect(getRoot().querySelector(".seed-content-placeholder__asset")).toHaveAttribute(
      "accessibility-elements-hidden",
      "false",
    );
    expect(getRoot().querySelector(".seed-content-placeholder__asset")).toHaveAttribute(
      "accessibility-label",
      "직접 지정한 이미지",
    );
    expect(getRoot().querySelector("image")).toHaveAttribute(
      "accessibility-label",
      "사용자 이미지",
    );
    expect(getRoot().querySelector("image")).not.toHaveAttribute("accessibility-elements-hidden");
  });

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
      <ContentPlaceholderRoot preset={contentPlaceholderPresets[type]}>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    const images = getRoot().querySelectorAll("image");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", contentPlaceholderPresets[type].light);
    expect(images[1]).toHaveAttribute("src", contentPlaceholderPresets[type].dark);
    for (const image of images) {
      expect(image.getAttribute("tint-color")).toBeNull();
      expect(image).toHaveAttribute("accessibility-elements-hidden", "true");
    }
  });

  it("updates the selected preset without remounting the theme images", async () => {
    const { rerender } = render(
      <ContentPlaceholderRoot preset={defaultPreset}>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelector("image")).toHaveAttribute(
      "src",
      contentPlaceholderPresets.default.light,
    );
    const firstImage = getRoot().querySelector("image");
    rerender(
      <ContentPlaceholderRoot preset={car}>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    await waitSchedule();
    expect(getRoot().querySelector("image")).toHaveAttribute(
      "src",
      contentPlaceholderPresets.car.light,
    );
    expect(getRoot().querySelector("image")).toBe(firstImage);
  });

  it("renders no preset images when no preset or custom asset is provided", () => {
    render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset />
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelectorAll("image")).toHaveLength(0);
  });

  it("keeps the caller's tint on first render, appearance and updates without adding a preset", async () => {
    const appear = vi.fn();
    const Example = ({ tint }: { tint: string }) => (
      <ContentPlaceholderRoot preset={car}>
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

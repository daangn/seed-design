import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameIndicator,
  ImageFrameReactionButton,
} from "../ImageFrame";
import { heartFillSource, heartLineSource } from "../heart-assets";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/react")>();
  return { ...actual, runOnMainThread: () => () => undefined };
});

function query(selector: string) {
  const root = elementTree.root;
  const element = root?.matches(selector) ? root : root?.querySelector(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element as HTMLElement;
}

function styleProperty(element: HTMLElement, property: string) {
  // The Lynx test environment uses __AddInlineStyle -> style[key], including CSS variables.
  return (
    element.style.getPropertyValue(property) ||
    (element.style as unknown as Record<string, string>)[property]
  );
}

function nativeEvent(element: HTMLElement, name: string) {
  fireEvent(element, new Event(`bindEvent:${name}`));
}

describe("ImageFrame", () => {
  it("centers the default floater without adding edge inset, preserving explicit offsets", () => {
    const { rerender } = render(
      <ImageFrameFloater placement="middle-center">
        <text>+</text>
      </ImageFrameFloater>,
    );
    expect(styleProperty(query(".seed-image-frame__floater"), "--seed-image-frame-offset-x")).toBe(
      "0px",
    );
    expect(styleProperty(query(".seed-image-frame__floater"), "--seed-image-frame-offset-y")).toBe(
      "0px",
    );
    rerender(
      <ImageFrameFloater placement="top-center" offsetX="12px">
        <text>+</text>
      </ImageFrameFloater>,
    );
    expect(styleProperty(query(".seed-image-frame__floater"), "--seed-image-frame-offset-x")).toBe(
      "12px",
    );
    expect(styleProperty(query(".seed-image-frame__floater"), "--seed-image-frame-offset-y")).toBe(
      "var(--seed-dimension-x1_5)",
    );
  });

  it("keeps an image mounted under its fallback, then removes only fallback on load", () => {
    const onLoad = vi.fn();
    const onStatus = vi.fn();
    render(
      <ImageFrame
        src="a.jpg"
        alt="Landscape"
        width="120px"
        fallback={<text>Loading</text>}
        bindload={onLoad}
        onLoadingStatusChange={onStatus}
      >
        <ImageFrameFloater placement="bottom-end">
          <ImageFrameIndicator>+9</ImageFrameIndicator>
        </ImageFrameFloater>
      </ImageFrame>,
    );
    const image = query("image");
    expect(image).toHaveAttribute("src", "a.jpg");
    expect(image).toHaveAttribute("mode", "aspectFill");
    expect(image).toHaveAttribute("accessibility-label", "Landscape");
    expect(query(".seed-image-frame__fallback")).toHaveTextContent("Loading");
    expect(styleProperty(query(".seed-image-frame__root"), "--seed-image-frame-ratio")).toBe(
      String(4 / 3),
    );
    nativeEvent(image, "load");
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onStatus).toHaveBeenLastCalledWith("loaded");
    expect(elementTree.root?.querySelector(".seed-image-frame__fallback")).toBeNull();
    expect(query(".seed-image-frame-indicator__label")).toHaveTextContent("+9");
  });

  it("restores fallback for a new src and ignores events from the previous native image", () => {
    const onError = vi.fn();
    const { rerender } = render(
      <ImageFrame src="a.jpg" alt="Photo" fallback={<text>Fallback</text>} />,
    );
    const previous = query("image");
    nativeEvent(previous, "load");
    rerender(
      <ImageFrame src="b.jpg" alt="Photo" fallback={<text>Fallback</text>} binderror={onError} />,
    );
    const current = query("image");
    expect(current).not.toBe(previous);
    nativeEvent(previous, "load");
    expect(query(".seed-image-frame__fallback")).toHaveTextContent("Fallback");
    nativeEvent(current, "error");
    expect(onError).toHaveBeenCalledTimes(1);
    expect(query(".seed-image-frame__fallback")).toHaveTextContent("Fallback");
  });

  it("supports decorative images, caller layout, radius and stroke without losing overlay children", () => {
    render(
      <ImageFrame
        src=""
        alt=""
        ratio={1}
        borderRadius="r1"
        stroke
        className="custom"
        style={{ width: "80px" }}
      >
        <text>Overlay</text>
      </ImageFrame>,
    );
    expect(query(".seed-image-frame__root")).toHaveClass("custom");
    expect(query(".seed-image-frame__root").style.width).toBe("80px");
    expect(styleProperty(query(".seed-image-frame__root"), "--seed-image-frame-ratio")).toBe("1");
    expect(styleProperty(query(".seed-image-frame__root"), "--seed-image-frame-radius")).toBe(
      "var(--seed-radius-r1)",
    );
    expect(query(".seed-image-frame__stroke")).toBeInTheDocument();
    expect(query("image")).toHaveAttribute("accessibility-element", "false");
    expect(query(".seed-image-frame__root")).toHaveTextContent("Overlay");
  });

  it("preserves explicit zero offsets and places overlay in the requested corner", () => {
    render(
      <ImageFrameFloater placement="top-start" offsetX={0} offsetY={0}>
        <ImageFrameIndicator>NEW</ImageFrameIndicator>
      </ImageFrameFloater>,
    );
    const floater = query(".seed-image-frame__floater");
    expect(floater).toHaveClass("seed-image-frame__floater--placement_top-start");
    expect(styleProperty(floater, "--seed-image-frame-offset-x")).toBe("0px");
    expect(styleProperty(floater, "--seed-image-frame-offset-y")).toBe("0px");
  });
});

describe("ImageFrameReactionButton", () => {
  it("toggles uncontrolled selection and composes the caller tap handler", () => {
    const onChange = vi.fn();
    const onTap = vi.fn();
    render(
      <ImageFrameReactionButton
        accessibility-label="좋아요"
        onPressedChange={onChange}
        bindtap={onTap}
      />,
    );
    expect(query("image")).toHaveAttribute("src", heartLineSource);
    fireEvent.tap(query(".seed-image-frame-reaction-button__root"));
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(query("image")).toHaveAttribute("src", heartFillSource);
    expect(query(".seed-image-frame-reaction-button__root")).toHaveAttribute(
      "accessibility-value",
      "pressed",
    );
    fireEvent.tap(query(".seed-image-frame-reaction-button__root"));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("leaves controlled pressed state with the owner until rerender", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ImageFrameReactionButton pressed={false} onPressedChange={onChange} />,
    );
    fireEvent.tap(query(".seed-image-frame-reaction-button__root"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(query("image")).toHaveAttribute("src", heartLineSource);
    rerender(<ImageFrameReactionButton pressed onPressedChange={onChange} />);
    expect(query("image")).toHaveAttribute("src", heartFillSource);
  });

  it("blocks selection and user tap callbacks while disabled", () => {
    const onChange = vi.fn();
    const onTap = vi.fn();
    render(
      <ImageFrameReactionButton
        disabled
        defaultPressed
        onPressedChange={onChange}
        bindtap={onTap}
      />,
    );
    const button = query(".seed-image-frame-reaction-button__root");
    fireEvent.tap(button);
    expect(onChange).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("accessibility-traits", "disabled");
    expect(button).toHaveAttribute("accessibility-value", "pressed");
    expect(button).toHaveAttribute("hit-slop", "8px");
  });
});

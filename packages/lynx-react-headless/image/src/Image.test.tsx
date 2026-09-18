import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Image } from "./index";

function image() {
  const node = elementTree.root?.querySelector("image");
  if (!node) throw new Error("Missing image");
  return node;
}
function load(node: Element, name = "load") {
  fireEvent(node, new Event(`bindEvent:${name}`));
}
function Example({
  src = "a",
  visible = true,
  onStatus = () => {},
  onLoad = () => {},
}: {
  src?: string;
  visible?: boolean;
  onStatus?: (status: string) => void;
  onLoad?: () => void;
}) {
  return (
    <Image.Root onLoadingStatusChange={onStatus}>
      {visible ? <Image.Content src={src} alt="Photo" bindload={onLoad} /> : null}
      <Image.Fallback className="fallback">
        <text>Loading</text>
      </Image.Fallback>
    </Image.Root>
  );
}
describe("Image", () => {
  it("keeps the image mounted, merges events and removes fallback after loading", () => {
    const onStatus = vi.fn();
    const onLoad = vi.fn();
    render(<Example onStatus={onStatus} onLoad={onLoad} />);
    expect(elementTree.root?.querySelector(".fallback")).not.toBeNull();
    expect(image()).toHaveAttribute("accessibility-label", "Photo");
    load(image());
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onStatus.mock.calls).toEqual([["loading"], ["loaded"]]);
    expect(elementTree.root?.querySelector(".fallback")).toBeNull();
  });
  it("recreates native requests on src changes and ignores old events", () => {
    const onStatus = vi.fn();
    const { rerender } = render(<Example onStatus={onStatus} />);
    const first = image();
    load(first);
    rerender(<Example src="b" onStatus={onStatus} />);
    expect(image()).not.toBe(first);
    expect(onStatus).toHaveBeenLastCalledWith("loading");
    load(first);
    expect(elementTree.root?.querySelector(".fallback")).not.toBeNull();
    load(image(), "error");
    expect(onStatus).toHaveBeenLastCalledWith("error");
    rerender(<Example src="a" onStatus={onStatus} />);
    load(image());
    expect(elementTree.root?.querySelector(".fallback")).toBeNull();
  });
  it("restores fallback on content removal and handles an empty source", () => {
    const { rerender } = render(<Example />);
    load(image());
    rerender(<Example visible={false} />);
    expect(elementTree.root?.querySelector(".fallback")).not.toBeNull();
    rerender(<Example src="" />);
    load(image());
    expect(elementTree.root?.querySelector(".fallback")).not.toBeNull();
  });
});

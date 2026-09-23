import "@testing-library/jest-dom";
import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "../index";

function root() {
  if (!elementTree.root) throw new Error("Missing native root");
  return elementTree.root;
}
function image() {
  const element = root().querySelector<HTMLElement>("image");
  if (!element) throw new Error("Missing image");
  return element;
}
function emit(element: HTMLElement, type: "load" | "error") {
  act(() => {
    fireEvent(element, createEvent(`bindEvent:${type}`, element, { detail: {} }));
  });
}
function Profile({
  src,
  onStatus,
  onLoad,
  onError,
  showImage = true,
}: {
  showImage?: boolean;
  src?: string;
  onStatus?: (status: "loading" | "loaded" | "error") => void;
  onLoad?: () => void;
  onError?: () => void;
}) {
  return (
    <Avatar.Root onLoadingStatusChange={onStatus}>
      <Avatar.Fallback>
        <text>fallback</text>
      </Avatar.Fallback>
      {showImage && <Avatar.Image src={src} alt="profile" bindload={onLoad} binderror={onError} />}
    </Avatar.Root>
  );
}

describe("Avatar", () => {
  it("keeps the native request mounted while loading, and composes load/error handlers", () => {
    const onStatus = vi.fn();
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(<Profile src="a.png" onStatus={onStatus} onLoad={onLoad} onError={onError} />);
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
    expect(image()).toHaveAttribute("src", "a.png");
    expect(image()).toHaveAttribute("mode", "aspectFill");
    expect(image()).toHaveAttribute("accessibility-label", "profile");
    emit(image(), "load");
    expect(root().querySelector(".seed-avatar__fallback")).toBeNull();
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onStatus.mock.calls).toEqual([["loading"], ["loaded"]]);
    emit(image(), "error");
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
    expect(onError).toHaveBeenCalledOnce();
    expect(onStatus).toHaveBeenLastCalledWith("error");
  });

  it("starts a fresh native image on source replacement and restores fallback", () => {
    const { rerender } = render(<Profile src="a.png" />);
    emit(image(), "load");
    const previous = image();
    rerender(<Profile src="b.png" />);
    expect(image()).not.toBe(previous);
    expect(image()).toHaveAttribute("src", "b.png");
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
    emit(image(), "load");
    expect(root().querySelector(".seed-avatar__fallback")).toBeNull();
  });

  it("replaces the native request even when both sources are still loading", () => {
    const { rerender } = render(<Profile src="a.png" />);
    const pending = image();
    rerender(<Profile src="a.png" />);
    expect(image()).toBe(pending);
    rerender(<Profile src="b.png" />);
    expect(image()).not.toBe(pending);
    expect(image()).toHaveAttribute("src", "b.png");
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
  });

  it("keeps a fallback without a src, even if a load event arrives", () => {
    render(<Profile />);
    emit(image(), "load");
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
  });

  it("restores fallback when the Image slot unmounts", () => {
    const { rerender } = render(<Profile src="a.png" />);
    emit(image(), "load");
    rerender(<Profile src="a.png" showImage={false} />);
    expect(root().querySelector(".seed-avatar__fallback")).not.toBeNull();
  });

  it("inherits stack size, lets an avatar override it, and overlaps only subsequent items", () => {
    render(
      <Avatar.Stack size="64">
        <Avatar.Root />
        <Avatar.Root size="24" />
        {false}
        <Avatar.Root />
      </Avatar.Stack>,
    );
    const avatars = root().querySelectorAll(".seed-avatar__root");
    expect(avatars).toHaveLength(3);
    expect(avatars[0]?.className).toContain("size_64");
    expect(avatars[1]?.className).toContain("size_24");
    expect(avatars[2]?.className).toContain("size_64");
    const items = root().querySelectorAll(".seed-avatar-stack__item");
    expect(items[0]?.className).not.toContain("seed-avatar-stack__overlap");
    expect(items[1]?.className).toContain("seed-avatar-stack__overlap");
    expect(items[2]?.className).toContain("seed-avatar-stack__overlap");
  });

  it("keeps independently keyed child arrays in their stack order after updates", () => {
    const { rerender } = render(
      <Avatar.Stack>
        {[<Avatar.Root key="0" id="a" />, <Avatar.Root key="1" id="b" />]}
        {[<Avatar.Root key="0" id="c" />, <Avatar.Root key="1" id="d" />]}
      </Avatar.Stack>,
    );
    rerender(
      <Avatar.Stack>
        {[<Avatar.Root key="0" id="a" />]}
        {[<Avatar.Root key="0" id="c" />, <Avatar.Root key="1" id="d" />]}
      </Avatar.Stack>,
    );
    const avatars = root().querySelectorAll(".seed-avatar__root");
    expect(Array.from(avatars, (avatar) => avatar.id)).toEqual(["a", "c", "d"]);
  });

  it("masks image views, fallback and stroke without clipping the badge", () => {
    const { rerender } = render(
      <Avatar.Root size="64" badgeMask="flower">
        <Avatar.Fallback>
          <text>fallback</text>
        </Avatar.Fallback>
        <Avatar.Image src="a.png" />
        <Avatar.Badge>
          <text>badge</text>
        </Avatar.Badge>
      </Avatar.Root>,
    );
    const container = root().querySelector(".seed-avatar__imageContainer");
    expect(container?.tagName.toLowerCase()).toBe("view");
    expect(container?.className).toContain("badgeMask_flower");
    expect(container?.contains(image())).toBe(true);
    expect(container?.className.split(" ")).not.toContain("seed-avatar__pendingImage");
    const badge = root().querySelector(".seed-avatar__badge");
    expect(container?.contains(badge)).toBe(false);
    expect(root().querySelector(".seed-avatar__fallback")?.className).toContain("badgeMask_flower");
    expect(root().querySelector(".seed-avatar__stroke")?.className).toContain("badgeMask_flower");
    emit(image(), "load");
    expect(root().querySelector(".seed-avatar__fallback")).toBeNull();
    expect(root().querySelector(".seed-avatar__badge")?.textContent).toBe("badge");
    rerender(
      <Avatar.Root size="64" badgeMask="none">
        <Avatar.Image src="a.png" />
      </Avatar.Root>,
    );
    expect(root().querySelector(".seed-avatar__imageContainer")?.className).not.toContain(
      "badgeMask_flower",
    );
  });

  it("keeps the loaded image and fallback state through repeated mask cycles", () => {
    const onStatus = vi.fn();
    function MaskedProfile({ mask }: { mask: "circle" | "flower" | "shield" | "none" }) {
      return (
        <Avatar.Root size="64" badgeMask={mask} onLoadingStatusChange={onStatus}>
          <Avatar.Fallback><text>fallback</text></Avatar.Fallback>
          <Avatar.Image src="a.png" />
          <Avatar.Badge><text>badge</text></Avatar.Badge>
        </Avatar.Root>
      );
    }
    const { rerender } = render(<MaskedProfile mask="circle" />);
    emit(image(), "load");
    const loadedImage = image();
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const mask of ["flower", "shield", "none", "circle"] as const) {
        rerender(<MaskedProfile mask={mask} />);
        expect(image()).toBe(loadedImage);
        expect(root().querySelector(".seed-avatar__fallback")).toBeNull();
        expect(root().querySelector(".seed-avatar__badge")?.textContent).toBe("badge");
      }
    }
    expect(onStatus.mock.calls).toEqual([["loading"], ["loaded"]]);
  });

  it("rejects slots without a Root provider", () => {
    expect(() => render(<Avatar.Image src="a.png" />)).toThrow();
  });
});

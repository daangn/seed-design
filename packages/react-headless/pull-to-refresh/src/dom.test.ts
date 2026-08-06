import { describe, expect, it } from "bun:test";

import { findScroller, isPullPrevented, pullToRefreshPreventPull } from "./dom";

function markPreventPull(element: HTMLElement) {
  for (const [key, value] of Object.entries(pullToRefreshPreventPull)) {
    element.setAttribute(key, value);
  }

  return element;
}

function buildTree() {
  const root = document.createElement("div");
  const middle = document.createElement("div");
  const leaf = document.createElement("span");
  root.appendChild(middle);
  middle.appendChild(leaf);
  document.body.appendChild(root);

  return { root, middle, leaf };
}

/**
 * happy-dom lays nothing out, so every element reports `scrollHeight` and
 * `clientHeight` as 0 and none would ever qualify as a scroller on its own.
 */
function makeScrollable(el: HTMLElement, overflowY = "auto") {
  Object.defineProperty(el, "scrollHeight", { value: 5000, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: 500, configurable: true });
  el.style.overflowY = overflowY;

  return el;
}

describe("pullToRefreshPreventPull", () => {
  it("is a single data attribute with an empty value", () => {
    expect(pullToRefreshPreventPull).toEqual({
      "data-seed-pull-to-refresh-prevent-pull": "",
    });
  });
});

describe("isPullPrevented", () => {
  it("returns false when neither the element nor its ancestors are marked", () => {
    const { leaf } = buildTree();

    expect(isPullPrevented(leaf)).toBe(false);
  });

  it("returns true when the element itself is marked", () => {
    const { leaf } = buildTree();
    markPreventPull(leaf);

    expect(isPullPrevented(leaf)).toBe(true);
  });

  it("returns true when a direct parent is marked", () => {
    const { middle, leaf } = buildTree();
    markPreventPull(middle);

    expect(isPullPrevented(leaf)).toBe(true);
  });

  it("returns true when a distant ancestor is marked", () => {
    const { root, leaf } = buildTree();
    markPreventPull(root);

    expect(isPullPrevented(leaf)).toBe(true);
  });

  it("returns false when only a sibling subtree is marked", () => {
    const { root, leaf } = buildTree();
    markPreventPull(root.appendChild(document.createElement("div")));

    expect(isPullPrevented(leaf)).toBe(false);
  });

  it("returns false when only a descendant is marked", () => {
    const { middle, leaf } = buildTree();
    markPreventPull(leaf);

    expect(isPullPrevented(middle)).toBe(false);
  });

  it("works on a detached element", () => {
    const detached = markPreventPull(document.createElement("div"));

    expect(isPullPrevented(detached)).toBe(true);
  });
});

describe("findScroller", () => {
  it("returns the root when nothing in the subtree scrolls", () => {
    const { root, leaf } = buildTree();

    expect(findScroller(leaf, root)).toBe(root);
  });

  it("returns the nearest scrollable ancestor of the touch target", () => {
    const { root, middle, leaf } = buildTree();
    makeScrollable(middle);

    expect(findScroller(leaf, root)).toBe(middle);
  });

  it("returns the element itself when it is the scroller", () => {
    const { root, leaf } = buildTree();
    makeScrollable(leaf);

    expect(findScroller(leaf, root)).toBe(leaf);
  });

  it("prefers the nearest scroller over an outer one", () => {
    const { root, middle, leaf } = buildTree();
    makeScrollable(root);
    makeScrollable(middle);

    expect(findScroller(leaf, root)).toBe(middle);
  });

  it("returns the root when the root itself is the scroller", () => {
    const { root, leaf } = buildTree();
    makeScrollable(root);

    expect(findScroller(leaf, root)).toBe(root);
  });

  it("ignores overflow values that do not scroll", () => {
    const { root, middle, leaf } = buildTree();
    makeScrollable(middle, "hidden");

    expect(findScroller(leaf, root)).toBe(root);
  });

  it("ignores an element that overflows nothing", () => {
    const { root, middle, leaf } = buildTree();
    middle.style.overflowY = "auto";

    expect(findScroller(leaf, root)).toBe(root);
  });

  it("stops at the root rather than walking past it", () => {
    const { root, leaf } = buildTree();
    const outer = document.createElement("div");
    document.body.appendChild(outer);
    outer.appendChild(root);
    makeScrollable(outer);

    expect(findScroller(leaf, root)).toBe(root);
  });
});

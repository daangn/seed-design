import { describe, expect, it } from "bun:test";

import { isPullPrevented, pullToRefreshPreventPull } from "./dom";

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

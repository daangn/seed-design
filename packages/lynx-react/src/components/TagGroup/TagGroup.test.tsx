import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import * as TagGroup from "./TagGroup.namespace";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("TagGroup", () => {
  it("applies the separator wrapper recipe slot", () => {
    render(
      <TagGroup.Root>
        <TagGroup.Item>
          <TagGroup.ItemLabel>First</TagGroup.ItemLabel>
        </TagGroup.Item>
        <TagGroup.Item>
          <TagGroup.ItemLabel>Second</TagGroup.ItemLabel>
        </TagGroup.Item>
      </TagGroup.Root>,
    );

    const root = getRenderedRoot();
    const separatorWrapper = root.querySelector(".seed-tag-group__root")?.children.item(1);

    expect(separatorWrapper).toHaveClass("seed-tag-group__separatorWrapper");
    expect(separatorWrapper).not.toHaveAttribute("style");
  });
});

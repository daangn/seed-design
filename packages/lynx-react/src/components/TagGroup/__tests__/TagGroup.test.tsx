import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import * as TagGroup from "../TagGroup.namespace";

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("TagGroup", () => {
  it("applies flexShrink through style props on items", () => {
    render(
      <TagGroup.Root>
        <TagGroup.Item className="tag-item" flexShrink={false}>
          <TagGroup.ItemLabel>Tag label</TagGroup.ItemLabel>
        </TagGroup.Item>
      </TagGroup.Root>,
    );

    const { getByText } = getRenderedQueries();
    const item = getByText("Tag label").parentElement;

    expect(item).toHaveClass("tag-item");
    expect(item).toHaveStyle({ flexShrink: "0" });
  });
});

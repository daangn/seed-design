import "@testing-library/jest-dom";
import type { ReactNode } from "@lynx-js/react";
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

function renderTagGroup(separator?: ReactNode) {
  render(
    <TagGroup.Root separator={separator}>
      <TagGroup.Item>
        <TagGroup.ItemLabel>첫 번째</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>두 번째</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>세 번째</TagGroup.ItemLabel>
      </TagGroup.Item>
    </TagGroup.Root>,
  );
}

describe("TagGroup", () => {
  it("trims surrounding whitespace from the default string separator", () => {
    renderTagGroup();

    const separators = getRenderedRoot().querySelectorAll(".seed-tag-group__separator");

    expect(separators).toHaveLength(2);
    expect(Array.from(separators, (separator) => separator.textContent)).toEqual(["·", "·"]);
  });

  it("trims surrounding whitespace from a custom string separator", () => {
    renderTagGroup(" \n / \t ");

    const separators = getRenderedRoot().querySelectorAll(".seed-tag-group__separator");

    expect(Array.from(separators, (separator) => separator.textContent)).toEqual(["/", "/"]);
  });

  it("preserves a non-string separator node", () => {
    renderTagGroup(<text className="custom-separator"> 구분 </text>);

    const customSeparators = getRenderedRoot().querySelectorAll(".custom-separator");

    expect(customSeparators).toHaveLength(2);
    expect(Array.from(customSeparators, (separator) => separator.textContent)).toEqual([
      " 구분 ",
      " 구분 ",
    ]);
  });

  it("keeps each separator and following item in the same wrapper", () => {
    renderTagGroup();

    const wrappers = getRenderedRoot().querySelectorAll(".seed-tag-group__separatorWrapper");

    expect(wrappers).toHaveLength(2);
    expect(wrappers[0]?.textContent).toBe("·두 번째");
    expect(wrappers[1]?.textContent).toBe("·세 번째");
  });
});

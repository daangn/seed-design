import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import * as ChipTabs from "./ChipTabs.namespace";

describe("ChipTabs", () => {
  it("tags the root with the Rootage chip-tablist variant and lets a consumer tag win", () => {
    const { container, rerender } = render(
      <ChipTabs.Root defaultValue="all" variant="neutralOutline">
        <ChipTabs.List>
          <ChipTabs.Trigger value="all">전체</ChipTabs.Trigger>
        </ChipTabs.List>
      </ChipTabs.Root>,
    );
    expect(container.querySelector(".seed-chip-tabs__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:ChipTablist;variant=neutralOutline",
    );

    rerender(<ChipTabs.Root defaultValue="all" lynx-test-tag="feed-filter" />);
    expect(container.querySelector(".seed-chip-tabs__root")).toHaveAttribute(
      "lynx-test-tag",
      "feed-filter",
    );
  });
});

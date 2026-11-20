import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { PullToRefreshRoot } from "./PullToRefresh";

describe("PullToRefresh", () => {
  it("tags the root and lets a consumer lynx-test-tag win", () => {
    render(<PullToRefreshRoot />);
    expect(elementTree.root?.querySelector(".seed-pull-to-refresh__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:PullToRefresh",
    );

    render(<PullToRefreshRoot lynx-test-tag={undefined} />);
    expect(elementTree.root?.querySelector(".seed-pull-to-refresh__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:PullToRefresh",
    );

    render(<PullToRefreshRoot lynx-test-tag="feed-refresh" />);
    expect(elementTree.root?.querySelector(".seed-pull-to-refresh__root")).toHaveAttribute(
      "lynx-test-tag",
      "feed-refresh",
    );
  });
});

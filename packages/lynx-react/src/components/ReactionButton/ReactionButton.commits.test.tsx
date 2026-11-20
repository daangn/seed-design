import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { ReactionButton } from "./ReactionButton";

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<ReactionButton>좋아요</ReactionButton>, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
  });
  return { view, commits };
}

describe("ReactionButton commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() =>
      view.rerender(<ReactionButton>좋아요</ReactionButton>),
    );
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a toggle", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-reaction-button__root");
    if (!root) throw new Error("Missing reaction button");
    const commits = await measureCommits(() => fireEvent.tap(root));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

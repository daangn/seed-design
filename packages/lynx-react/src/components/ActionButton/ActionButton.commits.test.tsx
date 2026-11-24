import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { ActionButton } from "./ActionButton";

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<ActionButton>확인</ActionButton>));
  return { view, commits };
}

describe("ActionButton commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<ActionButton>확인</ActionButton>));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits once each for press and release", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-action-button__root");
    if (!root) throw new Error("Missing action button");
    const commits = await measureCommits(async () => {
      fireEvent.touchstart(root, {});
      await waitSchedule();
      fireEvent.touchend(root, {});
    });
    expect(commits).toMatchObject({ total: 2, nonEmpty: 2 });
  });
});

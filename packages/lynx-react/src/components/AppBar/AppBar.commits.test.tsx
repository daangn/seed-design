import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as AppBar from "./AppBar.namespace";

function Example() {
  return (
    <AppBar.Root>
      <AppBar.Left>
        <AppBar.IconButton accessibility-label="뒤로" />
      </AppBar.Left>
      <AppBar.Main>
        <AppBar.Title>제목</AppBar.Title>
      </AppBar.Main>
      <AppBar.Right>
        <AppBar.TextButton>완료</AppBar.TextButton>
      </AppBar.Right>
    </AppBar.Root>
  );
}

// 기기처럼 Left·Right마다 폭 layoutchange를 따로 보낸다.
async function layoutSides(container: Element) {
  for (const [selector, width] of [
    [".seed-app-bar__left", 48],
    [".seed-app-bar__right", 72],
  ] as const) {
    const side = container.querySelector(selector);
    if (!side) throw new Error(`Missing ${selector}`);
    const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { width } };
    const event = createEvent("bindEvent:layoutchange", side, init);
    Object.assign(event, init);
    fireEvent(side, event);
    await waitSchedule();
  }
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example />);
    await waitSchedule();
    await layoutSides(view.container);
  });
  return { view, commits };
}

describe("AppBar commits", () => {
  it("commits the side widths on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 9, nonEmpty: 5 });
  });

  it("does not commit when the side widths are reported again", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => layoutSides(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

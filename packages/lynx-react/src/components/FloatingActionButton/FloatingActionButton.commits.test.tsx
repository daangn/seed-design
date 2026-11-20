import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as FloatingActionButton from "./FloatingActionButton.namespace";

function Example() {
  return (
    <FloatingActionButton.Root accessibility-label="새 글 작성">
      <FloatingActionButton.Label>글쓰기</FloatingActionButton.Label>
    </FloatingActionButton.Root>
  );
}

// 기기처럼 Label 폭 layoutchange를 보낸다.
function layoutLabel(container: Element) {
  const label = container.querySelector(".seed-floating-action-button__label");
  if (!label) throw new Error("Missing label");
  const init = {
    eventType: "bindEvent",
    eventName: "layoutchange",
    detail: { width: 72, height: 22 },
  };
  const event = createEvent("bindEvent:layoutchange", label, init);
  Object.assign(event, init);
  fireEvent(label, event);
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example />);
    await waitSchedule();
    layoutLabel(view.container);
  });
  return { view, commits };
}

describe("FloatingActionButton commits", () => {
  it("commits the label width on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 3, nonEmpty: 3 } : { total: 2, nonEmpty: 2 },
    );
  });

  it("does not commit when the label width is reported again", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => layoutLabel(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a press and release", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-floating-action-button__root");
    if (!root) throw new Error("Missing floating action button");
    const commits = await measureCommits(async () => {
      fireEvent.touchstart(root, {});
      await waitSchedule();
      fireEvent.touchend(root, {});
    });
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 4 } : { total: 2, nonEmpty: 2 },
    );
  });
});

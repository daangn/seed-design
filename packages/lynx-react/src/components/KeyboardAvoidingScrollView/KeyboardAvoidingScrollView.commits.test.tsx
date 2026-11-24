import { createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as KeyboardAvoidingScrollView from "./KeyboardAvoidingScrollView.namespace";

function Example() {
  return (
    <KeyboardAvoidingScrollView.Root>
      <KeyboardAvoidingScrollView.Content>
        <text>내용</text>
      </KeyboardAvoidingScrollView.Content>
      <KeyboardAvoidingScrollView.Footer>
        <text>하단</text>
      </KeyboardAvoidingScrollView.Footer>
    </KeyboardAvoidingScrollView.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

describe("KeyboardAvoidingScrollView commits", () => {
  // Footer가 등록되면 엔진의 첫 평가가 footerPlaced를 켜 Footer를 보이게 한다.
  it("commits the footer placement on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 4, nonEmpty: 2 });
  });

  it("does not commit when the viewport layout is reported again", async () => {
    const { view } = await mount();
    // 테스트 런타임의 fireEvent가 `scroll-view`(Content)를 받지 않아 Root만 보낸다.
    const root = view.container.firstElementChild;
    if (!root) throw new Error("Missing keyboard avoiding scroll view");
    const commits = await measureCommits(() => {
      const init = {
        eventType: "bindEvent",
        eventName: "layoutchange",
        detail: { width: 375, height: 600 },
      };
      const event = createEvent("bindEvent:layoutchange", root, init);
      Object.assign(event, init);
      fireEvent(root, event);
    });
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

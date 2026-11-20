import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import { createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as Floating from "@seed-design/lynx-react-floating";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as HelpBubble from "./HelpBubble.namespace";

// 기기처럼 열 때 측정과 위치 계산이 끝나도록 고정 geometry를 돌려준다.
const rect = { left: 0, top: 0, right: 240, bottom: 40, width: 240, height: 40 };
vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => ({
  ...(await importOriginal<typeof LynxUiCommon>()),
  getRectByRef: async () => rect,
  invokeByRef: async () => rect,
}));
vi.mock("@seed-design/lynx-react-floating", async (importOriginal) => ({
  ...(await importOriginal<typeof Floating>()),
  computePosition: async ({ width }: { width: number }) => ({
    availableWidth: width,
    availableHeight: 480,
    left: 0,
    top: 40,
    width,
    height: 40,
    placement: "bottom",
  }),
}));

// root rect 측정이 쓰는 `selectRoot`가 테스트 환경에 없다. root 노드는 위 getRectByRef mock이 잰다.
beforeEach(() => {
  const root = { invoke: () => ({ exec: () => {} }) };
  Object.assign(lynxTestingEnv.backgroundThread["lynx"], {
    createSelectorQuery: () => ({ selectRoot: () => root }),
  });
});

function Example() {
  return (
    <HelpBubble.Root>
      <HelpBubble.Trigger className="trigger">
        <text>도움말</text>
      </HelpBubble.Trigger>
      <HelpBubble.Positioner>
        <HelpBubble.Content className="content">
          <HelpBubble.Arrow>
            <HelpBubble.ArrowTip />
          </HelpBubble.Arrow>
          <HelpBubble.Body>
            <HelpBubble.Title>제목</HelpBubble.Title>
            <HelpBubble.Description>설명</HelpBubble.Description>
          </HelpBubble.Body>
          <HelpBubble.CloseButton accessibility-label="닫기" />
        </HelpBubble.Content>
      </HelpBubble.Positioner>
    </HelpBubble.Root>
  );
}

function getTrigger(container: Element) {
  const trigger = container.querySelector(".trigger");
  if (!trigger) throw new Error("Missing trigger");
  return trigger;
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("HelpBubble commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered open with the same props", async () => {
    const { view } = await mount();
    await measureCommits(() => fireEvent.tap(getTrigger(view.container)));
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // Trigger layoutchange마다 requestPositionUpdate가 positionRevision state를 올려 다시 렌더하고 위치를 다시 잰다
  // (lynx-react-headless/popover/src/usePopover.ts requestPositionUpdate). 측정값이 같아도 빈 commit이 남는다.
  // 현재: 4회(patch 있는 commit 0회), Preact 10은 6회(0회).
  it.fails("does not commit when the open trigger layout is reported again", async () => {
    const { view } = await mount();
    await measureCommits(() => fireEvent.tap(getTrigger(view.container)));
    const commits = await measureCommits(() => {
      const trigger = getTrigger(view.container);
      const init = {
        eventType: "bindEvent",
        eventName: "layoutchange",
        detail: { width: 240, height: 40 },
      };
      const event = createEvent("bindEvent:layoutchange", trigger, init);
      Object.assign(event, init);
      fireEvent(trigger, event);
    });
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("commits opening and positioning", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => fireEvent.tap(getTrigger(view.container)));
    expect(getTrigger(view.container).getAttribute("accessibility-value")).toBe("expanded");
    expect(view.container.querySelector("[class*='positioned_true']")).not.toBeNull();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 23, nonEmpty: 10 } : { total: 12, nonEmpty: 3 },
    );
  });
});

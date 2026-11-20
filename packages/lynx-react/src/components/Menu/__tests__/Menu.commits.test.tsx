import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import type * as Floating from "@seed-design/lynx-react-floating";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as Menu from "../Menu.namespace";

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
    height: 320,
    placement: "bottom",
  }),
}));

// root rect 측정이 쓰는 `selectRoot`가 테스트 환경에 없다. root 노드는 위 getRectByRef mock이 재고,
// useViewport의 `invoke`는 응답하지 않아 `selectRoot`가 없을 때처럼 측정을 건너뛴다.
beforeEach(() => {
  const root = { invoke: () => ({ exec: () => {} }) };
  Object.assign(lynxTestingEnv.backgroundThread["lynx"], {
    createSelectorQuery: () => ({ selectRoot: () => root }),
  });
});

function Example({ count }: { count: number }) {
  return (
    <Menu.Root>
      <Menu.Trigger className="trigger">
        <text>열기</text>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className="content">
          <Menu.Group>
            {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
              <Menu.Item key={value}>
                <Menu.ItemLabel>{value}</Menu.ItemLabel>
              </Menu.Item>
            ))}
          </Menu.Group>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

function getTrigger(container: Element) {
  const trigger = container.querySelector(".trigger");
  if (!trigger) throw new Error("Missing trigger");
  return trigger;
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

// 기기처럼 열린 Content의 크기 layoutchange를 보낸다.
async function open(container: Element) {
  fireEvent.tap(getTrigger(container));
  await waitSchedule();
  layoutContent(container);
}

function layoutContent(container: Element) {
  const content = container.querySelector(".content");
  if (!content) throw new Error("Missing content");
  const init = {
    eventType: "bindEvent",
    eventName: "layoutchange",
    detail: { width: 240, height: 320 },
  };
  const event = createEvent("bindEvent:layoutchange", content, init);
  Object.assign(event, init);
  fireEvent(content, event);
}

async function openMenu(count: number) {
  const { view } = await mount(count);
  const commits = await measureCommits(() => open(view.container));
  expect(getTrigger(view.container).getAttribute("accessibility-value")).toBe("expanded");
  expect(view.container.querySelector(".content")?.getAttribute("style")).toMatch(
    /visibility:\s*visible/,
  );
  view.unmount();
  return commits;
}

describe("Menu commits", () => {
  it.each([4, 16])("commits a fixed number of times when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 4, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered open with the same props", async () => {
    const { view } = await mount(4);
    await measureCommits(() => open(view.container));
    const commits = await measureCommits(() => view.rerender(<Example count={4} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("does not commit when the open content size is reported again", async () => {
    const { view } = await mount(4);
    await measureCommits(() => open(view.container));
    const commits = await measureCommits(() => layoutContent(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  // Preact 10에서는 여는 commit이 Item 수에 비례한다. context 구독으로 다시 렌더되는 Item마다 commit이 따로 생기는 것으로 보인다
  // (lynx-react-headless/menu/src/useMenu.ts의 context 값 → Menu.tsx MenuItem).
  (usesPreact10 ? it.fails : it)(
    "commits opening and positioning without scaling with the item count",
    async () => {
      const few = await openMenu(4);
      const many = await openMenu(16);
      expect(many.total).toBe(few.total);
      expect(few).toMatchObject({ total: 8, nonEmpty: 3 });
    },
  );

  (usesPreact10 ? it : it.skip)(
    "currently scales opening commits with the item count on Preact 10",
    async () => {
      expect(await openMenu(4)).toMatchObject({ total: 20, nonEmpty: 5 });
      expect(await openMenu(16)).toMatchObject({ total: 44, nonEmpty: 5 });
    },
  );
});

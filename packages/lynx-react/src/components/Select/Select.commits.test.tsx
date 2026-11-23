import { createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import type * as Floating from "@seed-design/lynx-react-floating";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

import * as Select from "./Select.namespace";

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

function Example({ count }: { count: number }) {
  return (
    <Select.Root>
      <Select.Trigger className="trigger" accessibility-label="과일" />
      <Select.Positioner>
        <Select.Content>
          <Select.ScrollArea>
            <Select.Group>
              {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
                <Select.Item key={value} value={value} label={value}>
                  <Select.ItemLabel />
                </Select.Item>
              ))}
            </Select.Group>
          </Select.ScrollArea>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

describe("Select commits", () => {
  it.each([4, 16])("commits a fixed number of times when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 7, nonEmpty: 2 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(4);
    const commits = await measureCommits(() => view.rerender(<Example count={4} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits opening and positioning", async () => {
    const { view } = await mount(4);
    const trigger = view.container.querySelector(".trigger");
    if (!trigger) throw new Error("Missing trigger");
    const commits = await measureCommits(() => fireEvent.tap(trigger));
    expect(trigger.getAttribute("accessibility-value")).toBe("expanded");
    expect(commits).toMatchObject({ total: 11, nonEmpty: 6 });
  });

  it("does not commit when the open list layout is reported again", async () => {
    const { view } = await mount(4);
    const trigger = view.container.querySelector(".trigger");
    if (!trigger) throw new Error("Missing trigger");
    await measureCommits(() => fireEvent.tap(trigger));
    const content = view.container.querySelector("scroll-view")?.firstElementChild;
    if (!content) throw new Error("Missing scroll content");
    const commits = await measureCommits(() => {
      const init = {
        eventType: "bindEvent",
        eventName: "layoutchange",
        detail: { width: 240, height: 40 },
      };
      const event = createEvent("bindEvent:layoutchange", content, init);
      Object.assign(event, init);
      fireEvent(content, event);
    });
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("commits selecting an item", async () => {
    const { view } = await mount(4);
    const trigger = view.container.querySelector(".trigger");
    if (!trigger) throw new Error("Missing trigger");
    await measureCommits(() => fireEvent.tap(trigger));
    const item = view.container.querySelector("[accessibility-label='item-1']");
    if (!item) throw new Error("Missing item");
    const commits = await measureCommits(() => fireEvent.tap(item));
    expect(trigger.getAttribute("accessibility-value")).toBe("collapsed");
    expect(trigger.textContent).toContain("item-1");
    expect(commits).toMatchObject({ total: 18, nonEmpty: 8 });
  });
});

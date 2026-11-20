import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Accordion from "./Accordion.namespace";

function Example({ count }: { count: number }) {
  return (
    <Accordion.Root>
      {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
        <Accordion.Item key={value} value={value}>
          <Accordion.Header>
            <Accordion.Trigger className={`${value}-trigger`}>
              <Accordion.Body>
                <Accordion.Title>{value}</Accordion.Title>
              </Accordion.Body>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <text>내용</text>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

// 기기처럼 Content마다 높이 layoutchange를 따로 보낸다.
async function layoutContents(container: Element) {
  for (const inner of container.querySelectorAll(".seed-accordion__contentInner")) {
    const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { height: 84 } };
    const event = createEvent("bindEvent:layoutchange", inner, init);
    Object.assign(event, init);
    fireEvent(inner, event);
    await waitSchedule();
  }
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example count={count} />);
    await waitSchedule();
    await layoutContents(view.container);
  });
  return { view, commits };
}

describe("Accordion commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("does not commit when the content heights are reported again", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => layoutContents(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits opening an item", async () => {
    const { view } = await mount(2);
    const trigger = view.container.querySelector(".item-0-trigger");
    if (!trigger) throw new Error("Missing trigger");
    const commits = await measureCommits(() => fireEvent.tap(trigger));
    expect(trigger.getAttribute("accessibility-value")).toBe("펼쳐짐");
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 8, nonEmpty: 6 } : { total: 1, nonEmpty: 1 },
    );
  });
});

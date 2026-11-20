import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { RadioGroup as HeadlessRadioGroup } from "@seed-design/lynx-react-radio-group";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as CheckSelectBox from "./CheckSelectBox.namespace";
import * as RadioSelectBox from "./RadioSelectBox.namespace";

function CheckExample({ count }: { count: number }) {
  return (
    <CheckSelectBox.Group accessibility-label="알림">
      {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
        <CheckSelectBox.Root key={value}>
          <CheckSelectBox.Trigger>
            <CheckSelectBox.Label>{value}</CheckSelectBox.Label>
          </CheckSelectBox.Trigger>
          <CheckSelectBox.Footer>
            <text>설명</text>
          </CheckSelectBox.Footer>
        </CheckSelectBox.Root>
      ))}
    </CheckSelectBox.Group>
  );
}

function RadioExample({ count }: { count: number }) {
  return (
    <HeadlessRadioGroup.Root accessibility-label="과일" defaultValue="item-0">
      <RadioSelectBox.Group>
        {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
          <RadioSelectBox.Item key={value} value={value}>
            <RadioSelectBox.Trigger>
              <RadioSelectBox.Label>{value}</RadioSelectBox.Label>
            </RadioSelectBox.Trigger>
          </RadioSelectBox.Item>
        ))}
      </RadioSelectBox.Group>
    </HeadlessRadioGroup.Root>
  );
}

// 기기처럼 Footer마다 높이 layoutchange를 따로 보낸다.
async function layoutFooters(container: Element) {
  for (const inner of container.querySelectorAll(".seed-select-box__footerInner")) {
    const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { height: 48 } };
    const event = createEvent("bindEvent:layoutchange", inner, init);
    Object.assign(event, init);
    fireEvent(inner, event);
    await waitSchedule();
  }
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mountCheck(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<CheckExample count={count} />);
    await waitSchedule();
    await layoutFooters(view.container);
  });
  return { view, commits };
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mountRadio(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<RadioExample count={count} />));
  return { view, commits };
}

function getSecondItem(container: Element) {
  const trigger = container.querySelectorAll(".seed-select-box__interactionRoot")[1];
  const surface = container.querySelectorAll(".seed-select-box__root")[1];
  if (!trigger || !surface) throw new Error("Missing item");
  return { trigger, surface };
}

describe("CheckSelectBox commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mountCheck(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("does not commit when the footer heights are reported again", async () => {
    const { view } = await mountCheck(2);
    const commits = await measureCommits(() => layoutFooters(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mountCheck(2);
    const commits = await measureCommits(() => view.rerender(<CheckExample count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it.each([2, 8])("commits checking an item among %i items", async (count) => {
    const { view } = await mountCheck(count);
    const { trigger, surface } = getSecondItem(view.container);
    const commits = await measureCommits(() => fireEvent.tap(trigger));
    expect(surface.getAttribute("accessibility-value")).toBe("checked");
    expect(commits).toMatchObject({ total: 4, nonEmpty: 4 });
  });
});

async function selectSecondRadio(count: number) {
  const { view } = await mountRadio(count);
  const { trigger, surface } = getSecondItem(view.container);
  const commits = await measureCommits(() => fireEvent.tap(trigger));
  expect(surface.getAttribute("accessibility-value")).toBe("selected");
  view.unmount();
  return commits;
}

describe("RadioSelectBox commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mountRadio(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mountRadio(2);
    const commits = await measureCommits(() => view.rerender(<RadioExample count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // 선택 commit이 항목 수에 비례한다. 같은 vnode를 다시 렌더링하지 않고 건너뛰어, context를 구독한 Item마다
  // commit이 따로 생기는 것으로 보인다(lynx-react-headless/radio-group/src/RadioGroup.tsx RadioGroupRoot의 Provider →
  // SelectBox.tsx RadioSelectBoxItem).
  it.fails("does not scale selection commits with the item count", async () => {
    const few = await selectSecondRadio(2);
    const many = await selectSecondRadio(8);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("currently scales selection commits with the item count", async () => {
    expect(await selectSecondRadio(2)).toMatchObject({ total: 8, nonEmpty: 6 });
    expect(await selectSecondRadio(8)).toMatchObject({ total: 14, nonEmpty: 6 });
  });
});

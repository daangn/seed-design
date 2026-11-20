import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

import * as ChipTabs from "./ChipTabs.namespace";
import type * as ScaleFeedback from "../../hooks/useScaleFeedback";

// 테스트 런타임은 이벤트 key마다 handler 하나만 저장해 Scale Feedback의 MT layoutchange가 trigger 폭 측정을 덮는다.
vi.mock("../../hooks/useScaleFeedback", async (importOriginal) => {
  const actual = await importOriginal<typeof ScaleFeedback>();
  return {
    ...actual,
    useScaleFeedback: (options: Parameters<typeof actual.useScaleFeedback>[0]) => {
      const api = actual.useScaleFeedback(options);
      const { "main-thread:bindlayoutchange": _layoutChange, ...targetProps } =
        api.scaleFeedbackTargetProps;
      return { ...api, scaleFeedbackTargetProps: targetProps };
    },
  };
});

function Example({ count }: { count: number }) {
  return (
    <ChipTabs.Root defaultValue="tab-0">
      <ChipTabs.List>
        {Array.from({ length: count }, (_, index) => `tab-${index}`).map((value) => (
          <ChipTabs.Trigger key={value} value={value}>
            {value}
          </ChipTabs.Trigger>
        ))}
      </ChipTabs.List>
    </ChipTabs.Root>
  );
}

function getTriggers(container: Element) {
  return [...container.querySelectorAll('[accessibility-role-description="tab"]')];
}

// 기기처럼 trigger마다 layoutchange를 따로 보낸다.
async function layoutTriggers(container: Element, width: number) {
  for (const trigger of getTriggers(container)) {
    const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { width } };
    const event = createEvent("bindEvent:layoutchange", trigger, init);
    Object.assign(event, init);
    fireEvent(trigger, event);
    await waitSchedule();
  }
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example count={count} />);
    await waitSchedule();
    await layoutTriggers(view.container, 80);
  });
  return { view, commits };
}

async function mountAndUnmount(count: number) {
  const { view, commits } = await mount(count);
  view.unmount();
  return commits;
}

async function selectSecond(count: number) {
  const { view } = await mount(count);
  const [, second] = getTriggers(view.container);
  if (!second) throw new Error("Missing trigger");
  const commits = await measureCommits(() => fireEvent.tap(second));
  expect(second.getAttribute("accessibility-value")).toBe("selected");
  view.unmount();
  return commits;
}

describe("ChipTabs commits", () => {
  // Tabs와 같이 trigger 폭이 올 때마다 useTabs의 triggerWidths state가 바뀌어 commit한다
  // (lynx-react-headless/tabs/src/useTabs.ts updateTriggerWidth). ChipTabs는 Indicator가 없어 대부분 빈
  // commit이다. 목표는 mount 1회다.
  it("currently scales mount commits with the trigger count", async () => {
    expect(await mountAndUnmount(8)).toMatchObject(
      usesPreact10 ? { total: 101, nonEmpty: 1 } : { total: 21, nonEmpty: 1 },
    );
    expect(await mountAndUnmount(24)).toMatchObject(
      usesPreact10 ? { total: 677, nonEmpty: 1 } : { total: 53, nonEmpty: 1 },
    );
  });

  it.fails("does not scale mount commits with the trigger count", async () => {
    const few = await mountAndUnmount(8);
    const many = await mountAndUnmount(24);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("does not commit when the trigger widths are reported again", async () => {
    const { view } = await mount(8);
    const commits = await measureCommits(() => layoutTriggers(view.container, 80));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(8);
    const commits = await measureCommits(() => view.rerender(<Example count={8} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // Preact 10에서는 선택 commit이 trigger 수에 비례한다. context 구독으로 다시 렌더되는 Trigger마다 commit이 따로 생기는 것으로 보인다
  // (lynx-react-headless/tabs/src/useTabs.ts의 context 값 → ChipTabs.tsx ChipTabsTrigger).
  (usesPreact10 ? it.fails : it)(
    "commits a selection change without scaling with the trigger count",
    async () => {
      const few = await selectSecond(8);
      const many = await selectSecond(24);
      expect(many.total).toBe(few.total);
      expect(few).toMatchObject({ total: 2, nonEmpty: 1 });
    },
  );

  (usesPreact10 ? it : it.skip)(
    "currently scales selection commits with the trigger count on Preact 10",
    async () => {
      expect(await selectSecond(8)).toMatchObject({ total: 10, nonEmpty: 2 });
      expect(await selectSecond(24)).toMatchObject({ total: 26, nonEmpty: 2 });
    },
  );
});

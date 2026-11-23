import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

import * as Tabs from "./Tabs.namespace";
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
    <Tabs.Root defaultValue="tab-0">
      <Tabs.List>
        {Array.from({ length: count }, (_, index) => `tab-${index}`).map((value) => (
          <Tabs.Trigger key={value} value={value}>
            {value}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
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

describe("Tabs commits", () => {
  // trigger 폭이 올 때마다 useTabs의 triggerWidths state가 바뀌어 commit한다(lynx-react-headless/tabs/src/useTabs.ts updateTriggerWidth).
  // Preact 11에서는 Tabs.List가 값이 그대로인 TabsStyleContext만 구독해 Preact가 그 아래를 건너뛰므로, 갱신마다
  // TabsRoot와 headless List가 따로 commit한다(Tabs.tsx TabsList).
  // 목표는 mount 1회와 폭 반영 1회다.
  it("currently scales mount commits with the trigger count", async () => {
    expect(await mountAndUnmount(8)).toMatchObject(
      usesPreact10 ? { total: 39, nonEmpty: 13 } : { total: 20, nonEmpty: 3 },
    );
    expect(await mountAndUnmount(24)).toMatchObject(
      usesPreact10 ? { total: 103, nonEmpty: 29 } : { total: 52, nonEmpty: 3 },
    );
  });

  it.fails("does not scale mount commits with the trigger count", async () => {
    const few = await mountAndUnmount(8);
    const many = await mountAndUnmount(24);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 2, nonEmpty: 2 });
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

  // Preact 10에서는 ChipTabs와 같이 선택 commit이 trigger 수에 비례한다(lynx-react-headless/tabs/src/useTabs.ts의
  // context 값 → Tabs.tsx TabsTrigger). Preact 11에서는 mount와 같은 이유로 TabsRoot와 headless List가 따로 commit한다.
  it.fails("commits a selection change without scaling with the trigger count", async () => {
    const few = await selectSecond(8);
    const many = await selectSecond(24);
    expect(many.total).toBe(few.total);
    // patch 크기도 trigger 수에 비례하지 않는다(trigger 3배에서 1.5배 미만).
    expect(many.bytes).toBeLessThan(few.bytes * 1.5);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("currently commits a selection change more than once", async () => {
    expect(await selectSecond(8)).toMatchObject(
      usesPreact10 ? { total: 11, nonEmpty: 3 } : { total: 2, nonEmpty: 1 },
    );
    expect(await selectSecond(24)).toMatchObject(
      usesPreact10 ? { total: 27, nonEmpty: 3 } : { total: 2, nonEmpty: 1 },
    );
  });
});

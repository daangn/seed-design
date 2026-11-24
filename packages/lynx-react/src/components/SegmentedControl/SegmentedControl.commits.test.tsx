import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as SegmentedControl from "./SegmentedControl.namespace";

function Example({ count }: { count: number }) {
  return (
    <SegmentedControl.Root defaultValue="0" accessibility-label="정렬 기준">
      {Array.from({ length: count }, (_, index) => String(index)).map((value) => (
        <SegmentedControl.Item key={value} value={value}>
          {`항목 ${value}`}
        </SegmentedControl.Item>
      ))}
      <SegmentedControl.Indicator />
    </SegmentedControl.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

async function selectSecond(count: number) {
  const { view } = await mount(count);
  const item = view.container.querySelectorAll(".seed-segmented-control__item")[1];
  if (!item) throw new Error("Missing item");
  const commits = await measureCommits(() => fireEvent.tap(item));
  expect(item.getAttribute("accessibility-value")).toBe("selected");
  view.unmount();
  return commits;
}

describe("SegmentedControl commits", () => {
  it.each([2, 6])("commits a fixed number of times when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 4, nonEmpty: 4 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // 선택 commit이 Item 수에 비례한다. context 구독으로 다시 렌더되는 Item마다 commit이 따로 생기는 것으로 보인다
  // (lynx-react-headless/segmented-control/src/useSegmentedControl.ts의 context 값).
  it.fails("commits a selection without scaling with the item count", async () => {
    const few = await selectSecond(2);
    const many = await selectSecond(6);
    expect(many.total).toBe(few.total);
    // patch 크기도 Item 수에 비례하지 않는다(Item 3배에서 1.5배 미만).
    expect(many.bytes).toBeLessThan(few.bytes * 1.5);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("currently scales selection commits with the item count", async () => {
    expect(await selectSecond(2)).toMatchObject({ total: 4, nonEmpty: 3 });
    expect(await selectSecond(6)).toMatchObject({ total: 8, nonEmpty: 3 });
  });
});

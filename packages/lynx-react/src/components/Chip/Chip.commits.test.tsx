import type * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Chip from "./Chip.namespace";

function ToggleExample() {
  return (
    <Chip.Toggle>
      <Chip.Label>토글 칩</Chip.Label>
    </Chip.Toggle>
  );
}

function RadioExample({ count }: { count: number }) {
  return (
    <Chip.RadioRoot defaultValue="0" accessibility-label="칩 선택">
      {Array.from({ length: count }, (_, index) => String(index)).map((value) => (
        <Chip.RadioItem key={value} value={value}>
          <Chip.Label>{`항목 ${value}`}</Chip.Label>
        </Chip.RadioItem>
      ))}
    </Chip.RadioRoot>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(ui: React.ReactElement) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(ui));
  return { view, commits };
}

async function selectSecond(count: number) {
  const { view } = await mount(<RadioExample count={count} />);
  const item = view.container.querySelectorAll(".seed-chip__root")[1];
  if (!item) throw new Error("Missing item");
  const commits = await measureCommits(() => fireEvent.tap(item));
  expect(item.getAttribute("accessibility-value")).toBe("selected");
  view.unmount();
  return commits;
}

describe("Chip.Toggle commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount(<ToggleExample />);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(<ToggleExample />);
    const commits = await measureCommits(() => view.rerender(<ToggleExample />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a toggle", async () => {
    const { view } = await mount(<ToggleExample />);
    const root = view.container.querySelector(".seed-chip__root");
    if (!root) throw new Error("Missing chip");
    const commits = await measureCommits(() => fireEvent.tap(root));
    expect(root.getAttribute("accessibility-value")).toBe("checked");
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 2, nonEmpty: 2 } : { total: 1, nonEmpty: 1 },
    );
  });
});

describe("Chip.RadioRoot commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(<RadioExample count={count} />);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(<RadioExample count={2} />);
    const commits = await measureCommits(() => view.rerender(<RadioExample count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // Preact 10에서는 선택 commit이 항목 수에 비례한다. SelectBox.commits.test.tsx의 RadioSelectBox와 같이 context 구독으로
  // 다시 렌더되는 Item마다 commit이 따로 생기는 것으로 보인다(lynx-react-headless/radio-group의 RadioGroupRoot context →
  // Chip.tsx ChipRadioItem).
  (usesPreact10 ? it.fails : it)(
    "commits a selection without scaling with the item count",
    async () => {
      const few = await selectSecond(2);
      const many = await selectSecond(8);
      expect(many.total).toBe(few.total);
      expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
    },
  );

  (usesPreact10 ? it : it.skip)(
    "currently scales selection commits with the item count on Preact 10",
    async () => {
      expect(await selectSecond(2)).toMatchObject({ total: 5, nonEmpty: 4 });
      expect(await selectSecond(8)).toMatchObject({ total: 11, nonEmpty: 4 });
    },
  );
});

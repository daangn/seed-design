import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { RadioGroupField } from "../RadioGroupField";
import * as RadioGroup from "./RadioGroup.namespace";

function Example({ count }: { count: number }) {
  return (
    <RadioGroupField.Root defaultValue="0" accessibility-label="과일">
      <RadioGroup.Root>
        {Array.from({ length: count }, (_, index) => String(index)).map((value) => (
          <RadioGroup.Item key={value} value={value} accessibility-label={`항목 ${value}`}>
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>{`항목 ${value}`}</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </RadioGroupField.Root>
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
  const item = view.container.querySelector("[accessibility-label='항목 1']");
  if (!item) throw new Error("Missing item");
  const commits = await measureCommits(() => fireEvent.tap(item));
  expect(item.getAttribute("accessibility-value")).toBe("selected");
  view.unmount();
  return commits;
}

describe("RadioGroup commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // RadioSelectBox와 같이 선택 때 Item마다 commit이 하나씩 생긴다. headless Root(RadioGroupField.Root)와 Item 사이에
  // 컴포넌트(RadioGroup.Root)가 있어 SelectBox.commits.test.tsx와 같은 원인으로 보인다
  // (lynx-react-headless/radio-group/src/RadioGroup.tsx RadioGroupRoot의 Provider → RadioGroup.tsx RadioGroupItem).
  it("currently scales selection commits with the item count", async () => {
    expect(await selectSecond(2)).toMatchObject({ total: 9, nonEmpty: 6 });
    expect(await selectSecond(8)).toMatchObject({ total: 15, nonEmpty: 6 });
  });

  it.fails("commits a selection without scaling with the item count", async () => {
    const few = await selectSecond(2);
    const many = await selectSecond(8);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

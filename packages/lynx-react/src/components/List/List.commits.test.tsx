import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Checkbox from "../Checkbox/Checkbox.namespace";
import * as List from "./List.namespace";

function Example({ count }: { count: number }) {
  return (
    <List.Root>
      {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
        <List.CheckboxItem key={value} className={value}>
          <List.Content>
            <List.Title>{value}</List.Title>
            <List.Detail>설명</List.Detail>
          </List.Content>
          <List.Suffix>
            <Checkbox.Control />
          </List.Suffix>
        </List.CheckboxItem>
      ))}
    </List.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

describe("List commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it.each([2, 8])("commits toggling a checkbox item among %i items", async (count) => {
    const { view } = await mount(count);
    const item = view.container.querySelector(".item-1");
    if (!item) throw new Error("Missing item");
    const commits = await measureCommits(() => fireEvent.tap(item));
    expect(item.getAttribute("accessibility-value")).toBe("checked");
    expect(commits).toMatchObject({ total: 2, nonEmpty: 2 });
  });
});

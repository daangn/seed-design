import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Checkbox from "./Checkbox.namespace";

function Example({ count }: { count: number }) {
  return (
    <Checkbox.Group>
      {Array.from({ length: count }, (_, index) => `항목 ${index}`).map((label) => (
        <Checkbox.Root key={label}>
          <Checkbox.Control />
          <Checkbox.Label>{label}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Checkbox.Group>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

describe("Checkbox commits", () => {
  it.each([2, 8])("commits once when %i checkboxes mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a toggle", async () => {
    const { view } = await mount(2);
    const root = view.container.querySelector(".seed-checkbox__root");
    if (!root) throw new Error("Missing checkbox");
    const commits = await measureCommits(() => fireEvent.tap(root));
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 3, nonEmpty: 2 } : { total: 1, nonEmpty: 1 },
    );
  });
});

import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as TagGroup from "./TagGroup.namespace";

function Example({ count }: { count: number }) {
  return (
    <TagGroup.Root>
      {Array.from({ length: count }, (_, index) => `태그 ${index}`).map((label) => (
        <TagGroup.Item key={label}>
          <TagGroup.ItemLabel>{label}</TagGroup.ItemLabel>
        </TagGroup.Item>
      ))}
    </TagGroup.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

describe("TagGroup commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

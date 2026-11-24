import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as PullToRefresh from "./PullToRefresh.namespace";

function Example() {
  return (
    <PullToRefresh.Root>
      <PullToRefresh.Indicator>{() => <text>진행률</text>}</PullToRefresh.Indicator>
      <PullToRefresh.Content>
        <text>내용</text>
      </PullToRefresh.Content>
    </PullToRefresh.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

async function rerenderWithSameProps() {
  const { view } = await mount();
  return measureCommits(() => view.rerender(<Example />));
}

describe("PullToRefresh commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

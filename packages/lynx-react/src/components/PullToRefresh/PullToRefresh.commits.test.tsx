import { render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
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

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("PullToRefresh commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  // Preact 10에서는 같은 props로 rerender할 때마다 Root의 `main-thread:capture-bindtouchstart`, Indicator의
  // `main-thread:bindlayoutchange`, Content의 `main-thread:gesture` worklet을 새 실행 id로 다시 보낸다.
  // usePullToRefresh가 렌더마다 handler를 새로 만들어 context useMemo가 깨지는 것과 관련된 것으로 보인다
  // (lynx-react-headless/pull-to-refresh/src/usePullToRefresh.ts의 context useMemo deps).
  // 현재: Preact 10은 1회 중 patch 있는 commit 1회, 0.126 이상은 빈 commit 1회.
  (usesPreact10 ? it.fails : it)(
    "sends only empty commits when rerendered with the same props",
    async () => {
      const { view } = await mount();
      const commits = await measureCommits(() => view.rerender(<Example />));
      expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
    },
  );
});

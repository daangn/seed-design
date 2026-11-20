import * as React from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { Icon } from "./Icon";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} src="icon.png" />
));
TestIcon.displayName = "TestIcon";

function Example() {
  return <Icon icon={<TestIcon />} size="x5" color="fg.neutral" />;
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("Icon commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  // Preact 10에서는 같은 props로 rerender할 때마다 아이콘 `<image>`의 `main-thread:binduiappear` worklet을 새 실행
  // id로 다시 보낸다 (hooks/useIconColor.ts syncOnUiAppear). 원인은 확인하지 못했다. 현재: Preact 10은 1회 중 patch 있는
  // commit 1회, 0.126 이상은 빈 commit 1회.
  (usesPreact10 ? it.fails : it)(
    "sends only empty commits when rerendered with the same props",
    async () => {
      const { view } = await mount();
      const commits = await measureCommits(() => view.rerender(<Example />));
      expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
    },
  );
});

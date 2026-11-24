import * as React from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
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

describe("Icon commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

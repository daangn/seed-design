import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Switch from "./Switch.namespace";

function Example() {
  return (
    <Switch.Root>
      <Switch.Label>알림</Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("Switch commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a toggle", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-switch__root");
    if (!root) throw new Error("Missing switch");
    const commits = await measureCommits(() => fireEvent.tap(root));
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 3 } : { total: 1, nonEmpty: 1 },
    );
  });
});

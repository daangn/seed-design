import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Divider inset />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("Divider commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Divider inset />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

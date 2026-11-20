import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as ProgressCircle from "./ProgressCircle.namespace";

function Example({ value }: { value?: number }) {
  return (
    <ProgressCircle.Root minValue={0} maxValue={100} value={value}>
      <ProgressCircle.Track />
      <ProgressCircle.Range />
    </ProgressCircle.Root>
  );
}

async function mount(value?: number) {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example value={value} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
  });
  return { view, commits };
}

describe("ProgressCircle commits", () => {
  it.each([
    ["determinate", 40],
    ["indeterminate", undefined],
  ])("does not commit after hydration when %s mounts", async (_, value) => {
    const { commits } = await mount(value);
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it.each([
    ["determinate", 40],
    ["indeterminate", undefined],
  ])("sends only empty commits when %s rerenders with the same props", async (_, value) => {
    const { view } = await mount(value);
    const commits = await measureCommits(() => view.rerender(<Example value={value} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});

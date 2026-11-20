import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as QuantityPicker from "./QuantityPicker.namespace";

function Example() {
  return (
    <QuantityPicker.Root min={0} max={5} defaultValue={2} accessibility-label="수량">
      <QuantityPicker.DecrementButton accessibility-label="줄이기" />
      <QuantityPicker.ValueDisplay />
      <QuantityPicker.IncrementButton accessibility-label="늘리기" />
    </QuantityPicker.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("QuantityPicker commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits an increment", async () => {
    const { view } = await mount();
    const increment = view.container.querySelector('[accessibility-label="늘리기"]');
    if (!increment) throw new Error("Missing increment button");
    const commits = await measureCommits(() => fireEvent.tap(increment));
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 1 } : { total: 1, nonEmpty: 1 },
    );
  });
});

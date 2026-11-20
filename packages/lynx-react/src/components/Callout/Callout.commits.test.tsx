import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Callout from "./Callout.namespace";

function Example() {
  return (
    <Callout.Root tone="informative">
      <Callout.Content>
        <Callout.Title>제목</Callout.Title>
        <Callout.Description>설명</Callout.Description>
        <Callout.Link>더 보기</Callout.Link>
      </Callout.Content>
      <Callout.CloseButton accessibility-label="닫기" />
    </Callout.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("Callout commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits a dismiss", async () => {
    const { view } = await mount();
    const closeButton = view.container.querySelector(".seed-callout__closeButton");
    if (!closeButton) throw new Error("Missing close button");
    const commits = await measureCommits(() => fireEvent.tap(closeButton));
    expect(view.container.querySelector(".seed-callout__root")).toBeNull();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

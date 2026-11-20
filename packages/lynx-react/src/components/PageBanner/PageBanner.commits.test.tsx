import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as PageBanner from "./PageBanner.namespace";

function Example() {
  return (
    <PageBanner.Root tone="informative">
      <PageBanner.Content>
        <PageBanner.Body>
          <PageBanner.Title>제목</PageBanner.Title>
          <PageBanner.Description>설명</PageBanner.Description>
        </PageBanner.Body>
        <PageBanner.Button>확인</PageBanner.Button>
      </PageBanner.Content>
      <PageBanner.CloseButton accessibility-label="닫기" />
    </PageBanner.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("PageBanner commits", () => {
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
    const closeButton = view.container.querySelector(".seed-page-banner__closeButton");
    if (!closeButton) throw new Error("Missing close button");
    const commits = await measureCommits(() =>
      fireEvent.tap(closeButton, { eventType: "catchEvent" }),
    );
    expect(view.container.querySelector(".seed-page-banner__root")).toBeNull();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

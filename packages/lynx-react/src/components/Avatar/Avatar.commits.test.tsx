import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Avatar from "./Avatar.namespace";

function Example() {
  return (
    <Avatar.Root size="48">
      <Avatar.Fallback>
        <text>대체</text>
      </Avatar.Fallback>
      <Avatar.Image src="profile.png" alt="프로필" />
    </Avatar.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

function load(container: Element) {
  const image = container.querySelector("image");
  if (!image) throw new Error("Missing image");
  fireEvent(image, new Event("bindEvent:load"));
}

async function loadAfterMount() {
  const { view } = await mount();
  return measureCommits(() => load(view.container));
}

describe("Avatar commits", () => {
  // mount commit 뒤에 Image.Content가 mount effect에서 Image.Root에 loading 상태를 알리며 빈 commit을 보낸다
  // (lynx-react-headless/image/src/Image.tsx ImageContent setLoadingStatus → ImageRoot setStatus).
  it("commits a fixed number of times on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 4, nonEmpty: 1 } : { total: 3, nonEmpty: 1 },
    );
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // Preact 10에서는 load로 다시 렌더되는 컴포넌트마다 commit이 따로 생겨 빈 commit이 남는다.
  (usesPreact10 ? it.fails : it)("commits an image load without empty patches", async () => {
    const commits = await loadAfterMount();
    expect(commits.nonEmpty).toBe(commits.total);
  });

  (usesPreact10 ? it : it.skip)(
    "currently sends empty commits for an image load on Preact 10",
    async () => {
      expect(await loadAfterMount()).toMatchObject({ total: 3, nonEmpty: 2 });
    },
  );

  it("does not commit when the image load is reported again", async () => {
    const { view } = await mount();
    await measureCommits(() => load(view.container));
    const commits = await measureCommits(() => load(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });
});

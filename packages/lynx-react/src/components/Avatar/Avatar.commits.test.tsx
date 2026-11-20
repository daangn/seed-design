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

describe("Avatar commits", () => {
  // mount commit 뒤에 useImage effect가 Image.Root에 loading 상태를 알리며 빈 commit을 보낸다
  // (lynx-react-headless/image/src/useImage.ts notifyStatus → Image.tsx ImageRoot setStatus).
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

  // ImageFrame과 같이 Image.Content의 useImage state가 먼저 바뀌어 commit하고, effect가 Image.Root state로 옮긴 뒤에야
  // Avatar.Image의 pending className과 fallback을 바꾼다(lynx-react-headless/image/src/useImage.ts
  // updateStatus·notifyStatus → Image.tsx ImageRoot). 현재: 3회 중 patch 있는 commit 2회, Preact 10은 4회 중
  // 2회.
  it.fails("commits an image load without empty patches", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => load(view.container));
    expect(commits.nonEmpty).toBe(commits.total);
  });

  it("does not commit when the image load is reported again", async () => {
    const { view } = await mount();
    await measureCommits(() => load(view.container));
    const commits = await measureCommits(() => load(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });
});

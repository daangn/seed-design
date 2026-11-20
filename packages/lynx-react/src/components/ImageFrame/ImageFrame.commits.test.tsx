import { fireEvent, render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import { ImageFrame } from "./ImageFrame";

function Example({ count }: { count: number }) {
  return (
    <view>
      {Array.from({ length: count }, (_, index) => (
        <ImageFrame
          key={index}
          src={`photo-${index}.png`}
          alt="사진"
          fallback={<text>로딩 중</text>}
        />
      ))}
    </view>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

function load(container: Element) {
  for (const image of container.querySelectorAll("image")) {
    fireEvent(image, new Event("bindEvent:load"));
  }
}

describe("ImageFrame commits", () => {
  // useImage effect가 Image.Root에 loading 상태를 알릴 때 ImageFrame마다 빈 commit이 하나씩 생긴다
  // (lynx-react-headless/image/src/useImage.ts notifyStatus → Image.tsx ImageRoot setStatus).
  // 현재: 1개 2회·4개 5회(patch 있는 commit 1회), Preact 10은 4회·13회(1회).
  it.fails("does not scale mount commits with the image count", async () => {
    const few = await mount(1);
    few.view.unmount();
    const many = await mount(4);
    expect(many.commits.total).toBe(few.commits.total);
    expect(few.commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(1);
    const commits = await measureCommits(() => view.rerender(<Example count={1} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // Image.Content의 useImage state가 먼저 바뀌어 빈 commit을 보내고, effect가 Image.Root state로 옮긴 뒤에야 fallback을 지운다
  // (lynx-react-headless/image/src/useImage.ts updateStatus·notifyStatus → Image.tsx ImageRoot). 현재: 2회 중 빈 commit 1회, Preact 10은 4회 중 2회.
  it.fails("commits an image load without empty patches", async () => {
    const { view } = await mount(1);
    const commits = await measureCommits(() => load(view.container));
    expect(commits.nonEmpty).toBe(commits.total);
  });

  it("does not commit when the image load is reported again", async () => {
    const { view } = await mount(1);
    await measureCommits(() => load(view.container));
    const commits = await measureCommits(() => load(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });
});

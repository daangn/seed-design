import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
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

// 기기처럼 mount한 뒤 이미지마다 load를 따로 보내 정착까지 센다.
async function mountAndLoad(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example count={count} />);
    await waitSchedule();
    for (const image of view.container.querySelectorAll("image")) {
      fireEvent(image, new Event("bindEvent:load"));
      await waitSchedule();
    }
  });
  view.unmount();
  return commits;
}

async function loadAfterMount() {
  const { view } = await mount(1);
  return measureCommits(() => load(view.container));
}

describe("ImageFrame commits", () => {
  // Image.Content가 mount effect에서 Image.Root에 loading 상태를 알릴 때 ImageFrame마다 빈 commit이 하나씩 생긴다
  // (lynx-react-headless/image/src/Image.tsx ImageContent setLoadingStatus → ImageRoot setStatus). load는 기기처럼 이미지마다
  // 따로 오므로 Background Thread에서 fallback을 지우는 한 이미지마다 commit한다. 목표는 mount 1회와 load 반영 1회다.
  it("currently scales mount and load commits with the image count", async () => {
    expect(await mountAndLoad(1)).toMatchObject(
      usesPreact10 ? { total: 7, nonEmpty: 3 } : { total: 3, nonEmpty: 2 },
    );
    expect(await mountAndLoad(4)).toMatchObject(
      usesPreact10 ? { total: 25, nonEmpty: 9 } : { total: 9, nonEmpty: 5 },
    );
  });

  it.fails("does not scale mount and load commits with the image count", async () => {
    const few = await mountAndLoad(1);
    const many = await mountAndLoad(4);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 2, nonEmpty: 2 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(1);
    const commits = await measureCommits(() => view.rerender(<Example count={1} />));
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
    const { view } = await mount(1);
    await measureCommits(() => load(view.container));
    const commits = await measureCommits(() => load(view.container));
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });
});

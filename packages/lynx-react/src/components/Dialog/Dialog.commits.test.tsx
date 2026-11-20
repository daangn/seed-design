import { act, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it } from "vitest";

import * as Dialog from "./Dialog.namespace";

// lynx-ui-presence는 테스트 환경에 없는 `lynx.requestAnimationFrame`으로 열림·닫힘 단계를 진행한다.
// 예약된 frame을 비울 때까지 직접 돌린다.
let frames: (() => void)[] = [];

beforeEach(() => {
  frames = [];
  const animationFrames = {
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
    cancelAnimationFrame: () => {},
  };
  Object.assign(lynx, animationFrames);
  Object.assign(lynxTestingEnv.backgroundThread["lynx"], animationFrames);
  Object.assign(lynxTestingEnv.mainThread["lynx"], animationFrames);
});

async function flushFrames() {
  await waitSchedule();
  while (frames.length > 0) {
    const pending = frames;
    frames = [];
    act(() => {
      for (const callback of pending) callback();
    });
    await waitSchedule();
  }
}

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="trigger">
        <text>열기</text>
      </Dialog.Trigger>
      <Dialog.Positioner>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>제목</Dialog.Title>
            <Dialog.Description>설명</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Action>
              <text>닫기</text>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

function getTrigger(container: Element) {
  const trigger = container.querySelector(".trigger");
  if (!trigger) throw new Error("Missing trigger");
  return trigger;
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(async () => {
    view.rerender(<Example />);
    await flushFrames();
  });
  return { view, commits };
}

describe("Dialog commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered open with the same props", async () => {
    const { view } = await mount();
    fireEvent.tap(getTrigger(view.container));
    await flushFrames();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits opening", async () => {
    const { view } = await mount();
    const commits = await measureCommits(async () => {
      fireEvent.tap(getTrigger(view.container));
      await flushFrames();
    });
    expect(view.container.querySelector(".seed-dialog__content")).not.toBeNull();
    // SEED 부품 없이 lynx-ui-dialog만 같은 구조로 조립해도 같은 수다. 모두 lynx-ui의 state가 따로 commit한다.
    // tap: Root(빈 commit), DialogView의 layer mount, Backdrop·Content의 Presence mount.
    // lynx-ui-presence의 Entering·Entered 단계: 각각 Root 1회. Entered 뒤 열린 자식 수 집계: 빈 commit 1회.
    // 같은 업데이트로 다시 렌더되는 컴포넌트마다 commit이 따로 생긴다.
    expect(commits).toMatchObject({ total: 21, nonEmpty: 13 });
  });
});

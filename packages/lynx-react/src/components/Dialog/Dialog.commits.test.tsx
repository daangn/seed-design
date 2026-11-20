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

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(async () => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await flushFrames();
  });
  return { view, commits };
}

describe("Dialog commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
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
    expect(commits).toMatchObject({ total: 19, nonEmpty: 13 });
  });
});

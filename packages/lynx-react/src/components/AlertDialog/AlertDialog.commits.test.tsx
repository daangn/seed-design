import { act, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it } from "vitest";

import * as AlertDialog from "./AlertDialog.namespace";

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
    <AlertDialog.Root>
      <AlertDialog.Trigger className="trigger">
        <text>열기</text>
      </AlertDialog.Trigger>
      <AlertDialog.Positioner>
        <AlertDialog.Backdrop />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>제목</AlertDialog.Title>
            <AlertDialog.Description>설명</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Action>
              <text>확인</text>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Positioner>
    </AlertDialog.Root>
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

describe("AlertDialog commits", () => {
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
    expect(view.container.querySelector(".seed-alert-dialog__content")).not.toBeNull();
    expect(commits).toMatchObject({ total: 19, nonEmpty: 13 });
  });
});

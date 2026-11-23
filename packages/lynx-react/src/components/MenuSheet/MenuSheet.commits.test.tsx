import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

// 실제 sheet 엔진은 테스트 환경의 preact에 없는 `createPortal`을 import해 불러올 수 없다.
// MenuSheet.test.tsx처럼 headless를 mock해 모든 part를 바로 렌더하므로 열기·닫기는 세지 않는다.
vi.mock("@seed-design/lynx-react-bottom-sheet", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");
  const value = { skipAnimation: false, layerSize: {} };
  const Context = React.createContext(value);
  const Passthrough = (props: { children?: React.ReactNode }) => <>{props.children}</>;
  const tap = () => {};

  return {
    BottomSheetRoot: (props: { children?: React.ReactNode }) => (
      <Context.Provider value={value}>{props.children}</Context.Provider>
    ),
    BottomSheetContent: Passthrough,
    BottomSheetHandle: (props: { className?: string; children?: React.ReactNode }) => (
      <view className={props.className}>{props.children}</view>
    ),
    BottomSheetBackdrop: (props: { children?: React.ReactNode }) => <view>{props.children}</view>,
    BottomSheetPositioner: Passthrough,
    useBottomSheetContext: () => React.useContext(Context),
    useBottomSheetTrigger: () => ({ triggerProps: { bindtap: tap } }),
    useBottomSheetCloseButton: () => ({ closeButtonProps: { bindtap: tap } }),
  };
});

import * as MenuSheet from "./MenuSheet.namespace";

function Example({ count }: { count: number }) {
  return (
    <MenuSheet.Root>
      <MenuSheet.Positioner>
        <MenuSheet.Backdrop />
        <MenuSheet.Content>
          <MenuSheet.Header>
            <MenuSheet.Title>제목</MenuSheet.Title>
          </MenuSheet.Header>
          <MenuSheet.List>
            <MenuSheet.Group>
              {Array.from({ length: count }, (_, index) => `item-${index}`).map((value) => (
                <MenuSheet.Item key={value} className={value}>
                  <MenuSheet.ItemContent>
                    <MenuSheet.ItemLabel>{value}</MenuSheet.ItemLabel>
                  </MenuSheet.ItemContent>
                </MenuSheet.Item>
              ))}
            </MenuSheet.Group>
          </MenuSheet.List>
          <MenuSheet.Footer>
            <MenuSheet.CloseButton>취소</MenuSheet.CloseButton>
          </MenuSheet.Footer>
        </MenuSheet.Content>
      </MenuSheet.Positioner>
    </MenuSheet.Root>
  );
}

// List의 SheetScrollGesture가 touch 위치를 읽으므로 detail을 채워 보낸다.
function fireTouch(target: Element, name: "touchstart" | "touchend") {
  const init = { eventType: "bindEvent", eventName: name, detail: { x: 0, y: 0 } };
  const event = createEvent(`bindEvent:${name}`, target, init);
  Object.assign(event, init);
  fireEvent(target, event);
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

async function rerenderWithSameProps() {
  const { view } = await mount(2);
  return measureCommits(() => view.rerender(<Example count={2} />));
}

describe("MenuSheet commits", () => {
  it.each([2, 8])("commits once when %i items mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  // 같은 props로 rerender할 때마다 List scroll-view의
  // `main-thread:bindscroll`·`bindtouchstart`·`bindtouchmove` worklet을 새 실행 id로 다시
  // 보낸다(components/private/SheetScrollGesture.ts). 원인은 확인하지 못했다.
  it.fails("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("currently sends a patch when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it.each([2, 8])("commits pressing and releasing one of %i items", async (count) => {
    const { view } = await mount(count);
    const item = view.container.querySelector(".item-1");
    if (!item) throw new Error("Missing item");
    const commits = await measureCommits(async () => {
      fireTouch(item, "touchstart");
      await waitSchedule();
      fireTouch(item, "touchend");
    });
    expect(commits).toMatchObject({ total: 6, nonEmpty: 6 });
  });
});

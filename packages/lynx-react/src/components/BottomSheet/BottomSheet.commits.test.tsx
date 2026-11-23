import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

// 실제 sheet 엔진은 테스트 환경의 preact에 없는 `createPortal`을 import해 불러올 수 없다.
// BottomSheet.test.tsx처럼 headless를 mock해 모든 part를 바로 렌더하므로 SEED 레이어의 mount·rerender만 센다.
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

import * as BottomSheet from "./BottomSheet.namespace";

function Example() {
  return (
    <BottomSheet.Root>
      <BottomSheet.Trigger>
        <text>열기</text>
      </BottomSheet.Trigger>
      <BottomSheet.Positioner>
        <BottomSheet.Backdrop />
        <BottomSheet.Content>
          <BottomSheet.Header>
            <BottomSheet.Title>제목</BottomSheet.Title>
            <BottomSheet.Description>설명</BottomSheet.Description>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <text>내용</text>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <text>확인</text>
          </BottomSheet.Footer>
          <BottomSheet.CloseButton accessibility-label="닫기" />
        </BottomSheet.Content>
      </BottomSheet.Positioner>
    </BottomSheet.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

async function rerenderWithSameProps() {
  const { view } = await mount();
  return measureCommits(() => view.rerender(<Example />));
}

describe("BottomSheet commits", () => {
  it("commits a fixed number of times on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 11, nonEmpty: 7 });
  });

  // 같은 props로 rerender할 때마다 Body scroll-view의
  // `main-thread:bindscroll`·`bindtouchstart`·`bindtouchmove` worklet을 새 실행 id로 다시
  // 보낸다(components/private/SheetScrollGesture.ts). 원인은 확인하지 못했다.
  it.fails("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("currently sends a patch when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});

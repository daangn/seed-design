import { render } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
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

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("BottomSheet commits", () => {
  it("commits a fixed number of times on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 10, nonEmpty: 6 } : { total: 0, nonEmpty: 0 },
    );
  });

  // Preact 10에서는 같은 props로 rerender할 때마다 Body scroll-view의
  // `main-thread:bindscroll`·`bindtouchstart`·`bindtouchmove` worklet을 새 실행 id로 다시
  // 보낸다(components/private/SheetScrollGesture.ts). 원인은 확인하지 못했다. 현재: Preact 10은 1회 중 patch 있는
  // commit 1회, 0.126 이상은 빈 commit 1회.
  (usesPreact10 ? it.fails : it)(
    "sends only empty commits when rerendered with the same props",
    async () => {
      const { view } = await mount();
      const commits = await measureCommits(() => view.rerender(<Example />));
      expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
    },
  );
});

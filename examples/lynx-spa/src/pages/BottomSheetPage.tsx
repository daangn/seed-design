import { useRef, useState } from "@lynx-js/react";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";
import { vars } from "@seed-design/lynx-css/vars";
import { ActionButton } from "@seed-design/lynx-react";

// `seed-design add ui:bottom-sheet -f lynx`로 설치된 snippet. 실제 사용자가 소비하는 경로를
// 재현해 설치 플로우까지 E2E로 검증한다. (직접 소스 테스트용 import는 `ActionButton` 참고)
import * as BottomSheet from "../seed-design/ui/bottom-sheet";

const SNAP_POINTS_FIT_80: Array<number | string> = ["fit", "80%"];
const SNAP_POINTS_FIT: Array<number | string> = ["fit"];

const { $color } = vars;

export function BottomSheetPage() {
  const uncontrolledRef = useRef<SheetRootRef>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>BottomSheet</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Uncontrolled (Trigger 기반)</text>
      <BottomSheet.Root snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheet.Trigger
          style={{
            padding: "10px 16px",
            backgroundColor: $color.bg.brandSolid,
            borderRadius: "8px",
            alignSelf: "flex-start",
          }}
        >
          <text style={{ color: $color.fg.brandContrast }}>Trigger 탭</text>
        </BottomSheet.Trigger>
        <BottomSheet.Positioner>
          <BottomSheet.Backdrop />
          <BottomSheet.Content>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <BottomSheet.Title>기본 Bottom Sheet</BottomSheet.Title>
              <BottomSheet.Description>Trigger를 탭하면 열립니다.</BottomSheet.Description>
            </BottomSheet.Header>
            <BottomSheet.Body>
              <text>본문에 자유로운 Lynx 엘리먼트를 배치할 수 있습니다.</text>
            </BottomSheet.Body>
            <BottomSheet.Footer>
              <text>하단 액션 영역</text>
            </BottomSheet.Footer>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </BottomSheet.Root>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Imperative ref</text>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px", flexWrap: "wrap" }}>
        <ActionButton bindtap={() => uncontrolledRef.current?.open()}>open()</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(0)}>snapTo(0)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(1)}>snapTo(1)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.close()}>close()</ActionButton>
      </view>
      <BottomSheet.Root ref={uncontrolledRef} snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheet.Positioner>
          <BottomSheet.Backdrop />
          <BottomSheet.Content>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <BottomSheet.Title>Imperative 예제</BottomSheet.Title>
            </BottomSheet.Header>
            <BottomSheet.Body>
              <text>위 버튼으로 snapTo/open/close를 호출합니다.</text>
            </BottomSheet.Body>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </BottomSheet.Root>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Controlled</text>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <ActionButton bindtap={() => setControlledOpen(true)}>open=true</ActionButton>
        <ActionButton bindtap={() => setControlledOpen(false)}>open=false</ActionButton>
      </view>
      <BottomSheet.Root
        open={controlledOpen}
        onOpenChange={setControlledOpen}
        snapPoints={SNAP_POINTS_FIT}
      >
        <BottomSheet.Positioner>
          <BottomSheet.Backdrop />
          <BottomSheet.Content>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <BottomSheet.Title>Controlled 예제</BottomSheet.Title>
              <BottomSheet.Description>
                backdrop 탭 / drag-to-close 시 onOpenChange로 외부 state가 갱신됩니다.
              </BottomSheet.Description>
            </BottomSheet.Header>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </BottomSheet.Root>
    </scroll-view>
  );
}

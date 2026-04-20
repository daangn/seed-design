import { useRef, useState } from "@lynx-js/react";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";
import { vars } from "@seed-design/lynx-css/vars";
import {
  ActionButton,
  BottomSheetBackdrop,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHandle,
  BottomSheetHeader,
  BottomSheetRoot,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@seed-design/lynx-react";

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
      <BottomSheetRoot snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetTrigger
          style={{
            padding: "10px 16px",
            backgroundColor: $color.bg.brandSolid,
            borderRadius: "8px",
            alignSelf: "flex-start",
          }}
        >
          <text style={{ color: $color.fg.brandContrast }}>Trigger 탭</text>
        </BottomSheetTrigger>
        <BottomSheetBackdrop />
        <BottomSheetContent>
          <BottomSheetHandle />
          <BottomSheetHeader>
            <BottomSheetTitle>기본 Bottom Sheet</BottomSheetTitle>
            <BottomSheetDescription>Trigger를 탭하면 열립니다.</BottomSheetDescription>
          </BottomSheetHeader>
          <BottomSheetBody>
            <text>본문에 자유로운 Lynx 엘리먼트를 배치할 수 있습니다.</text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <text>하단 액션 영역</text>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Imperative ref</text>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px", flexWrap: "wrap" }}>
        <ActionButton bindtap={() => uncontrolledRef.current?.open()}>open()</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(0)}>snapTo(0)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(1)}>snapTo(1)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.close()}>close()</ActionButton>
      </view>
      <BottomSheetRoot ref={uncontrolledRef} snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetBackdrop />
        <BottomSheetContent>
          <BottomSheetHandle />
          <BottomSheetHeader>
            <BottomSheetTitle>Imperative 예제</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody>
            <text>위 버튼으로 snapTo/open/close를 호출합니다.</text>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Controlled</text>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <ActionButton bindtap={() => setControlledOpen(true)}>open=true</ActionButton>
        <ActionButton bindtap={() => setControlledOpen(false)}>open=false</ActionButton>
      </view>
      <BottomSheetRoot
        open={controlledOpen}
        onOpenChange={setControlledOpen}
        snapPoints={SNAP_POINTS_FIT}
      >
        <BottomSheetBackdrop />
        <BottomSheetContent>
          <BottomSheetHandle />
          <BottomSheetHeader>
            <BottomSheetTitle>Controlled 예제</BottomSheetTitle>
            <BottomSheetDescription>
              backdrop 탭 / drag-to-close 시 onOpenChange로 외부 state가 갱신됩니다.
            </BottomSheetDescription>
          </BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheetRoot>
    </scroll-view>
  );
}

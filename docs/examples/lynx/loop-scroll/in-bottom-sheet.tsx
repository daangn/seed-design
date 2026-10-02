import { useState } from "@lynx-js/react";
import { BottomSheet } from "@seed-design/lynx-react-bottom-sheet";
import { LoopScroll } from "@seed-design/lynx-react-loop-scroll";

const HOURS = Array.from({ length: 24 }, (_, index) => `${index}시`);

export default function LoopScrollInBottomSheetExample() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  function handleIndexChange(nextIndex: number) {
    "background only";
    setIndex(nextIndex);
  }

  return (
    <view
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <text id="loop-scroll-sheet-status" style={{ color: "#555d6d", fontSize: "14px" }}>
        {`open=${open} index=${index}`}
      </text>
      <BottomSheet.Root open={open} onOpenChange={handleOpenChange}>
        <BottomSheet.Trigger
          accessibility-element
          accessibility-traits="button"
          accessibility-label="시트 열기"
          style={{
            marginTop: "12px",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: "#212124",
          }}
        >
          <text style={{ color: "#ffffff", fontWeight: "700" }}>시트 열기</text>
        </BottomSheet.Trigger>
        <BottomSheet.Positioner style={{ top: "0px", right: "0px", bottom: "0px", left: "0px" }}>
          <BottomSheet.Backdrop style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
          <BottomSheet.Content
            style={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              backgroundColor: "#ffffff",
            }}
            innerStyle={{ padding: "0px 20px 40px" }}
          >
            <BottomSheet.Handle
              style={{
                display: "flex",
                height: "32px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <view
                style={{
                  width: "36px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "#d1d3d8",
                }}
              />
            </BottomSheet.Handle>
            <text
              id="loop-scroll-sheet-title"
              style={{ color: "#1a1c20", fontSize: "18px", fontWeight: "700" }}
            >
              시간 선택
            </text>
            <text style={{ marginTop: "4px", color: "#555d6d", fontSize: "13px" }}>
              휠을 끌어도 시트는 움직이지 않아야 합니다.
            </text>
            <LoopScroll.Root
              id="loop-scroll-sheet-wheel"
              itemCount={HOURS.length}
              itemSize={44}
              visibleItemCount={5}
              index={index}
              onIndexChange={handleIndexChange}
              style={{
                marginTop: "16px",
                borderRadius: "12px",
                backgroundColor: "#f2f3f6",
              }}
            >
              <view
                style={{
                  position: "absolute",
                  top: "88px",
                  right: "8px",
                  left: "8px",
                  height: "44px",
                  borderRadius: "8px",
                  backgroundColor: "#dcdee3",
                }}
              />
              <LoopScroll.Track>
                {(item) => (
                  <view
                    style={{
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <text style={{ color: "#1a1c20", fontSize: "18px" }}>{HOURS[item.index]}</text>
                  </view>
                )}
              </LoopScroll.Track>
            </LoopScroll.Root>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </BottomSheet.Root>
    </view>
  );
}

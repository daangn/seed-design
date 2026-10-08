import { BottomSheet } from "@seed-design/lynx-react-bottom-sheet";

export default function Example() {
  return (
    <BottomSheet.Root snapPoints={["fit", "80%"]}>
      <BottomSheet.Trigger
        accessibility-element
        accessibility-traits="button"
        accessibility-label="시트 열기"
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          backgroundColor: "var(--seed-color-bg-neutral-solid)",
        }}
      >
        <text style={{ color: "var(--seed-color-fg-on-neutral-solid)", fontWeight: "700" }}>
          시트 열기
        </text>
      </BottomSheet.Trigger>
      <BottomSheet.Positioner style={{ top: "0px", right: "0px", bottom: "0px", left: "0px" }}>
        <BottomSheet.Backdrop style={{ backgroundColor: "var(--seed-color-bg-overlay)" }} />
        <BottomSheet.Content
          style={{
            backgroundColor: "var(--seed-color-bg-layer-floating)",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
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
                backgroundColor: "var(--seed-color-stroke-neutral-weak)",
              }}
            />
          </BottomSheet.Handle>
          <text
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--seed-color-fg-neutral)",
            }}
          >
            직접 꾸민 시트
          </text>
          <text
            style={{
              marginTop: "8px",
              fontSize: "15px",
              color: "var(--seed-color-fg-neutral-muted)",
            }}
          >
            Handle을 위로 끌면 80% 높이로 펼쳐집니다.
          </text>
        </BottomSheet.Content>
      </BottomSheet.Positioner>
    </BottomSheet.Root>
  );
}

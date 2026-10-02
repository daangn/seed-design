import { useState } from "@lynx-js/react";
import { LoopScroll, type LoopScrollIndexChangeDetails } from "@seed-design/lynx-react-loop-scroll";

const MONTHS = Array.from({ length: 12 }, (_, index) => `${index + 1}월`);

export default function StandaloneLoopScrollExample() {
  const [index, setIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepDelta, setStepDelta] = useState(0);
  const [changeCount, setChangeCount] = useState(0);

  function handleIndexChange(nextIndex: number, details: LoopScrollIndexChangeDetails) {
    "background only";
    setIndex(nextIndex);
    setStepDelta(details.stepDelta);
    setChangeCount((current) => current + 1);
  }

  function handleActiveIndexChange(nextIndex: number) {
    "background only";
    setActiveIndex(nextIndex);
  }

  function handleAdvance() {
    "background only";
    setIndex((current) => (current + 5) % MONTHS.length);
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
      <text style={{ marginBottom: "6px", color: "#1a1c20", fontSize: "16px", fontWeight: "700" }}>
        끝을 여러 번 넘겨서 끌어보세요
      </text>
      <text
        id="loop-scroll-status"
        style={{ marginBottom: "16px", color: "#555d6d", fontSize: "13px" }}
      >
        {`index=${index} active=${activeIndex} stepDelta=${stepDelta} changes=${changeCount}`}
      </text>
      <LoopScroll.Root
        id="loop-scroll-wheel"
        itemCount={MONTHS.length}
        itemSize={44}
        visibleItemCount={5}
        index={index}
        indexChangeBehavior="smooth"
        onIndexChange={handleIndexChange}
        onActiveIndexChange={handleActiveIndexChange}
        style={{ width: "220px", borderRadius: "12px", backgroundColor: "#f2f3f6" }}
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
              <text style={{ color: "#b0b3ba", fontSize: "18px" }}>{MONTHS[item.index]}</text>
            </view>
          )}
        </LoopScroll.Track>
        <LoopScroll.Highlight>
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
                <text style={{ color: "#1a1c20", fontSize: "18px" }}>{MONTHS[item.index]}</text>
              </view>
            )}
          </LoopScroll.Track>
        </LoopScroll.Highlight>
      </LoopScroll.Root>
      <view
        accessibility-element
        accessibility-traits="button"
        accessibility-label="5개월 뒤로 이동"
        bindtap={handleAdvance}
        style={{
          marginTop: "16px",
          padding: "10px 16px",
          borderRadius: "8px",
          backgroundColor: "#212124",
        }}
      >
        <text style={{ color: "#ffffff", fontSize: "14px", fontWeight: "700" }}>index + 5</text>
      </view>
    </view>
  );
}

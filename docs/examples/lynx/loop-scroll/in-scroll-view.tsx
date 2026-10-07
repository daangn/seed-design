import { useState } from "@lynx-js/react";
import { LoopScroll } from "@seed-design/lynx-react-loop-scroll";

const MINUTES = Array.from({ length: 60 }, (_, index) => `${index}분`);

export default function LoopScrollInScrollViewExample() {
  const [index, setIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [disabled, setDisabled] = useState(false);

  function handleIndexChange(nextIndex: number) {
    "background only";
    setIndex(nextIndex);
  }

  function handleToggleDisabled() {
    "background only";
    setDisabled((current) => !current);
  }

  return (
    <scroll-view
      id="loop-scroll-outer-scroll"
      scroll-orientation="vertical"
      bindscroll={(event) => {
        "background only";
        setScrollTop(Math.round(event.detail.scrollTop));
      }}
      style={{ width: "100%", flex: 1, minHeight: 0 }}
    >
      <view style={{ display: "flex", flexDirection: "column" }}>
        <text
          id="loop-scroll-outer-status"
          style={{ color: "var(--seed-color-fg-neutral-muted)", fontSize: "13px" }}
        >
          {`scrollTop=${scrollTop} index=${index} disabled=${disabled}`}
        </text>
        <text
          style={{
            marginTop: "6px",
            color: "var(--seed-color-fg-neutral)",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          켜진 휠은 바깥 스크롤을 멈춰야 합니다
        </text>
        <view
          accessibility-element
          accessibility-traits="button"
          accessibility-label={disabled ? "휠 켜기" : "휠 끄기"}
          bindtap={handleToggleDisabled}
          style={{
            alignSelf: "flex-start",
            marginTop: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "var(--seed-color-bg-neutral-solid)",
          }}
        >
          <text
            style={{
              color: "var(--seed-color-fg-on-neutral-solid)",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            {disabled ? "휠 켜기" : "휠 끄기"}
          </text>
        </view>
        <view
          style={{
            display: "flex",
            height: "160px",
            marginTop: "16px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "var(--seed-color-bg-neutral-muted)",
          }}
        >
          <text style={{ color: "var(--seed-color-fg-neutral-muted)" }}>바깥 스크롤 영역</text>
        </view>
        <LoopScroll.Root
          id="loop-scroll-nested-wheel"
          itemCount={MINUTES.length}
          itemSize={44}
          visibleItemCount={5}
          index={index}
          disabled={disabled}
          onIndexChange={handleIndexChange}
          style={{
            marginTop: "16px",
            borderRadius: "12px",
            backgroundColor: "var(--seed-color-bg-neutral-weak)",
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
              backgroundColor: "var(--seed-color-bg-neutral-muted)",
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
                <text style={{ color: "var(--seed-color-fg-neutral)", fontSize: "18px" }}>
                  {MINUTES[item.index]}
                </text>
              </view>
            )}
          </LoopScroll.Track>
        </LoopScroll.Root>
        <view
          style={{
            display: "flex",
            height: "900px",
            marginTop: "16px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "var(--seed-color-bg-neutral-muted)",
          }}
        >
          <text style={{ color: "var(--seed-color-fg-neutral-muted)" }}>아래 영역</text>
        </view>
      </view>
    </scroll-view>
  );
}

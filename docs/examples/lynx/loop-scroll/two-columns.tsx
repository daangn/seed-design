import { useState } from "@lynx-js/react";
import { LoopScroll } from "@seed-design/lynx-react-loop-scroll";

const ITEM_SIZE = 44;
const VISIBLE_ITEM_COUNT = 5;
const HOURS = Array.from({ length: 24 }, (_, index) => `${index}시`);
const MINUTES = Array.from({ length: 60 }, (_, index) => `${index}분`);

interface ColumnProps {
  id: string;
  labels: string[];
  index: number;
  onIndexChange: (index: number) => void;
}

function Column({ id, labels, index, onIndexChange }: ColumnProps) {
  return (
    <LoopScroll.Root
      id={id}
      itemCount={labels.length}
      itemSize={ITEM_SIZE}
      visibleItemCount={VISIBLE_ITEM_COUNT}
      index={index}
      onIndexChange={onIndexChange}
      style={{ flexGrow: 1, flexBasis: "0px" }}
    >
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
            <text style={{ color: "#1a1c20", fontSize: "18px" }}>{labels[item.index]}</text>
          </view>
        )}
      </LoopScroll.Track>
    </LoopScroll.Root>
  );
}

export default function LoopScrollTwoColumnsExample() {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);

  function handleHourChange(nextHour: number) {
    "background only";
    setHour(nextHour);
  }

  function handleMinuteChange(nextMinute: number) {
    "background only";
    setMinute(nextMinute);
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
        시와 분을 따로 끌어보세요
      </text>
      <text
        id="loop-scroll-two-columns-status"
        style={{ marginBottom: "16px", color: "#555d6d", fontSize: "13px" }}
      >
        {`hour=${hour} minute=${minute}`}
      </text>
      <view
        style={{
          display: "flex",
          width: "240px",
          flexDirection: "row",
          borderRadius: "12px",
          backgroundColor: "#f2f3f6",
        }}
      >
        <view
          style={{
            position: "absolute",
            top: `${ITEM_SIZE * Math.floor(VISIBLE_ITEM_COUNT / 2)}px`,
            right: "8px",
            left: "8px",
            height: `${ITEM_SIZE}px`,
            borderRadius: "8px",
            backgroundColor: "#dcdee3",
          }}
        />
        <Column
          id="loop-scroll-hour"
          labels={HOURS}
          index={hour}
          onIndexChange={handleHourChange}
        />
        <Column
          id="loop-scroll-minute"
          labels={MINUTES}
          index={minute}
          onIndexChange={handleMinuteChange}
        />
      </view>
    </view>
  );
}

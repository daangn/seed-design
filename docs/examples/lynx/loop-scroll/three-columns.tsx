import { useState } from "@lynx-js/react";
import { LoopScroll } from "@seed-design/lynx-react-loop-scroll";

const ITEM_SIZE = 44;
const VISIBLE_ITEM_COUNT = 5;
const FIRST_YEAR = 2020;
const YEARS = Array.from({ length: 16 }, (_, index) => `${FIRST_YEAR + index}년`);
const MONTHS = Array.from({ length: 12 }, (_, index) => `${index + 1}월`);

function getDayLabels(yearIndex: number, monthIndex: number) {
  const dayCount = new Date(FIRST_YEAR + yearIndex, monthIndex + 1, 0).getDate();
  return Array.from({ length: dayCount }, (_, index) => `${index + 1}일`);
}

interface ColumnProps {
  id: string;
  labels: string[];
  index: number;
  loop?: boolean;
  onIndexChange: (index: number) => void;
}

function Column({ id, labels, index, loop, onIndexChange }: ColumnProps) {
  return (
    <LoopScroll.Root
      id={id}
      itemCount={labels.length}
      itemSize={ITEM_SIZE}
      visibleItemCount={VISIBLE_ITEM_COUNT}
      loop={loop}
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
            <text style={{ color: "#1a1c20", fontSize: "17px" }}>{labels[item.index]}</text>
          </view>
        )}
      </LoopScroll.Track>
    </LoopScroll.Root>
  );
}

export default function LoopScrollThreeColumnsExample() {
  const [year, setYear] = useState(6);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(30);
  const dayLabels = getDayLabels(year, month);

  function handleYearChange(nextYear: number) {
    "background only";
    setYear(nextYear);
    // 2월 29일처럼 바뀐 달에 없는 날짜는 그 달의 마지막 날로 맞춥니다.
    setDay((current) => Math.min(current, getDayLabels(nextYear, month).length - 1));
  }

  function handleMonthChange(nextMonth: number) {
    "background only";
    setMonth(nextMonth);
    setDay((current) => Math.min(current, getDayLabels(year, nextMonth).length - 1));
  }

  function handleDayChange(nextDay: number) {
    "background only";
    setDay(nextDay);
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
        달을 바꾸면 날짜 수가 함께 바뀝니다
      </text>
      <text
        id="loop-scroll-three-columns-status"
        style={{ marginBottom: "16px", color: "#555d6d", fontSize: "13px" }}
      >
        {`${YEARS[year]} ${MONTHS[month]} ${dayLabels[day]} (days=${dayLabels.length})`}
      </text>
      <view
        style={{
          display: "flex",
          width: "300px",
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
          id="loop-scroll-year"
          labels={YEARS}
          index={year}
          loop={false}
          onIndexChange={handleYearChange}
        />
        <Column
          id="loop-scroll-month"
          labels={MONTHS}
          index={month}
          onIndexChange={handleMonthChange}
        />
        <Column
          id="loop-scroll-day"
          labels={dayLabels}
          index={day}
          onIndexChange={handleDayChange}
        />
      </view>
    </view>
  );
}

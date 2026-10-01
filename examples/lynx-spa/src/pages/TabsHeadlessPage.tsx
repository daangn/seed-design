import { useState } from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";
import { Tabs, useTabsContext, useTabsTriggerContext } from "@seed-design/lynx-react-tabs";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/tabs-headless.css";

const manyTabs = [
  "추천",
  "동네소식",
  "중고거래",
  "알바",
  "부동산",
  "중고차",
  "동네가게",
  "모임",
  "같이해요",
];

function TriggerLabel({ children }: { children: string }) {
  const { isSelected, isDisabled } = useTabsTriggerContext();
  const className = isDisabled
    ? "tabs-headless-label tabs-headless-label-disabled"
    : isSelected
      ? "tabs-headless-label tabs-headless-label-selected"
      : "tabs-headless-label";

  return <text className={className}>{children}</text>;
}

function Trigger({
  value,
  disabled,
  children,
}: {
  value: string;
  disabled?: boolean;
  children: string;
}) {
  return (
    <Tabs.Trigger className="tabs-headless-trigger" value={value} disabled={disabled}>
      <TriggerLabel>{children}</TriggerLabel>
    </Tabs.Trigger>
  );
}

/** Carousel 밖의 Content는 숨김을 소비자가 정한다. */
function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { value: selectedValue } = useTabsContext();
  const className =
    selectedValue === value ? "tabs-headless-content" : "tabs-headless-content-hidden";

  return (
    <Tabs.Content className={className} value={value}>
      {children}
    </Tabs.Content>
  );
}

/** 측정이 끝난 다음 업데이트부터 transition을 켜 첫 진입에 미끄러지지 않게 한다. */
function Indicator() {
  const { transitionsEnabled } = useTabsContext();
  const className = transitionsEnabled
    ? "tabs-headless-indicator tabs-headless-indicator-animated"
    : "tabs-headless-indicator";

  return <Tabs.Indicator className={className} />;
}

export function TabsHeadlessPage() {
  const [value, setValue] = useState("one");
  const [changeCount, setChangeCount] = useState(0);
  const [scrollAlign, setScrollAlign] = useState<"start" | "center" | "nearest">("center");

  function handleValueChange(nextValue: string) {
    "background only";
    setChangeCount((count) => count + 1);
    // 부모가 값을 늦게 반영해도 선택·pager가 어긋나지 않는지 확인한다.
    setTimeout(() => setValue(nextValue), 300);
  }

  function cycleScrollAlign() {
    "background only";
    setScrollAlign((current) =>
      current === "center" ? "nearest" : current === "nearest" ? "start" : "center",
    );
  }

  return (
    <CatalogExamples title="Tabs (Headless)" gap="24px">
      <CatalogSectionTitle>Scrollable list · reveal</CatalogSectionTitle>
      <view bindtap={cycleScrollAlign} style={{ padding: "8px 16px" }}>
        <text>{`scrollAlign: ${scrollAlign} (탭해서 변경)`}</text>
      </view>
      <Tabs.Root defaultValue="추천">
        <Tabs.List
          className="tabs-headless-list"
          listContentProps={{ className: "tabs-headless-list-content" }}
          scrollAlign={scrollAlign}
        >
          {manyTabs.map((tab) => (
            <Trigger key={tab} value={tab} disabled={tab === "부동산"}>
              {tab}
            </Trigger>
          ))}
          <Indicator />
        </Tabs.List>
        {manyTabs.map((tab) => (
          <Panel key={tab} value={tab}>
            <text>{`${tab} 콘텐츠`}</text>
          </Panel>
        ))}
      </Tabs.Root>

      <CatalogSectionTitle>Controlled (300ms 지연) · swipeable viewpager</CatalogSectionTitle>
      <text>{`선택된 값: ${value} / onValueChange 호출: ${changeCount}`}</text>
      <Tabs.Root value={value} onValueChange={handleValueChange}>
        <Tabs.List
          className="tabs-headless-list"
          listContentProps={{ className: "tabs-headless-list-content" }}
        >
          <Trigger value="one">첫 번째</Trigger>
          <Trigger value="two" disabled>
            비활성
          </Trigger>
          <Trigger value="three">세 번째</Trigger>
          <Trigger value="four">네 번째</Trigger>
          <Indicator />
        </Tabs.List>
        <Tabs.Carousel className="tabs-headless-carousel" swipeable>
          <Tabs.CarouselCamera className="tabs-headless-camera">
            <Tabs.Content className="tabs-headless-content" value="one">
              <text>좌우로 밀어보세요.</text>
            </Tabs.Content>
            <Tabs.Content className="tabs-headless-content" value="two">
              <text>비활성 콘텐츠</text>
            </Tabs.Content>
            <Tabs.Content className="tabs-headless-content" value="three">
              <text>비활성 탭을 건너뛴 콘텐츠</text>
            </Tabs.Content>
            <Tabs.Content className="tabs-headless-content" value="four">
              <text>네 번째 콘텐츠</text>
            </Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>
    </CatalogExamples>
  );
}

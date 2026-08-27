import { useState } from "@lynx-js/react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "../seed-design/ui/tabs";

const contentClassName =
  "h-[240px] flex items-center justify-center bg-bg-layer-fill text-fg-neutral";

export function TabsPage() {
  const [value, setValue] = useState("one");

  function handleValueChange(nextValue: string) {
    "background only";
    setValue(nextValue);
  }

  return (
    <CatalogExamples title="Tabs" gap="24px">
      <CatalogSectionTitle>Fill layout</CatalogSectionTitle>
      <TabsRoot defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">첫 번째</TabsTrigger>
          <TabsTrigger value="two">두 번째</TabsTrigger>
          <TabsTrigger value="three">세 번째</TabsTrigger>
        </TabsList>
        <TabsContent className={contentClassName} value="one">
          <text>첫 번째 콘텐츠</text>
        </TabsContent>
        <TabsContent className={contentClassName} value="two">
          <text>두 번째 콘텐츠</text>
        </TabsContent>
        <TabsContent className={contentClassName} value="three">
          <text>세 번째 콘텐츠</text>
        </TabsContent>
      </TabsRoot>

      <CatalogSectionTitle>Hug layout</CatalogSectionTitle>
      <TabsRoot defaultValue="one" triggerLayout="hug" size="medium">
        <TabsList>
          <TabsTrigger value="one">짧은 탭</TabsTrigger>
          <TabsTrigger value="two">조금 더 긴 탭 레이블</TabsTrigger>
          <TabsTrigger value="three">세 번째 탭</TabsTrigger>
        </TabsList>
      </TabsRoot>

      <CatalogSectionTitle>Swipeable native viewpager</CatalogSectionTitle>
      <text className="t3-regular text-fg-neutral-muted">선택된 값: {value}</text>
      <TabsRoot value={value} onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="one">첫 번째</TabsTrigger>
          <TabsTrigger value="two" disabled>
            비활성
          </TabsTrigger>
          <TabsTrigger value="three">세 번째</TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable className="h-[240px]">
          <TabsContent className={contentClassName} value="one">
            <text>좌우로 밀어보세요.</text>
          </TabsContent>
          <TabsContent className={contentClassName} value="two">
            <text>비활성 콘텐츠</text>
          </TabsContent>
          <TabsContent className={contentClassName} value="three">
            <text>비활성 탭을 건너뛴 콘텐츠</text>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </CatalogExamples>
  );
}

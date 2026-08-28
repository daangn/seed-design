import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("one");

  function handleValueChange(nextValue: string) {
    "background only";
    setValue(nextValue);
  }

  return (
    <page className={seedClassName}>
      <view className="tabs-preview">
        <text className="tabs-preview__status">선택된 탭: {value}</text>
        <TabsRoot value={value} onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="one">첫 번째</TabsTrigger>
            <TabsTrigger value="two">두 번째</TabsTrigger>
            <TabsTrigger value="three">세 번째</TabsTrigger>
          </TabsList>
          <TabsCarousel swipeable className="tabs-preview__carousel">
            <TabsContent className="tabs-preview__content" value="one">
              <text className="tabs-preview__content-text">왼쪽이나 오른쪽으로 밀어보세요.</text>
            </TabsContent>
            <TabsContent className="tabs-preview__content" value="two">
              <text className="tabs-preview__content-text">두 번째 콘텐츠</text>
            </TabsContent>
            <TabsContent className="tabs-preview__content" value="three">
              <text className="tabs-preview__content-text">세 번째 콘텐츠</text>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </view>
    </page>
  );
}

root.render(<Root />);

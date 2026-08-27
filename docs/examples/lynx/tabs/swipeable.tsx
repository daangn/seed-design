import "./styles";

import { root, useState } from "@lynx-js/react";
import { Tabs, useSeedClassName } from "@seed-design/lynx-react";

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
        <Tabs.Root value={value} onValueChange={handleValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
            <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
            <Tabs.Trigger value="three">세 번째</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Carousel swipeable className="tabs-preview__carousel">
            <Tabs.CarouselCamera>
              <Tabs.Content className="tabs-preview__content" value="one">
                <text className="tabs-preview__content-text">왼쪽이나 오른쪽으로 밀어보세요.</text>
              </Tabs.Content>
              <Tabs.Content className="tabs-preview__content" value="two">
                <text className="tabs-preview__content-text">두 번째 콘텐츠</text>
              </Tabs.Content>
              <Tabs.Content className="tabs-preview__content" value="three">
                <text className="tabs-preview__content-text">세 번째 콘텐츠</text>
              </Tabs.Content>
            </Tabs.CarouselCamera>
          </Tabs.Carousel>
        </Tabs.Root>
      </view>
    </page>
  );
}

root.render(<Root />);

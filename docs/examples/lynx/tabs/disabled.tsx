import "./styles";

import { root } from "@lynx-js/react";
import { Tabs, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tabs-preview">
        <Tabs.Root defaultValue="one" triggerLayout="hug">
          <Tabs.List>
            <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
            <Tabs.Trigger value="two" disabled>
              비활성 탭
            </Tabs.Trigger>
            <Tabs.Trigger value="three">세 번째</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content className="tabs-preview__content" value="one">
            <text className="tabs-preview__content-text">첫 번째 콘텐츠</text>
          </Tabs.Content>
          <Tabs.Content className="tabs-preview__content" value="two">
            <text className="tabs-preview__content-text">비활성 콘텐츠</text>
          </Tabs.Content>
          <Tabs.Content className="tabs-preview__content" value="three">
            <text className="tabs-preview__content-text">세 번째 콘텐츠</text>
          </Tabs.Content>
        </Tabs.Root>
      </view>
    </page>
  );
}

root.render(<Root />);

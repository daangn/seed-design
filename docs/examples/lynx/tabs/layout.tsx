import "./styles";

import { root } from "@lynx-js/react";
import { Tabs, useSeedClassName } from "@seed-design/lynx-react";

function TabsExample({ triggerLayout }: { triggerLayout: "fill" | "hug" }) {
  return (
    <view className="tabs-preview__layout-section">
      <text className="tabs-preview__status">triggerLayout=&quot;{triggerLayout}&quot;</text>
      <Tabs.Root defaultValue="one" triggerLayout={triggerLayout}>
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two">길이가 긴 두 번째 탭</Tabs.Trigger>
          <Tabs.Trigger value="three">세 번째</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
    </view>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tabs-preview tabs-preview--layout">
        <TabsExample triggerLayout="fill" />
        <TabsExample triggerLayout="hug" />
      </view>
    </page>
  );
}

root.render(<Root />);

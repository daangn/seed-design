import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function TabsExample({ triggerLayout }: { triggerLayout: "fill" | "hug" }) {
  return (
    <view className="tabs-preview__layout-section">
      <text className="tabs-preview__status">triggerLayout=&quot;{triggerLayout}&quot;</text>
      <TabsRoot defaultValue="one" triggerLayout={triggerLayout}>
        <TabsList>
          <TabsTrigger value="one">첫 번째</TabsTrigger>
          <TabsTrigger value="two">길이가 긴 두 번째 탭</TabsTrigger>
          <TabsTrigger value="three">세 번째</TabsTrigger>
        </TabsList>
      </TabsRoot>
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

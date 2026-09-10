import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tabs-preview">
        <TabsRoot defaultValue="one" triggerLayout="hug">
          <TabsList>
            <TabsTrigger value="one">첫 번째</TabsTrigger>
            <TabsTrigger value="two" disabled>
              비활성 탭
            </TabsTrigger>
            <TabsTrigger value="three">세 번째</TabsTrigger>
          </TabsList>
          <TabsContent className="tabs-preview__content" value="one">
            <text className="tabs-preview__content-text">첫 번째 콘텐츠</text>
          </TabsContent>
          <TabsContent className="tabs-preview__content" value="two">
            <text className="tabs-preview__content-text">비활성 콘텐츠</text>
          </TabsContent>
          <TabsContent className="tabs-preview__content" value="three">
            <text className="tabs-preview__content-text">세 번째 콘텐츠</text>
          </TabsContent>
        </TabsRoot>
      </view>
    </page>
  );
}

root.render(<Root />);

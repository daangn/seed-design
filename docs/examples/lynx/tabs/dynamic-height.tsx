import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tabs-preview tabs-preview--dynamic-height">
        <TabsRoot defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">라벨1</TabsTrigger>
            <TabsTrigger value="2">라벨2</TabsTrigger>
            <TabsTrigger value="3">라벨3</TabsTrigger>
          </TabsList>
          <TabsContent
            className="tabs-preview__dynamic-content"
            value="1"
            style={{ height: "100px" }}
          >
            <text className="tabs-preview__content-text">Content 1</text>
          </TabsContent>
          <TabsContent
            className="tabs-preview__dynamic-content"
            value="2"
            style={{ height: "200px" }}
          >
            <text className="tabs-preview__content-text">Content 2</text>
          </TabsContent>
          <TabsContent
            className="tabs-preview__dynamic-content"
            value="3"
            style={{ height: "300px" }}
          >
            <text className="tabs-preview__content-text">Content 3</text>
          </TabsContent>
        </TabsRoot>
        <view className="tabs-preview__dynamic-footer">
          <text className="tabs-preview__content-text">아래 콘텐츠</text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);

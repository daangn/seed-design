import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [activeTab, setActiveTab] = useState("1");

  function handleValueChange(value: string) {
    "background only";
    setActiveTab(value);
  }

  return (
    <page className={seedClassName}>
      <view className="tabs-preview">
        <TabsRoot defaultValue="1" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="1">라벨1</TabsTrigger>
            <TabsTrigger value="2">라벨2</TabsTrigger>
            <TabsTrigger value="3">라벨3</TabsTrigger>
          </TabsList>
          {activeTab === "1" && (
            <view className="tabs-preview__content">
              <text className="tabs-preview__content-text">Content 1</text>
            </view>
          )}
          {activeTab === "2" && (
            <view className="tabs-preview__content">
              <text className="tabs-preview__content-text">Content 2</text>
            </view>
          )}
          {activeTab === "3" && (
            <view className="tabs-preview__content">
              <text className="tabs-preview__content-text">Content 3</text>
            </view>
          )}
        </TabsRoot>
      </view>
    </page>
  );
}

root.render(<Root />);

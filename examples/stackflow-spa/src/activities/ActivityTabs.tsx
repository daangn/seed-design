import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import {
  Tabs,
  TabTriggerList,
  TabContent,
  TabContentList,
  TabTrigger,
} from "../design-system/components";

const AcitivitiyTabs: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Tabs" }}>
      <Tabs
        isLazy
        lazyMode="unmount"
        isSwipeable={false}
        defaultValue="1"
        onValueChange={(value) => {
          console.log("value", value);
        }}
      >
        <TabTriggerList>
          <TabTrigger value="1">Tab 1</TabTrigger>
          <TabTrigger value="2" isDisabled>
            Tab 2
          </TabTrigger>
          <TabTrigger value="3">Tab 3</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",

                height: "500px",
              }}
            >
              Content 1
            </div>
          </TabContent>
          <TabContent value="2">
            <div
              style={{
                padding: "16px",
                backgroundColor: "#d8d8d8",
              }}
            >
              Content 2
            </div>
          </TabContent>
          <TabContent value="3">
            <div
              style={{
                padding: "16px",
                backgroundColor: "#b5b5b5",
              }}
            >
              Content 3
            </div>
          </TabContent>
        </TabContentList>
      </Tabs>
      <div
        style={{
          backgroundColor: "#b5b5b5",
          height: "500px",
        }}
      >
        탭 아래 컨텐츠
      </div>
    </AppScreen>
  );
};

export default AcitivitiyTabs;

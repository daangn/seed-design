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
        defaultValue="1"
        onValueChange={(value) => {
          console.log("value", value);
        }}
      >
        <TabTriggerList>
          <TabTrigger value="1">Tab 1</TabTrigger>
          <TabTrigger value="2">Tab 2</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
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
        </TabContentList>
      </Tabs>
    </AppScreen>
  );
};

export default AcitivitiyTabs;

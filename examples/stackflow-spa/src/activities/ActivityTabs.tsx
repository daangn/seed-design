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
        onValueChange={(value) => {
          console.log("value", value);
        }}
      >
        <TabTriggerList>
          <TabTrigger value="1">Tab 1</TabTrigger>
          <TabTrigger value="2">Tab 2</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">Content 1</TabContent>
          <TabContent value="2">Content 2</TabContent>
        </TabContentList>
      </Tabs>
    </AppScreen>
  );
};

export default AcitivitiyTabs;

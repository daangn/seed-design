import * as React from "react";
import { AppScreen } from "@stackflow/plugin-basic-ui";

import {
  Tabs as UITabs,
  TabTriggerList,
  TabContent,
  TabContentList,
  TabTrigger,
} from "@/seed-design/ui/tabs";

import type { ActivityComponentType } from "@stackflow/react/future";

declare module "@stackflow/config" {
  interface Register {
    TabsAlert: unknown;
  }
}

const TabsAlertActivity: ActivityComponentType<"TabsAlert"> = () => {
  const appBarLeft = () => <div>Left</div>;
  const appBarRight = () => <div>Right</div>;

  const tabCommonStyle = {
    padding: "16px",
    backgroundColor: "#f5f5f5",
  };

  return (
    <AppScreen
      appBar={{
        renderLeft: appBarLeft,
        renderRight: appBarRight,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <UITabs defaultValue="1" isSwipeable layout="fill" size="medium">
          <TabTriggerList>
            <TabTrigger value="1" alert>
              라벨1
            </TabTrigger>
            <TabTrigger value="2" alert>
              라벨2
            </TabTrigger>
            <TabTrigger value="3" alert>
              라벨3
            </TabTrigger>
          </TabTriggerList>
          <TabContentList>
            <TabContent value="1">
              <div style={tabCommonStyle}>Content 1</div>
            </TabContent>
            <TabContent value="2">
              <div style={tabCommonStyle}>Content 2</div>
            </TabContent>
            <TabContent value="3">
              <div style={tabCommonStyle}>Content 3</div>
            </TabContent>
          </TabContentList>
        </UITabs>
      </div>
    </AppScreen>
  );
};

export default TabsAlertActivity;
import * as React from "react";
import { AppScreen } from "@stackflow/plugin-basic-ui";

import {
  Tabs,
  TabTriggerList,
  TabContent,
  TabContentList,
  TabTrigger,
} from "@/seed-design/ui/tabs";

import type { ActivityComponentType } from "@stackflow/react/future";

declare module "@stackflow/config" {
  interface Register {
    TabsDisabled: unknown;
  }
}

const TabsDisabledActivity: ActivityComponentType<"TabsDisabled"> = () => {
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
        <Tabs defaultValue="1" isSwipeable layout="fill" size="medium">
          <TabTriggerList>
            <TabTrigger value="1">라벨1</TabTrigger>
            <TabTrigger value="2" isDisabled>
              라벨2
            </TabTrigger>
            <TabTrigger value="3">라벨3</TabTrigger>
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
        </Tabs>
      </div>
    </AppScreen>
  );
};

export default TabsDisabledActivity;

TabsDisabledActivity.displayName = "TabsDisabledActivity";
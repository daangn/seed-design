import * as React from "react";

import {
  Tabs as UITabs,
  TabTriggerList,
  TabContent,
  TabContentList,
  TabTrigger,
} from "@/snippets/component/tabs";

export const Tabs = () => {
  const tabCommonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };
  return (
    <UITabs defaultValue="1" isSwipeable layout="fill" size="medium">
      <TabTriggerList>
        <TabTrigger value="1">라벨1</TabTrigger>
        <TabTrigger value="2">라벨2</TabTrigger>
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
    </UITabs>
  );
};

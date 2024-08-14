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
  const tabCommonStyle = {
    padding: "16px",
    backgroundColor: "#f5f5f5",
  };
  return (
    <AppScreen appBar={{ title: "Tabs" }}>
      Fill,Medium
      <Tabs defaultValue="1" isSwipeable layout="fill" size="medium">
        <TabTriggerList>
          <TabTrigger alert value="1">
            라벨1
          </TabTrigger>
          <TabTrigger value="2">라벨2</TabTrigger>
          <TabTrigger value="3" isDisabled>
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
      </Tabs>
      Fill,Small
      <Tabs defaultValue="1" isSwipeable layout="fill" size="small">
        <TabTriggerList>
          <TabTrigger alert value="1">
            Tab 1
          </TabTrigger>
          <TabTrigger value="2">Tab 2</TabTrigger>
          <TabTrigger value="3" isDisabled>
            Tab 3
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
      </Tabs>
      Hug
      <Tabs defaultValue="1" isSwipeable layout="hug">
        <TabTriggerList>
          <TabTrigger value="1">Tab 1</TabTrigger>
          <TabTrigger value="2">Tab 2</TabTrigger>
          <TabTrigger value="3">Tab 3</TabTrigger>
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
      Many Tabs
      <Tabs defaultValue="1" isSwipeable layout="hug">
        <TabTriggerList>
          <TabTrigger value="1">Tab 1</TabTrigger>
          <TabTrigger value="2">Tab 2</TabTrigger>
          <TabTrigger value="3" alert>
            Tab 333333333333
          </TabTrigger>
          <TabTrigger value="4">Tab 4</TabTrigger>
          <TabTrigger value="5">Tab 55555555555</TabTrigger>
          <TabTrigger value="6">Tab 6</TabTrigger>
          <TabTrigger value="7">Tab 7</TabTrigger>
          <TabTrigger value="8">Tab 8</TabTrigger>
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
          <TabContent value="4">
            <div style={tabCommonStyle}>Content 4</div>
          </TabContent>
          <TabContent value="5">
            <div style={tabCommonStyle}>Content 5</div>
          </TabContent>
          <TabContent value="6">
            <div style={tabCommonStyle}>Content 6</div>
          </TabContent>
          <TabContent value="7">
            <div style={tabCommonStyle}>Content 7</div>
          </TabContent>
          <TabContent value="8">
            <div style={tabCommonStyle}>Content 8</div>
          </TabContent>
        </TabContentList>
      </Tabs>
    </AppScreen>
  );
};

export default AcitivitiyTabs;

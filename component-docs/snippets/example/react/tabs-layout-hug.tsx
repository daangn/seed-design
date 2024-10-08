import { Tabs, TabContent, TabContentList, TabTrigger, TabTriggerList } from "seed-design/ui/tabs";

export default function TabsLayoutHug() {
  return (
    <Tabs defaultValue="1" layout="hug">
      <TabTriggerList>
        <TabTrigger value="1">라벨1</TabTrigger>
        <TabTrigger value="2">라벨2</TabTrigger>
        <TabTrigger value="3">라벨3</TabTrigger>
      </TabTriggerList>
      <TabContentList>
        <TabContent value="1">
          <div>Content 1</div>
        </TabContent>
        <TabContent value="2">
          <div>Content 2</div>
        </TabContent>
        <TabContent value="3">
          <div>Content 3</div>
        </TabContent>
      </TabContentList>
    </Tabs>
  );
}

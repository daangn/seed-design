import { Tabs, TabContent, TabContentList, TabTrigger, TabTriggerList } from "seed-design/ui/tabs";

export default function TabsDynamicHeight() {
  return (
    <>
      <Tabs defaultValue="1" lazyMode="unmount" isLazy={true} isSwipeable={false}>
        <TabTriggerList>
          <TabTrigger value="1">라벨1</TabTrigger>
          <TabTrigger value="2">라벨2</TabTrigger>
          <TabTrigger value="3">라벨3</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">
            <div style={{ height: "100px", backgroundColor: "#ffeeee" }}>Content 1</div>
          </TabContent>
          <TabContent value="2">
            <div style={{ height: "200px", backgroundColor: "#ffeeff" }}>Content 2</div>
          </TabContent>
          <TabContent value="3">
            <div style={{ height: "300px", backgroundColor: "#ffeedd" }}>Content 3</div>
          </TabContent>
        </TabContentList>
      </Tabs>
      <div style={{ height: "100px", backgroundColor: "gray" }}>아래 컨텐츠</div>
    </>
  );
}

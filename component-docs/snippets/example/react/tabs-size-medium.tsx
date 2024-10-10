import { Tabs, TabContent, TabContentList, TabTrigger, TabTriggerList } from "seed-design/ui/tabs";

export default function TabsSizeMedium() {
  return (
    <div style={{ width: "360px" }}>
      <Tabs defaultValue="1" size="medium">
        <TabTriggerList>
          <TabTrigger value="1">라벨1</TabTrigger>
          <TabTrigger value="2">라벨2</TabTrigger>
          <TabTrigger value="3">라벨3</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">
            <Content>Content 1</Content>
          </TabContent>
          <TabContent value="2">
            <Content>Content 2</Content>
          </TabContent>
          <TabContent value="3">
            <Content>Content 3</Content>
          </TabContent>
        </TabContentList>
      </Tabs>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};

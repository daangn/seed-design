import { Tabs, TabContent, TabContentList, TabTrigger, TabTriggerList } from "seed-design/ui/tabs";

export default function TabsDynamicHeight() {
  return (
    <div style={{ width: "360px" }}>
      <Tabs defaultValue="1" lazyMode="unmount" isLazy={true} isSwipeable={false}>
        <TabTriggerList>
          <TabTrigger value="1">라벨1</TabTrigger>
          <TabTrigger value="2">라벨2</TabTrigger>
          <TabTrigger value="3">라벨3</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="1">
            <Content height="100px">Content 1</Content>
          </TabContent>
          <TabContent value="2">
            <Content height="200px">Content 2</Content>
          </TabContent>
          <TabContent value="3">
            <Content height="300px">Content 3</Content>
          </TabContent>
        </TabContentList>
      </Tabs>
      <div style={{ height: "100px", backgroundColor: "gray" }}>아래 컨텐츠</div>
    </div>
  );
}

const Content = (props: React.PropsWithChildren<{ height: string }>) => {
  const { height, children } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {children}
    </div>
  );
};

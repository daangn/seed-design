import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsDynamicHeight() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" lazyMount unmountOnExit>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsCarousel autoHeight>
          <TabsContent value="1">
            <Content height="100px">Content 1</Content>
          </TabsContent>
          <TabsContent value="2">
            <Content height="200px">Content 2</Content>
          </TabsContent>
          <TabsContent value="3">
            <Content height="300px">Content 3</Content>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
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

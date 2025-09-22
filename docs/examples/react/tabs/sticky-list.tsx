import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsStickyList() {
  return (
    // 600은 화면 높이라고 가정합니다.
    <div style={{ width: "360px", height: "600px" }}>
      <TabsRoot
        defaultValue="1"
        size="medium"
        stickyList
        style={{ height: "100%" }} // 탭 영역을 전체 화면으로 설정합니다.
      >
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content height="1000px">Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content height="1000px">Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content height="1000px">Content 3</Content>
        </TabsContent>
      </TabsRoot>
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
        background: "linear-gradient(to bottom, white, gray)",
      }}
    >
      {children}
    </div>
  );
};

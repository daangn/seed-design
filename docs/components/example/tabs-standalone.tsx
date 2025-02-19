import { useState } from "react";
import { TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsStandalone() {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        {activeTab === "1" && (
          <div>
            <Content>Content 1</Content>
          </div>
        )}
        {activeTab === "2" && (
          <div>
            <Content>Content 2</Content>
          </div>
        )}
        {activeTab === "3" && (
          <div>
            <Content>Content 3</Content>
          </div>
        )}
      </TabsRoot>
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

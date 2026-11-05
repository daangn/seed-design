import "./styles";

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

export default function Example() {
  return (
    <TabsRoot defaultValue="2" triggerLayout="fill" style={{ width: "100%" }}>
      <TabsList>
        <TabsTrigger value="1">라벨1</TabsTrigger>
        <TabsTrigger value="2">라벨2</TabsTrigger>
        <TabsTrigger value="3">라벨3</TabsTrigger>
      </TabsList>
      <TabsContent className="tabs-preview__content" value="1">
        <text className="tabs-preview__content-text">Content 1</text>
      </TabsContent>
      <TabsContent className="tabs-preview__content" value="2">
        <text className="tabs-preview__content-text">Content 2</text>
      </TabsContent>
      <TabsContent className="tabs-preview__content" value="3">
        <text className="tabs-preview__content-text">Content 3</text>
      </TabsContent>
    </TabsRoot>
  );
}

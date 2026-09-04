import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <scroll-view className="tabs-preview__scroll" scroll-orientation="vertical">
        <TabsRoot defaultValue="1" size="medium" stickyList>
          <TabsList>
            <TabsTrigger value="1">라벨1</TabsTrigger>
            <TabsTrigger value="2">라벨2</TabsTrigger>
            <TabsTrigger value="3">라벨3</TabsTrigger>
          </TabsList>
          <TabsContent className="tabs-preview__sticky-content" value="1">
            <text className="tabs-preview__content-text">Content 1</text>
          </TabsContent>
          <TabsContent className="tabs-preview__sticky-content" value="2">
            <text className="tabs-preview__content-text">Content 2</text>
          </TabsContent>
          <TabsContent className="tabs-preview__sticky-content" value="3">
            <text className="tabs-preview__content-text">Content 3</text>
          </TabsContent>
        </TabsRoot>
      </scroll-view>
    </page>
  );
}

root.render(<Root />);

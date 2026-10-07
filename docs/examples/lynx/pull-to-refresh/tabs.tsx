import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "@/components/ui/pull-to-refresh";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";
import { PARAGRAPH, useRefreshObservation } from "./use-refresh-observation";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const { refreshCount, lastEvent, callbacks } = useRefreshObservation();

  return (
    <view className={`${seedClassName} docs-lynx-ptr-root`}>
      <text className="ptr-preview__title">Pull To Refresh</text>
      <text className="ptr-preview__status">
        {`Tab 1 refresh 횟수: ${refreshCount} · 마지막 이벤트: ${lastEvent}`}
      </text>
      <TabsRoot defaultValue="1" contentLayout="fill" className="ptr-preview__tabs">
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable className="ptr-preview__carousel">
          <TabsContent value="1" className="ptr-preview__tab">
            <PullToRefreshRoot className="ptr-preview__frame" {...callbacks}>
              <PullToRefreshIndicator />
              <PullToRefreshContent>
                <view className="ptr-preview__body">
                  <text className="ptr-preview__paragraph">{PARAGRAPH}</text>
                </view>
              </PullToRefreshContent>
            </PullToRefreshRoot>
          </TabsContent>
          <TabsContent value="2" className="ptr-preview__tab">
            <view className="ptr-preview__body">
              <text className="ptr-preview__paragraph">PTR is not available in this tab.</text>
            </view>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </view>
  );
}

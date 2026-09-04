import "./styles";

import { root, useCallback, useRef, useState } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

const SCROLL_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function scrollToTop(ref: NodesRef | null) {
  "background only";

  ref?.invoke({ method: "scrollTo", params: { offset: 0, smooth: true } }).exec();
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [currentTab, setCurrentTab] = useState("1");
  const firstContentRef = useRef<NodesRef | null>(null);
  const secondContentRef = useRef<NodesRef | null>(null);

  const setFirstContentRef = useCallback((node: NodesRef | null) => {
    "background only";
    firstContentRef.current = node;
  }, []);
  const setSecondContentRef = useCallback((node: NodesRef | null) => {
    "background only";
    secondContentRef.current = node;
  }, []);

  function handleFirstTriggerTap() {
    "background only";
    if (currentTab === "1") scrollToTop(firstContentRef.current);
  }

  function handleSecondTriggerTap() {
    "background only";
    if (currentTab === "2") scrollToTop(secondContentRef.current);
  }

  return (
    <page className={seedClassName}>
      <view className="tabs-preview">
        <TabsRoot triggerLayout="fill" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="1" bindtap={handleFirstTriggerTap}>
              라벨1
            </TabsTrigger>
            <TabsTrigger value="2" bindtap={handleSecondTriggerTap}>
              라벨2
            </TabsTrigger>
          </TabsList>
          <TabsCarousel swipeable className="tabs-preview__scroll-top-carousel">
            <TabsContent value="1">
              <scroll-view
                ref={setFirstContentRef}
                scroll-orientation="vertical"
                initial-scroll-offset={300}
                className="tabs-preview__scroll-top"
              >
                <view className="tabs-preview__scroll-top-content">
                  {SCROLL_ITEMS.map((item) => (
                    <view key={item} className="tabs-preview__scroll-top-item">
                      <text className="tabs-preview__content-text">Content 1 · {item}</text>
                    </view>
                  ))}
                </view>
              </scroll-view>
            </TabsContent>
            <TabsContent value="2">
              <scroll-view
                ref={setSecondContentRef}
                scroll-orientation="vertical"
                initial-scroll-offset={300}
                className="tabs-preview__scroll-top"
              >
                <view className="tabs-preview__scroll-top-content">
                  {SCROLL_ITEMS.map((item) => (
                    <view key={item} className="tabs-preview__scroll-top-item">
                      <text className="tabs-preview__content-text">Content 2 · {item}</text>
                    </view>
                  ))}
                </view>
              </scroll-view>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </view>
    </page>
  );
}

root.render(<Root />);

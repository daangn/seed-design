import { Box } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { Suspense, useEffect, useState } from "react";
import * as React from "react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityTabsAutoHeightLazy: {};
  }
}

/**
 * Pattern A: AsyncContent (useState + setTimeout)
 * Simulates async data loading that causes content height to change
 */
const AsyncContent = ({ delay, children }: { delay: number; children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loaded ? <>{children}</> : <Box p="x4">Loading...</Box>;
};

/**
 * Pattern B: React.lazy + Suspense
 * Simulates real-world lazy component loading pattern
 */
function createLazyComponent(delay: number, height: string) {
  return React.lazy(
    () =>
      new Promise<{ default: React.ComponentType }>((resolve) => {
        setTimeout(() => {
          resolve({
            default: () => (
              <Box bg="bg.criticalSolid" p="x4" height={height} color="fg.criticalContrast">
                Lazy loaded content ({height} tall, {delay}ms delay)
              </Box>
            ),
          });
        }, delay);
      }),
  );
}

const LazyTallContent = createLazyComponent(1500, "400px");

const ActivityTabsAutoHeightLazy: StaticActivityComponentType<
  "ActivityTabsAutoHeightLazy"
> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Tabs AutoHeight + LazyMount" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Box p="x4" color="fg.neutralMuted">
          Bug: Tab 2/4 content loads after delay but carousel height stays fixed.
        </Box>
        <TabsRoot defaultValue="1" lazyMount contentLayout="hug">
          <TabsList>
            <TabsTrigger value="1">Immediate</TabsTrigger>
            <TabsTrigger value="2">Async</TabsTrigger>
            <TabsTrigger value="3">Immediate 2</TabsTrigger>
            <TabsTrigger value="4">Suspense</TabsTrigger>
            <TabsTrigger value="5">Immediate 3</TabsTrigger>
          </TabsList>
          <TabsCarousel autoHeight swipeable>
            {/* Tab 1: Immediate render, short content (baseline) */}
            <TabsContent value="1">
              <Box bg="bg.informativeSolid" p="x4" height="100px" color="fg.informativeContrast">
                Tab 1: Immediate (100px)
              </Box>
            </TabsContent>

            {/* Tab 2: Pattern A - AsyncContent with setTimeout delay */}
            <TabsContent value="2">
              <AsyncContent delay={1000}>
                <Box bg="bg.criticalSolid" p="x4" height="500px" color="fg.criticalContrast">
                  Tab 2: Async loaded (500px, 1s delay)
                </Box>
              </AsyncContent>
            </TabsContent>

            {/* Tab 3: Immediate render, medium content */}
            <TabsContent value="3">
              <Box bg="bg.positiveSolid" p="x4" height="200px" color="fg.positiveContrast">
                Tab 3: Immediate (200px)
              </Box>
            </TabsContent>

            {/* Tab 4: Pattern B - React.lazy + Suspense */}
            <TabsContent value="4">
              <Suspense fallback={<Box p="x4">Suspense loading...</Box>}>
                <LazyTallContent />
              </Suspense>
            </TabsContent>

            {/* Tab 5: Immediate render, short content */}
            <TabsContent value="5">
              <Box bg="bg.warningSolid" p="x4" height="150px" color="fg.warningContrast">
                Tab 5: Immediate (150px)
              </Box>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityTabsAutoHeightLazy;

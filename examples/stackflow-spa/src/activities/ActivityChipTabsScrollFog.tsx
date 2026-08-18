import { Box, ScrollFog } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { Suspense, useEffect, useState } from "react";
import * as React from "react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import {
  ChipTabsCarousel,
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityChipTabsScrollFog: {};
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

const ActivityChipTabsScrollFog: StaticActivityComponentType<"ActivityChipTabsScrollFog"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="ChipTabs ScrollFog + LazyMount" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Box p="x4" color="fg.neutralMuted">
          Check 1 (DES-1532): tab 2/4 content loads after a delay and the carousel height follows.
          {"\n"}
          Check 2 (DES-1889): the chip strip scrolls horizontally on WKWebView/Safari.
        </Box>
        <ChipTabsRoot defaultValue="1" lazyMount contentLayout="hug" variant="neutralSolid">
          {/* Chip strip wrapped in ScrollFog for horizontal scroll + edge gradients */}
          <ScrollFog placement={["left", "right"]}>
            <ChipTabsList style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <ChipTabsTrigger value="1">Immediate</ChipTabsTrigger>
              <ChipTabsTrigger value="2">Async</ChipTabsTrigger>
              <ChipTabsTrigger value="3">Immediate 2</ChipTabsTrigger>
              <ChipTabsTrigger value="4">Suspense</ChipTabsTrigger>
              <ChipTabsTrigger value="5">Immediate 3</ChipTabsTrigger>
              <ChipTabsTrigger value="6">라벨6</ChipTabsTrigger>
              <ChipTabsTrigger value="7">라벨7</ChipTabsTrigger>
              <ChipTabsTrigger value="8">라벨8</ChipTabsTrigger>
              <ChipTabsTrigger value="9">라벨9</ChipTabsTrigger>
              <ChipTabsTrigger value="10">라벨10</ChipTabsTrigger>
            </ChipTabsList>
          </ScrollFog>
          <ChipTabsCarousel autoHeight swipeable>
            {/* Tab 1: Immediate render, short content (baseline) */}
            <ChipTabsContent value="1">
              <Box bg="bg.informativeSolid" p="x4" height="100px" color="fg.informativeContrast">
                Tab 1: Immediate (100px)
              </Box>
            </ChipTabsContent>

            {/* Tab 2: Pattern A - AsyncContent with setTimeout delay */}
            <ChipTabsContent value="2">
              <AsyncContent delay={1000}>
                <Box bg="bg.criticalSolid" p="x4" height="500px" color="fg.criticalContrast">
                  Tab 2: Async loaded (500px, 1s delay)
                </Box>
              </AsyncContent>
            </ChipTabsContent>

            {/* Tab 3: Immediate render, medium content */}
            <ChipTabsContent value="3">
              <Box bg="bg.positiveSolid" p="x4" height="200px" color="fg.positiveContrast">
                Tab 3: Immediate (200px)
              </Box>
            </ChipTabsContent>

            {/* Tab 4: Pattern B - React.lazy + Suspense */}
            <ChipTabsContent value="4">
              <Suspense fallback={<Box p="x4">Suspense loading...</Box>}>
                <LazyTallContent />
              </Suspense>
            </ChipTabsContent>

            {/* Tab 5: Immediate render, short content */}
            <ChipTabsContent value="5">
              <Box bg="bg.warningSolid" p="x4" height="150px" color="fg.warningContrast">
                Tab 5: Immediate (150px)
              </Box>
            </ChipTabsContent>

            {/* Tabs 6-10: filler to make the chip strip overflow (scroll fog) */}
            {[6, 7, 8, 9, 10].map((value) => (
              <ChipTabsContent key={value} value={String(value)}>
                <Box bg="bg.neutral" p="x4" height="120px" color="fg.neutral">
                  Tab {value}: Immediate (120px)
                </Box>
              </ChipTabsContent>
            ))}
          </ChipTabsCarousel>
        </ChipTabsRoot>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityChipTabsScrollFog;

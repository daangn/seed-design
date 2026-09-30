import type { StaticActivityComponentType } from "@stackflow/react/future";
import { Box, HStack, Text, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";
import img from "../assets/peng.jpeg";

declare module "@stackflow/config" {
  interface Register {
    ActivitySafeAreaBleed: {};
  }
}

const CATEGORIES = [
  "전체",
  "디지털기기",
  "생활가전",
  "가구/인테리어",
  "생활/주방",
  "유아동",
  "여성의류",
  "남성패션/잡화",
  "뷰티/미용",
];

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <VStack gap="x3">
    <VStack gap="x1" px="spacingX.globalGutter">
      <Text textStyle="t5Bold" color="fg.neutral">
        {title}
      </Text>
      <Text textStyle="t3Regular" color="fg.neutralMuted">
        {description}
      </Text>
    </VStack>
    {children}
  </VStack>
);

const ActivitySafeAreaBleed: StaticActivityComponentType<"ActivitySafeAreaBleed"> = () => (
  <AppScreen>
    <AppBar>
      <AppBarLeft>
        <AppBarBackButton />
      </AppBarLeft>
      <AppBarMain title="좌우 safe area와 bleed" />
    </AppBar>
    <AppScreenContent>
      <VStack gap="x8" pt="x4">
        <Section title="이미지" description="bleedX에 safeArea를 주면 좌우 inset까지 채워요.">
          <Box bleedX="safeArea">
            <img src={img} alt="penguin" style={{ display: "block", width: "100%" }} />
          </Box>
        </Section>
        <Section
          title="가로 스크롤"
          description="스크롤 영역은 bleedX로 화면 끝까지 넓히고, pl과 pr의 safeArea로 내용을 safe area 경계에서 시작해요. gutter는 안쪽 요소가 가져요."
        >
          {/* Before iOS 26.4, WebKit leaves a block scroll container's end padding out of the scroll
              range when a block-level child overflows; a flex container keeps it, so the last item
              stops at the safe area edge. */}
          <Box display="flex" bleedX="safeArea" pl="safeArea" pr="safeArea" overflowX="auto">
            <HStack gap="x2" px="spacingX.globalGutter" width="max-content">
              {Array.from({ length: 10 }, (_, index) => (
                <VStack
                  key={index}
                  width="120px"
                  height="80px"
                  borderRadius="r2"
                  bg="bg.neutralWeak"
                  justify="center"
                  align="center"
                >
                  <Text textStyle="t4Bold" color="fg.neutral">
                    {index + 1}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Section>
        <Section
          title="Chip Tabs"
          description="스크롤 영역이 gutter를 padding으로 직접 가지면, gutter와 inset을 더한 값을 padding으로 줘요."
        >
          <Box bleedX="safeArea">
            <ChipTabsRoot defaultValue={CATEGORIES[0]} variant="neutralSolid">
              <ChipTabsList
                style={{
                  paddingLeft:
                    "calc(var(--seed-dimension-spacing-x-global-gutter) + var(--seed-safe-area-left))",
                  paddingRight:
                    "calc(var(--seed-dimension-spacing-x-global-gutter) + var(--seed-safe-area-right))",
                }}
              >
                {CATEGORIES.map((category) => (
                  <ChipTabsTrigger key={category} value={category}>
                    {category}
                  </ChipTabsTrigger>
                ))}
              </ChipTabsList>
            </ChipTabsRoot>
          </Box>
        </Section>
        <Section
          title="배경 띠"
          description="배경은 bleedX로 화면 끝까지 채우고, 내용은 pl과 pr의 safeArea와 gutter 안쪽에 둬요."
        >
          <Box bleedX="safeArea" pl="safeArea" pr="safeArea" bg="bg.brandWeak">
            <Box px="spacingX.globalGutter" py="x4">
              <Text textStyle="t4Medium" color="fg.brand">
                배경은 화면 끝까지, 글자는 safe area 안쪽에 있어요.
              </Text>
            </Box>
          </Box>
        </Section>
        <VStack gap="x3" px="spacingX.globalGutter">
          {Array.from({ length: 6 }, (_, index) => (
            <Text key={index} textStyle="t4Regular" color="fg.neutral">
              아래 하단 바가 콘텐츠 위에 고정되는지 확인하기 위한 문단이에요. 하단 바는 배경을 화면
              끝까지 채우고, 버튼은 safe area 안쪽에 둬요.
            </Text>
          ))}
        </VStack>
        <Box
          position="sticky"
          bottom={0}
          bleedX="safeArea"
          pl="safeArea"
          pr="safeArea"
          pb="safeArea"
          bg="bg.layerDefault"
        >
          <HStack px="spacingX.globalGutter" py="x3">
            <ActionButton variant="brandSolid" flexGrow>
              확인
            </ActionButton>
          </HStack>
        </Box>
      </VStack>
    </AppScreenContent>
  </AppScreen>
);

export default ActivitySafeAreaBleed;

import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  Box,
  HStack,
  ImageFrame,
  ImageFrameFloater,
  ImageFrameIndicator,
  ImageFrameReactionButton,
  Text,
  VStack,
} from "@seed-design/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  AttachmentDropzone,
  AttachmentField,
  AttachmentInput,
} from "seed-design/ui/attachment-field";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";
import { ActionablePageBanner } from "seed-design/ui/page-banner";
import { Switch } from "seed-design/ui/switch";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
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

const TABS = ["추천", "인기", "최신"];

const mockedFiles = Array.from({ length: 8 }, (_, i) => {
  const file = new File(["file content"], `file${i + 1}.txt`, { type: "text/plain" });
  Object.defineProperty(file, "size", { value: 1 });

  return file;
});

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

function SafeAreaReadout() {
  const [insets, setInsets] = useState({ left: 0, right: 0 });
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () =>
      setInsets({
        left: leftRef.current?.offsetWidth ?? 0,
        right: rightRef.current?.offsetWidth ?? 0,
      });
    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <div ref={leftRef} style={{ width: "var(--seed-safe-area-left)", height: 0 }} />
      <div ref={rightRef} style={{ width: "var(--seed-safe-area-right)", height: 0 }} />
      <Text textStyle="t3Regular" color="fg.neutralMuted">
        safe area: 왼쪽 {insets.left}px · 오른쪽 {insets.right}px
      </Text>
    </>
  );
}

const ActivitySafeAreaBleed: StaticActivityComponentType<"ActivitySafeAreaBleed"> = () => {
  const [extendSafeAreaX, setExtendSafeAreaX] = useState(true);
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="좌우 safe area와 bleed" />
      </AppBar>
      <AppScreenContent>
        <VStack gap="x8" pt="x4">
          <VStack gap="x2" px="spacingX.globalGutter" align="flex-start">
            <Switch
              label="extendSafeAreaX"
              checked={extendSafeAreaX}
              onCheckedChange={setExtendSafeAreaX}
            />
            <SafeAreaReadout />
          </VStack>
          <Section
            title="Tabs"
            description="extendSafeAreaX를 주면 목록 배경과 하단 선이 화면 끝까지 이어지고 패널도 화면 끝까지 스와이프돼요. 탭과 패널 내용은 safe area 안에 남아요."
          >
            <TabsRoot defaultValue={TABS[0]} extendSafeAreaX={extendSafeAreaX}>
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsCarousel swipeable>
                {TABS.map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <Box
                      px="spacingX.globalGutter"
                      py="x6"
                      bg="bg.informativeWeak"
                      borderWidth={1}
                      borderColor="stroke.neutralMuted"
                    >
                      <Text textStyle="t4Medium" color="fg.neutral">
                        {tab} 패널
                      </Text>
                    </Box>
                  </TabsContent>
                ))}
              </TabsCarousel>
            </TabsRoot>
          </Section>
          <Section
            title="Tabs (hug)"
            description="탭이 넘치면 선택한 탭을 화면 안으로 스크롤해요. 탭은 safe area 아래에 멈추지 않고, 목록 padding만큼 떨어져 멈춰요."
          >
            <TabsRoot
              defaultValue={CATEGORIES[0]}
              triggerLayout="hug"
              extendSafeAreaX={extendSafeAreaX}
            >
              <TabsList>
                {CATEGORIES.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </TabsRoot>
          </Section>
          <Section
            title="Chip Tabs"
            description="extendSafeAreaX를 주면 chip 목록이 화면 끝까지 스크롤되고, 스크롤하기 전에는 첫 chip이 safe area 경계에서 시작해요."
          >
            <ChipTabsRoot
              defaultValue={CATEGORIES[0]}
              variant="neutralSolid"
              extendSafeAreaX={extendSafeAreaX}
            >
              <ChipTabsList>
                {CATEGORIES.map((category) => (
                  <ChipTabsTrigger key={category} value={category}>
                    {category}
                  </ChipTabsTrigger>
                ))}
              </ChipTabsList>
            </ChipTabsRoot>
          </Section>
          <Section
            title="Page Banner"
            description="extendSafeAreaX를 주면 배경은 화면 끝까지 채우고, 내용은 safe area 안에 둬요."
          >
            <ActionablePageBanner
              tone="magic"
              title="안내"
              description="배경은 화면 끝까지, 글자는 safe area 안쪽에 있어요."
              extendSafeAreaX={extendSafeAreaX}
            />
          </Section>
          <Section
            title="Attachment Field"
            description="extendSafeAreaX를 주면 항목 목록이 extend-x에 inset을 더한 만큼 넓어져 화면 끝까지 스크롤돼요."
          >
            <Box px="spacingX.globalGutter">
              <AttachmentField
                maxFiles={8}
                label="첨부파일"
                defaultAcceptedFileEntries={mockedFiles.map((file, index) => ({
                  id: `${index}`,
                  file,
                  status: "pending",
                }))}
                extendSafeAreaX={extendSafeAreaX}
                rootProps={{
                  style: {
                    "--seed-attachment-input-extend-x":
                      "var(--seed-dimension-spacing-x-global-gutter)",
                  } as React.CSSProperties,
                }}
              >
                <AttachmentInput />
              </AttachmentField>
            </Box>
          </Section>
          <Section
            title="Attachment Field (Dropzone)"
            description="extendSafeAreaX를 주어도 dropzone은 safe area 안에 남고, 항목 목록만 화면 끝까지 스크롤돼요."
          >
            <Box px="spacingX.globalGutter">
              <AttachmentField
                maxFiles={8}
                label="첨부파일"
                defaultAcceptedFileEntries={mockedFiles.map((file, index) => ({
                  id: `${index}`,
                  file,
                  status: "pending",
                }))}
                extendSafeAreaX={extendSafeAreaX}
                rootProps={{
                  style: {
                    "--seed-attachment-input-extend-x":
                      "var(--seed-dimension-spacing-x-global-gutter)",
                  } as React.CSSProperties,
                }}
              >
                <AttachmentDropzone />
              </AttachmentField>
            </Box>
          </Section>
          <Section
            title="Image Frame"
            description={`bleedX="safeArea"를 주면 이미지가 화면 끝까지 채워지고, floater는 safe area 안에 남아요. 스위치는 bleedX를 켜고 꺼요.`}
          >
            <ImageFrame
              ratio={2}
              borderRadius={0}
              src={img}
              alt="penguin"
              {...(extendSafeAreaX && { bleedX: "safeArea" as const })}
            >
              <ImageFrameFloater placement="bottom-start">
                <ImageFrameIndicator>1 / 5</ImageFrameIndicator>
              </ImageFrameFloater>
              <ImageFrameFloater placement="bottom-end">
                <ImageFrameReactionButton aria-label="좋아요" />
              </ImageFrameFloater>
            </ImageFrame>
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
                아래 하단 바가 콘텐츠 위에 고정되는지 확인하기 위한 문단이에요. 하단 바는 배경을
                화면 끝까지 채우고, 버튼은 safe area 안쪽에 둬요.
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
};

export default ActivitySafeAreaBleed;

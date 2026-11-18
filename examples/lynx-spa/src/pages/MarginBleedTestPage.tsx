import { Box, HStack, Text, useSafeArea, VStack } from "@seed-design/lynx-react";
import type * as React from "react";

function Case({
  title,
  expect,
  children,
}: {
  title: string;
  expect: string;
  children: React.ReactNode;
}) {
  return (
    <VStack gap="x1_5">
      <Text textStyle="t4Bold" color="fg.neutral">
        {title}
      </Text>
      <Text textStyle="t2Regular" color="fg.neutralSubtle">
        {expect}
      </Text>
      {children}
    </VStack>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text textStyle="t2Bold" color="palette.staticWhite">
      {children}
    </Text>
  );
}

function Card({ index }: { index: number }) {
  return (
    <Box bg="bg.layerDefault" borderRadius="r2" p="x3" width="96px" flexShrink={0}>
      <Text textStyle="t3Bold" color="fg.neutral">
        Card {index}
      </Text>
    </Box>
  );
}

export function MarginBleedTestPage() {
  const { safeAreaInsetLeft, safeAreaInsetRight } = useSafeArea();

  return (
    <VStack gap="x6" pt="x4" pb="x10">
      <Text textStyle="t2Regular" color="fg.neutralSubtle">
        {`insets: left=${safeAreaInsetLeft} right=${safeAreaInsetRight}`}
      </Text>

      <Case
        title="1. bleedX px"
        expect='px="x4" 프레임 안의 bleedX="16px": 막대가 프레임 좌우 테두리에 닿음'
      >
        <Box bg="bg.neutralWeak" borderColor="stroke.neutralMuted" borderWidth={1} px="x4" py="x2">
          <Box bg="bg.brandSolid" p="x2" bleedX="16px">
            <Label>bleedX="16px"</Label>
          </Box>
        </Box>
      </Case>

      <Case
        title="2. bleedRight safeArea"
        expect='pr="safeArea" 프레임 안의 bleedRight="safeArea": 막대가 프레임 오른쪽 테두리에 닿음'
      >
        <Box
          bg="bg.neutralWeak"
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          pr="safeArea"
          py="x2"
        >
          <Box bg="bg.brandSolid" p="x2" bleedRight="safeArea">
            <Label>bleedRight="safeArea"</Label>
          </Box>
        </Box>
      </Case>

      <Case
        title="3. 가로 스크롤 bleed"
        expect="스크롤 영역이 화면 좌우 끝까지, Card 1은 gutter에서 시작"
      >
        <Box bleedX="16px">
          <scroll-view scroll-orientation="horizontal" style={{ width: "100%" }}>
            <HStack gap="x2" bg="bg.neutralWeak" py="x3" px="spacingX.globalGutter">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} index={index} />
              ))}
            </HStack>
          </scroll-view>
        </Box>
      </Case>

      <Case
        title="4. margin 토큰과 auto"
        expect='위: mt="x3" ml="x6", 아래: 행에서 ml="auto", 열에서 mx="auto"'
      >
        <Box bg="bg.neutralWeak" borderColor="stroke.neutralMuted" borderWidth={1} p="x2">
          <Box bg="bg.brandSolid" p="x2">
            <Label>기준</Label>
          </Box>
          <Box bg="bg.brandSolid" p="x2" mt="x3" ml="x6">
            <Label>mt x3 / ml x6</Label>
          </Box>
          <HStack mt="x3">
            <Box bg="bg.brandSolid" p="x2">
              <Label>left</Label>
            </Box>
            <Box bg="bg.brandSolid" p="x2" ml="auto">
              <Label>ml auto</Label>
            </Box>
          </HStack>
          <Box bg="bg.brandSolid" p="x2" width="120px" mx="auto" mt="x3">
            <Label>mx auto</Label>
          </Box>
        </Box>
      </Case>

      <Case title="5. VStack bleedX" expect='VStack에 bleedX="16px": 프레임 좌우 테두리에 닿음'>
        <Box bg="bg.neutralWeak" borderColor="stroke.neutralMuted" borderWidth={1} px="x4" py="x2">
          <VStack bg="bg.brandSolid" p="x2" bleedX="16px">
            <Label>VStack bleedX="16px"</Label>
          </VStack>
        </Box>
      </Case>
    </VStack>
  );
}

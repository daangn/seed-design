import type { ReactNode } from "@lynx-js/react";
import { Box, HStack, Text, VStack } from "@seed-design/lynx-react";

/**
 * 각 사례는 style prop을 쓴 `Box`·`Stack`과, 같은 결과를 최종 값의 inline style로 적은 기준
 * `<view>`를 나란히 둔다. class `<사례>-box` 요소와 id `<사례>-ref` 요소의 layout·computed
 * style이 같아야 한다.
 */

const FRAME_STYLE = {
  width: "300px",
  backgroundColor: "var(--seed-color-bg-neutral-weak)",
};

const BAR_STYLE = {
  height: "12px",
  backgroundColor: "var(--seed-color-bg-brand-solid)",
};

function Bar({ width }: { width?: string }) {
  return <view style={{ ...BAR_STYLE, width }} />;
}

function Case({
  id,
  title,
  box,
  reference,
  frameStyle,
}: {
  id: string;
  title: string;
  box: ReactNode;
  reference: ReactNode;
  frameStyle?: Record<string, string>;
}) {
  return (
    <VStack gap="x1_5">
      <Text textStyle="t3Bold" color="fg.neutral">
        {title}
      </Text>
      <view id={`${id}-fbox`} style={{ ...FRAME_STYLE, ...frameStyle }}>
        {box}
      </view>
      <view id={`${id}-fref`} style={{ ...FRAME_STYLE, ...frameStyle }}>
        {reference}
      </view>
    </VStack>
  );
}

export function BoxStylePropsTestPage() {
  return (
    <VStack gap="x5" p="x4">
      <Text textStyle="t2Regular" color="fg.neutralSubtle">
        위: Box / Stack, 아래: 같은 값을 inline style로 적은 기준 view
      </Text>

      <Case
        id="padding"
        title="padding: p → px → pl"
        box={
          <Box className="padding-box" p="x4" px="x2" pl="x6">
            <Bar />
          </Box>
        }
        reference={
          <view
            id="padding-ref"
            style={{
              paddingTop: "16px",
              paddingRight: "8px",
              paddingBottom: "16px",
              paddingLeft: "24px",
            }}
          >
            <Bar />
          </view>
        }
      />

      <Case
        id="border"
        title="border: width → side, radius → corner"
        box={
          <Box
            className="border-box"
            height="40px"
            bg="bg.brandWeak"
            borderColor="stroke.brandWeak"
            borderWidth={1}
            borderBottomWidth="4px"
            borderRadius="r3"
            borderTopLeftRadius={0}
          />
        }
        reference={
          <view
            id="border-ref"
            style={{
              height: "40px",
              background: "var(--seed-color-bg-brand-weak)",
              borderStyle: "solid",
              borderColor: "var(--seed-color-stroke-brand-weak)",
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              borderBottomWidth: "4px",
              borderLeftWidth: "1px",
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "12px",
              borderBottomRightRadius: "12px",
              borderBottomLeftRadius: "12px",
            }}
          />
        }
      />

      <Case
        id="size"
        title="width · height · min · max"
        box={
          <Box
            className="size-box"
            width="full"
            maxWidth="200px"
            height="x10"
            minHeight="x12"
            bg="bg.brandWeak"
          />
        }
        reference={
          <view
            id="size-ref"
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "40px",
              minHeight: "48px",
              background: "var(--seed-color-bg-brand-weak)",
            }}
          />
        }
      />

      <Case
        id="flex"
        title="display · direction · justify · align · gap"
        box={
          <Box
            className="flex-box"
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems="center"
            gap="x2"
            height="48px"
          >
            <Bar width="40px" />
            <Bar width="40px" />
            <Bar width="40px" />
          </Box>
        }
        reference={
          <view
            id="flex-ref"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              rowGap: "8px",
              columnGap: "8px",
              height: "48px",
            }}
          >
            <Bar width="40px" />
            <Bar width="40px" />
            <Bar width="40px" />
          </view>
        }
      />

      <Case
        id="hstack"
        title="HStack gap + wrap: 가로 간격만"
        box={
          <HStack className="hstack-box" gap="x2" wrap width="100px">
            <Bar width="40px" />
            <Bar width="40px" />
            <Bar width="40px" />
          </HStack>
        }
        reference={
          <view
            id="hstack-ref"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              columnGap: "8px",
              width: "100px",
            }}
          >
            <Bar width="40px" />
            <Bar width="40px" />
            <Bar width="40px" />
          </view>
        }
      />

      <Case
        id="vstack"
        title="VStack gap + align"
        box={
          <VStack className="vstack-box" gap="x3" align="center">
            <Bar width="40px" />
            <Bar width="80px" />
          </VStack>
        }
        reference={
          <view
            id="vstack-ref"
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "12px",
              alignItems: "center",
            }}
          >
            <Bar width="40px" />
            <Bar width="80px" />
          </view>
        }
      />

      <Case
        id="margin"
        title="margin 토큰과 auto"
        frameStyle={{ display: "flex", flexDirection: "column", paddingBottom: "4px" }}
        box={
          <Box
            className="margin-box"
            mt="x2"
            mx="auto"
            width="100px"
            height="12px"
            bg="bg.brandSolid"
          />
        }
        reference={
          <view
            id="margin-ref"
            style={{
              marginTop: "8px",
              marginLeft: "auto",
              marginRight: "auto",
              width: "100px",
              height: "12px",
              background: "var(--seed-color-bg-brand-solid)",
            }}
          />
        }
      />

      <Case
        id="bleed-x"
        title='bleedX="x4": 프레임 좌우 padding 16px을 덮음'
        frameStyle={{ paddingLeft: "16px", paddingRight: "16px" }}
        box={
          <Box className="bleed-x-box" bleedX="x4">
            <Bar />
          </Box>
        }
        reference={
          <view id="bleed-x-ref" style={{ marginLeft: "-16px", marginRight: "-16px" }}>
            <Bar />
          </view>
        }
      />

      <Case
        id="bleed-gutter"
        title='bleedX="spacingX.globalGutter"'
        frameStyle={{ paddingLeft: "16px", paddingRight: "16px" }}
        box={
          <HStack className="bleed-gutter-box" bleedX="spacingX.globalGutter">
            <Bar width="300px" />
          </HStack>
        }
        reference={
          <view
            id="bleed-gutter-ref"
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: "-16px",
              marginRight: "-16px",
            }}
          >
            <Bar width="300px" />
          </view>
        }
      />

      <Case
        id="bleed-all"
        title='bleed="x2" + bleedTop="x1"'
        frameStyle={{ padding: "8px" }}
        box={
          <Box className="bleed-all-box" bleed="x2" bleedTop="x1">
            <Bar />
          </Box>
        }
        reference={
          <view
            id="bleed-all-ref"
            style={{
              marginTop: "-4px",
              marginRight: "-8px",
              marginBottom: "-8px",
              marginLeft: "-8px",
            }}
          >
            <Bar />
          </view>
        }
      />

      <Case
        id="position"
        title="position · top · left"
        frameStyle={{ position: "relative", height: "40px" }}
        box={
          <Box
            className="position-box"
            position="absolute"
            top="8px"
            left="x4"
            width="60px"
            height="12px"
            bg="bg.brandSolid"
          />
        }
        reference={
          <view
            id="position-ref"
            style={{
              position: "absolute",
              top: "8px",
              left: "16px",
              width: "60px",
              height: "12px",
              background: "var(--seed-color-bg-brand-solid)",
            }}
          />
        }
      />

      <Case
        id="grow"
        title="flexGrow · flexShrink · alignSelf · overflow"
        box={
          <HStack height="40px">
            <Box
              className="grow-box"
              flexGrow
              height="12px"
              bg="bg.brandSolid"
              overflowX="hidden"
            />
            <Box
              flexShrink={0}
              width="60px"
              height="12px"
              alignSelf="flexEnd"
              bg="bg.criticalSolid"
            />
          </HStack>
        }
        reference={
          <view style={{ display: "flex", flexDirection: "row", height: "40px" }}>
            <view
              id="grow-ref"
              style={{
                flexGrow: 1,
                height: "12px",
                background: "var(--seed-color-bg-brand-solid)",
                overflowX: "hidden",
              }}
            />
            <view
              style={{
                flexShrink: 0,
                width: "60px",
                height: "12px",
                alignSelf: "flex-end",
                background: "var(--seed-color-bg-critical-solid)",
              }}
            />
          </view>
        }
      />

      <Case
        id="nested"
        title="중첩 Box: 자식은 부모 padding 변수를 물려받지 않음"
        box={
          <Box p="x6" bg="bg.brandWeak">
            <Box className="nested-box" bg="bg.brandSolid">
              <Bar />
            </Box>
          </Box>
        }
        reference={
          <view style={{ padding: "24px", background: "var(--seed-color-bg-brand-weak)" }}>
            <view id="nested-ref" style={{ background: "var(--seed-color-bg-brand-solid)" }}>
              <Bar />
            </view>
          </view>
        }
      />

      <Case
        id="classname"
        title="className과 함께: p prop이 pl-x7을 이기고, h-x10은 그대로"
        box={
          <Box className="classname-box pl-x7 h-x10" p="x4" bg="bg.brandWeak">
            <Bar />
          </Box>
        }
        reference={
          <view
            id="classname-ref"
            style={{
              padding: "16px",
              height: "40px",
              background: "var(--seed-color-bg-brand-weak)",
            }}
          >
            <Bar />
          </view>
        }
      />

      <Case
        id="color"
        title="color"
        box={<Box className="color-box" color="fg.brand" height="12px" />}
        reference={
          <view id="color-ref" style={{ color: "var(--seed-color-fg-brand)", height: "12px" }} />
        }
      />

      <Case
        id="theme"
        title="테마 전환: bg.layerDefault · fg.neutral"
        box={
          <Box
            className="theme-box"
            height="24px"
            bg="bg.layerDefault"
            borderColor="stroke.neutralMuted"
            borderWidth={1}
          />
        }
        reference={
          <view
            id="theme-ref"
            style={{
              height: "24px",
              background: "var(--seed-color-bg-layer-default)",
              borderStyle: "solid",
              borderColor: "var(--seed-color-stroke-neutral-muted)",
              borderWidth: "1px",
            }}
          />
        }
      />

      <Case
        id="style-override"
        title="style이 style prop 값을 덮음"
        box={
          <Box className="style-override-box" p="x3" style={{ paddingLeft: "24px" }}>
            <Bar />
          </Box>
        }
        reference={
          <view
            id="style-override-ref"
            style={{
              paddingTop: "12px",
              paddingRight: "12px",
              paddingBottom: "12px",
              paddingLeft: "24px",
            }}
          >
            <Bar />
          </view>
        }
      />
    </VStack>
  );
}

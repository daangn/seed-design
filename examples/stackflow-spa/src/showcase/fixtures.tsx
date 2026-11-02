import { Box, HStack, Text, VStack } from "@seed-design/react";
import { type ComponentProps, forwardRef } from "react";

const ITEMS = [
  "아이폰 15 Pro 256GB 팝니다",
  "원목 식탁 4인용 무료나눔",
  "캠핑 의자 2개 일괄",
  "닌텐도 스위치 OLED 화이트",
  "유아용 자전거 보조바퀴 포함",
  "다이슨 무선청소기 V12",
  "이케아 책장 화이트",
  "겨울 패딩 95 사이즈",
  "커피머신 네스프레소",
  "러닝화 270mm 새상품",
  "LG 모니터 27인치",
  "아기 카시트",
];

export const Filler = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function Filler(props, ref) {
    return (
      <VStack ref={ref} {...props} px="spacingX.globalGutter" py="x4" gap="x4" bg="bg.layerDefault">
        {ITEMS.map((title, i) => (
          <HStack key={title} gap="x3" align="center">
            <Box
              width="72px"
              height="72px"
              borderRadius="r2"
              flexShrink={0}
              style={{ background: `hsl(${(i * 37) % 360} 55% 78%)` }}
            />
            <VStack gap="x1">
              <Text textStyle="t5Regular" color="fg.neutral">
                {title}
              </Text>
              <Text textStyle="t4Regular" color="fg.neutralMuted">
                역삼동 · {i + 1}분 전
              </Text>
              <Text textStyle="t5Bold" color="fg.neutral">
                {((i + 3) * 12_000).toLocaleString()}원
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    );
  },
);

export function Hero() {
  return (
    <VStack>
      <Box
        height="420px"
        style={{
          background: "linear-gradient(160deg, #ffd8a8 0%, #ffa94d 35%, #f76707 70%, #862e0f 100%)",
        }}
      />
      <Filler />
    </VStack>
  );
}

export function Pale() {
  return (
    <VStack>
      <Box
        height="420px"
        style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)" }}
      />
      <Filler />
    </VStack>
  );
}

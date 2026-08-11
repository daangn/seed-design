"use client";

import { Box, HStack, Text, VStack } from "@seed-design/react";
import { useRef } from "react";
import { ScrollAutoHide } from "seed-design/breeze/scroll-auto-hide/scroll-auto-hide";
import { Chip } from "seed-design/ui/chip";

const ITEMS = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: `${index + 1}번째 동네 소식`,
}));

export default function ScrollAutoHidePreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={scrollContainerRef}
      data-testid="scroll-auto-hide-container"
      width="360px"
      height="480px"
      overflowY="auto"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
      borderRadius="r3"
      bg="bg.layerDefault"
    >
      <ScrollAutoHide
        scrollContainerRef={scrollContainerRef}
        data-testid="scroll-auto-hide-root"
        asChild
      >
        <Box as="header" bg="bg.layerDefault" px="x4" py="x3" style={{ zIndex: 1 }}>
          <VStack gap="x3">
            <Text as="strong" fontSize="t5" fontWeight="bold">
              동네 소식
            </Text>
            <HStack gap="x2" overflowX="auto">
              <Chip.Toggle defaultChecked size="small">
                <Chip.Label>전체</Chip.Label>
              </Chip.Toggle>
              <Chip.Toggle size="small">
                <Chip.Label>인기</Chip.Label>
              </Chip.Toggle>
              <Chip.Toggle size="small">
                <Chip.Label>가까운 순</Chip.Label>
              </Chip.Toggle>
            </HStack>
          </VStack>
        </Box>
      </ScrollAutoHide>

      <VStack as="main" gap="x2" p="x4">
        {ITEMS.map((item) => (
          <Box key={item.id} minHeight="96px" p="x4" borderRadius="r2" bg="bg.neutralWeak">
            <VStack gap="x2">
              <Text fontSize="t4" fontWeight="bold">
                {item.title}
              </Text>
              <Text color="fg.neutralMuted" fontSize="t3">
                아래로 스크롤하면 필터가 사라지고, 위로 올리면 다시 나타납니다.
              </Text>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

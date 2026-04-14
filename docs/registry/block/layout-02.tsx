"use client";

import { Box, Layout, Text, VStack } from "@seed-design/react";

export default function LayoutBlock() {
  return (
    <Layout.Root density="high">
      <Layout.Content>
        <VStack gap="x6" paddingY="x6" paddingX="x8">
          <Box
            as="header"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingY="x4"
            style={{ borderBottom: "1px solid var(--seed-color-stroke-neutralWeak)" }}
          >
            <Text textStyle="t6Bold">Dashboard</Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              2026-04-14
            </Text>
          </Box>

          <Box
            as="main"
            display="grid"
            gap="x4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {["매출", "방문자", "전환율", "평균 체류시간"].map((label) => (
              <Box
                key={label}
                bg="bg.neutralWeak"
                borderRadius="r2"
                paddingX="x6"
                paddingY="x6"
                display="flex"
                flexDirection="column"
                gap="x2"
              >
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  {label}
                </Text>
                <Text textStyle="t7Bold">—</Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </Layout.Content>
    </Layout.Root>
  );
}

"use client";

import { Box, Layout, Text, VStack } from "@seed-design/react";

export default function LayoutBlock() {
  return (
    <Layout.Root>
      <Layout.Content>
        <VStack gap="x6" paddingY="x6">
          <Box
            as="header"
            bg="bg.neutralWeak"
            borderRadius="r2"
            paddingX="x6"
            paddingY="x4"
            display="flex"
            alignItems="center"
          >
            <Text textStyle="t6Bold">Header</Text>
          </Box>

          <Box
            as="main"
            bg="bg.neutralWeak"
            borderRadius="r2"
            paddingX="x6"
            paddingY="x10"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <Text textStyle="t5Medium" color="fg.neutralSubtle">
              Content
            </Text>
          </Box>

          <Box
            as="footer"
            bg="bg.neutralWeak"
            borderRadius="r2"
            paddingX="x6"
            paddingY="x4"
            display="flex"
            alignItems="center"
          >
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              Footer
            </Text>
          </Box>
        </VStack>
      </Layout.Content>
    </Layout.Root>
  );
}

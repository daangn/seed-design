import "./styles";

import { Box, ScrollFog, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 20 }, (_, index) => index + 1);

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <Box
      className={seedClassName}
      height="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.layerDefault"
    >
      <Box
        width="300px"
        height="240px"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        borderRadius="8px"
        style={{ overflow: "hidden" }}
      >
        <ScrollFog
          style={{ width: "100%", height: "100%" }}
          hideScrollBar
          placement={["top", "bottom"]}
        >
          <VStack pt="20px" px="16px" pb="80px" gap="12px">
            <Text color="fg.neutralMuted" fontSize="14px">
              hideScrollBar: true
            </Text>
            <VStack gap="8px">
              {ITEMS.map((item) => (
                <Box
                  key={item}
                  height="40px"
                  flexShrink={false}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="4px"
                  bg="bg.neutralWeak"
                >
                  <Text color="fg.neutral" fontSize="14px">
                    콘텐츠 {item}
                  </Text>
                </Box>
              ))}
            </VStack>
          </VStack>
        </ScrollFog>
      </Box>
    </Box>
  );
}

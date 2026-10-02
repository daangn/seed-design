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
          sizes={{ top: 20, bottom: 80 }}
          placement={["top", "bottom"]}
        >
          <scroll-view
            scroll-orientation="vertical"
            style={{ width: "100%", height: "100%", padding: "20px 16px 80px" }}
          >
            <VStack gap="12px">
              <Text color="fg.neutralMuted" fontSize="14px">
                top: 20px, bottom: 80px
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
          </scroll-view>
        </ScrollFog>
      </Box>
    </Box>
  );
}

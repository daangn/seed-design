import "./styles";

import { Box, HStack, ScrollFog, Text, useSeedClassName } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 15 }, (_, index) => index + 1);

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
        height="140px"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        borderRadius="8px"
        style={{ overflow: "hidden" }}
      >
        <ScrollFog style={{ width: "100%", height: "100%" }} placement={["left", "right"]}>
          <HStack width="2000px" height="full" px="20px" align="center" gap="12px">
            {ITEMS.map((item) => (
              <Box
                key={item}
                width="120px"
                height="80px"
                flexShrink={false}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="4px"
                bg="bg.neutralWeak"
              >
                <Text color="fg.neutral" fontSize="14px">
                  항목 {item}
                </Text>
              </Box>
            ))}
          </HStack>
        </ScrollFog>
      </Box>
    </Box>
  );
}

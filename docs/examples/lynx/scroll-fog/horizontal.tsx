import { Box, HStack, ScrollFog, Text } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 15 }, (_, index) => index + 1);

export default function Example() {
  return (
    <Box
      width="full"
      maxWidth="300px"
      height="140px"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      borderRadius="8px"
      style={{ overflow: "hidden" }}
    >
      <ScrollFog style={{ width: "100%", height: "100%" }} placement={["left", "right"]}>
        <scroll-view
          scroll-orientation="horizontal"
          style={{ width: "100%", height: "100%", padding: "0 20px" }}
        >
          <HStack height="full" align="center" gap="12px">
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
        </scroll-view>
      </ScrollFog>
    </Box>
  );
}

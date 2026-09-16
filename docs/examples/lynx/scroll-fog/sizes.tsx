import "./styles";

import { Box, ScrollFog, Text, useSeedClassName } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 100 }, (_, index) => index + 1);
const ROWS = Array.from({ length: 10 }, (_, rowIndex) => ({
  id: rowIndex + 1,
  items: ITEMS.slice(rowIndex * 10, rowIndex * 10 + 10),
}));

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
        width="400px"
        height="300px"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        borderRadius="8px"
        style={{ overflow: "hidden" }}
      >
        <ScrollFog
          style={{ width: "100%", height: "100%" }}
          sizes={{
            top: 100,
            bottom: 10,
            left: 50,
            right: 50,
          }}
          placement={["top", "bottom", "left", "right"]}
        >
          <Box
            width="1140px"
            height="1140px"
            p="16px"
            display="flex"
            flexDirection="column"
            gap="12px"
          >
            {ROWS.map((row) => (
              <Box key={row.id} display="flex" flexDirection="row" gap="12px">
                {row.items.map((item) => (
                  <Box
                    key={item}
                    width="100px"
                    height="100px"
                    flexShrink={false}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="4px"
                    bg="bg.neutralWeak"
                  >
                    <Text color="fg.neutral" fontSize="14px">
                      {item}
                    </Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </ScrollFog>
      </Box>
    </Box>
  );
}

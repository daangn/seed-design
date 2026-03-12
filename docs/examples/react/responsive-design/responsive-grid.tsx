import { Box, Grid, Text, VStack } from "@seed-design/react";

export default function ResponsiveGridExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Grid는 base breakpoint 별로 열 수가 다르게 구성됩니다.</Text>
      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: "x3", md: "x4" }}>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          1
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          2
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          3
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          4
        </Box>
      </Grid>
    </VStack>
  );
}

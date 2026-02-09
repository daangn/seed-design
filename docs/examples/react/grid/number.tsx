import { Divider, Flex, Grid, HStack } from "@seed-design/react";

export default function GridNumber() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8">
      <Grid flexGrow columns={2} gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.purple300"
            color="palette.purple700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
      <Divider orientation="vertical" />
      <Grid flexGrow rows={2} gap="x2" autoFlow="column">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.green300"
            color="palette.green700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
    </HStack>
  );
}

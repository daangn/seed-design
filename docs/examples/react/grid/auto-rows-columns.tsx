import { Divider, Flex, Grid, HStack } from "@seed-design/react";

export default function AutoRowsColumns() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8" align="flex-start">
      <Grid flexGrow columns={3} autoRows="1fr" gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.purple300"
            color="palette.purple700"
            borderRadius="r2"
            align="center"
            justify="center"
            p="x4"
          >
            {n === 2
              ? "Ea anim non aute minim ea deserunt enim Elit deserunt laborum et quis sit."
              : n}
          </Flex>
        ))}
      </Grid>
      <Divider orientation="vertical" style={{ alignSelf: "stretch" }} />
      <Grid flexGrow rows={3} autoColumns="1fr" autoFlow="column" gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.green300"
            color="palette.green700"
            borderRadius="r2"
            align="center"
            justify="center"
            p="x4"
          >
            {n === 2
              ? "Ea anim non aute minim ea deserunt enim Elit deserunt laborum et quis sit."
              : n}
          </Flex>
        ))}
      </Grid>
    </HStack>
  );
}

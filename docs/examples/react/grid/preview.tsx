import { Flex, Grid } from "@seed-design/react";

export default function GridPreview() {
  return (
    <Grid columns={3} gap="x2" width="full" height="full" p="x8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Flex
          key={index}
          bg="palette.purple300"
          color="palette.purple700"
          borderRadius="r2"
          align="center"
          justify="center"
        >
          {index + 1}
        </Flex>
      ))}
    </Grid>
  );
}

import { Box, Grid } from "@seed-design/react";

export default function GridColumnsString() {
  return (
    <Grid columns="2fr 1fr" gap="x2" width="full">
      <Box bg="bg.brandSolid" height="100px" borderRadius="r2" />
      <Box bg="bg.brandSolid" height="100px" borderRadius="r2" />
      <Box bg="bg.brandSolid" height="100px" borderRadius="r2" />
      <Box bg="bg.brandSolid" height="100px" borderRadius="r2" />
    </Grid>
  );
}

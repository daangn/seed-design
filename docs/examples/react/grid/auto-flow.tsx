import { useState } from "react";
import { Grid, type GridProps, GridItem, VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

type AutoFlow = NonNullable<GridProps["autoFlow"]>;

export default function AutoFlow() {
  const [autoFlow, setAutoFlow] = useState<AutoFlow>("row");

  const isColumn = autoFlow.startsWith("column");
  const color = isColumn ? "green" : "purple";

  const gridProps = isColumn ? { rows: 3 } : { columns: 3 };
  const spanProps = isColumn ? { rowSpan: 2 } : { colSpan: 2 };

  return (
    <VStack gap="x6" width="full" height="full" p="x8" align="center">
      <Grid {...gridProps} alignSelf="stretch" flexGrow gap="x2" autoFlow={autoFlow}>
        {[1, 2].map((n) => (
          <GridItem
            key={n}
            {...spanProps}
            display="flex"
            bg={`palette.${color}600`}
            color={`palette.${color}200`}
            borderRadius="r2"
            alignItems="center"
            justifyContent="center"
          >
            {n}
          </GridItem>
        ))}
        {[3, 4, 5].map((n) => (
          <GridItem
            key={n}
            display="flex"
            bg={`palette.${color}300`}
            color={`palette.${color}600`}
            borderRadius="r2"
            alignItems="center"
            justifyContent="center"
          >
            {n}
          </GridItem>
        ))}
      </Grid>
      <SegmentedControl
        value={autoFlow}
        onValueChange={(value) => setAutoFlow(value as AutoFlow)}
        aria-label="Auto Flow"
      >
        <SegmentedControlItem value="row">row</SegmentedControlItem>
        <SegmentedControlItem value="row dense">row dense</SegmentedControlItem>
        <SegmentedControlItem value="column">column</SegmentedControlItem>
        <SegmentedControlItem value="column dense">column dense</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}

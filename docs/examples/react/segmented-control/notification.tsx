import { ActionButton, VStack } from "@seed-design/react";
import { useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlNotification() {
  const [sortBy, setSortBy] = useState("monthly");
  const [hasSeenAnnual, setHasSeenAnnual] = useState(false);

  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl
        aria-label="Billing Method"
        value={sortBy}
        onValueChange={(value) => {
          setSortBy(value);

          if (value === "annual") setHasSeenAnnual(true);
        }}
      >
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="annual" notification={!hasSeenAnnual}>
          Annual
        </SegmentedControlItem>
        <SegmentedControlItem value="enterprise">Enterprise Custom</SegmentedControlItem>
      </SegmentedControl>
      <ActionButton
        size="xsmall"
        variant="neutralSolid"
        disabled={!hasSeenAnnual}
        onClick={() => setHasSeenAnnual(false)}
      >
        Reset Notification
      </ActionButton>
    </VStack>
  );
}

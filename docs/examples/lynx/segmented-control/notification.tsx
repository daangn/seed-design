import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [sortBy, setSortBy] = useState("monthly");
  const [hasSeenAnnual, setHasSeenAnnual] = useState(false);

  function handleValueChange(value: string) {
    "background only";
    setSortBy(value);

    if (value === "annual") setHasSeenAnnual(true);
  }

  function handleResetNotification() {
    "background only";
    setHasSeenAnnual(false);
  }

  return (
    <view className={`${seedClassName} docs-lynx-segmented-control-root`}>
      <view className="segmented-control-example">
        <SegmentedControl
          accessibility-label="Billing Method"
          value={sortBy}
          onValueChange={handleValueChange}
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
          bindtap={handleResetNotification}
        >
          Reset Notification
        </ActionButton>
      </view>
    </view>
  );
}

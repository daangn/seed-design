import "./styles";

import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
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
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);

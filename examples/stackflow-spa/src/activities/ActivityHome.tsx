import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";

import { ActionButton } from "../design-system/components";
import { useFlow } from "../stackflow";

const ActivityHome: ActivityComponentType = () => {
  const { push } = useFlow();

  return (
    <AppScreen appBar={{ title: "Home" }}>
      <div style={{ overflow: "auto", height: "100vh" }}>
        <ActionButton onClick={() => push("ActivityActionButton", {})}>ActionButton</ActionButton>
        <ActionButton onClick={() => push("ActivityRadioGroup", {})}>RadioGroup</ActionButton>
        <ActionButton onClick={() => push("ActivityCheckbox", {})}>Checkbox</ActionButton>
        <ActionButton onClick={() => push("ActivityChip", {})}>ChipButton</ActionButton>
        <ActionButton onClick={() => push("ActivityAlertDialog", {})}>Dialog</ActionButton>
        <ActionButton onClick={() => push("ActivityCallout", {})}>Callout</ActionButton>
        <ActionButton onClick={() => push("ActivitySwitch", {})}>Switch</ActionButton>
        <ActionButton onClick={() => push("ActivityTextField", {})}>TextField</ActionButton>
        <ActionButton onClick={() => push("ActivityHelpBubble", {})}>HelpBubble</ActionButton>
        <ActionButton onClick={() => push("ActivityTabs", {})}>Tabs</ActionButton>
        <ActionButton onClick={() => push("ActivityChipTabs", {})}>ChipTabs</ActionButton>
      </div>
    </AppScreen>
  );
};

export default ActivityHome;

import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityPluginBasicUI: {};
  }
}

const ActivityPluginBasicUI: ActivityComponentType<"ActivityPluginBasicUI"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen
      appBar={{
        backButton: {},
        title: "Random Long Title Hello World",
        renderRight: () => (
          <ActionButton
            variant="ghost"
            bleedX="asPadding"
            bleedY="asPadding"
            layout="iconOnly"
            size="large"
            aria-label="Home"
            onClick={() => push("ActivityHome", {})}
          >
            <Icon svg={<IconHouseLine />} />
          </ActionButton>
        ),
      }}
    >
      <VStack p="x4" grow>
        <ActionButton
          variant="neutralSolid"
          flexGrow
          onClick={() => push("ActivityTransparentBar", {})}
        >
          ActivityTransparentBar
        </ActionButton>
      </VStack>
    </AppScreen>
  );
};

export default ActivityPluginBasicUI;

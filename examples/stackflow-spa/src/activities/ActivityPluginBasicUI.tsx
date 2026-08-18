import { IconHouseFill } from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityPluginBasicUI: {};
  }
}

// SEED 의 legacy AppScreen 이 아니라 @stackflow/plugin-basic-ui 가 제공하는 AppScreen 이다.
// SEED AppScreen / NextAppScreen 과 나란히 비교하려고 남겨둔 화면.
const ActivityPluginBasicUI: StaticActivityComponentType<"ActivityPluginBasicUI"> = () => {
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
            <Icon svg={<IconHouseFill />} />
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

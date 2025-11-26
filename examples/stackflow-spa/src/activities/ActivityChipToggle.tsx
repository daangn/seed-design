import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarIconButton, AppBarLeft, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { useFlow } from "@stackflow/react/future";

import { chipVariantMap } from "@seed-design/css/recipes/chip";

import IconPlusFill from "@karrotmarket/react-monochrome-icon/IconPlusFill";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Chip, type ToggleChipProps } from "seed-design/ui/chip";
import { Icon } from "@seed-design/react";

const initialVariants = {
  size: "medium",
  layout: "withText",
  variant: "solid",
} satisfies ToggleChipProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityChipToggle: {};
  }
}

const ActivityChipToggle: ActivityComponentType<"ActivityChipToggle"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Action Chip</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={chipVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <Chip.Button key={JSON.stringify(variants)} {...variants}>
              {variants.layout === "withText" ? (
                <Chip.Label>야옹</Chip.Label>
              ) : (
                <Icon svg={<IconPlusFill />} />
              )}
            </Chip.Button>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityChipToggle;

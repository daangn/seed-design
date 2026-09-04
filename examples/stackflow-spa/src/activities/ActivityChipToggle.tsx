import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
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

const ActivityChipToggle: StaticActivityComponentType<"ActivityChipToggle"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Action Chip</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityChipToggle;

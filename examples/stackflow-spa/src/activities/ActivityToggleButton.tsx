import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

import { toggleButtonVariantMap } from "@seed-design/css/recipes/toggle-button";

import { IconThumbUpFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ToggleButton, type ToggleButtonProps } from "seed-design/ui/toggle-button";
import { PrefixIcon } from "@seed-design/react";

const initialVariants = {
  variant: "brandSolid",
  size: "small",
} satisfies ToggleButtonProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityToggleButton: {};
  }
}

const ActivityToggleButton: StaticActivityComponentType<"ActivityToggleButton"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Toggle Button</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <ComponentAnalyzer
          variantsMap={toggleButtonVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <ToggleButton key={JSON.stringify(variants)} {...variants}>
              <PrefixIcon svg={<IconThumbUpFill />} />
              Like
            </ToggleButton>
          )}
        />
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityToggleButton;

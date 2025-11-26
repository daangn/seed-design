import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain, AppBarRight, AppBarIconButton } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

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

const ActivityToggleButton: ActivityComponentType<"ActivityToggleButton"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Toggle Button</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
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
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityToggleButton;

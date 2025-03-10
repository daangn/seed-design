import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { toggleButtonVariantMap } from "@seed-design/css/recipes/toggle-button";

import { IconThumbUpFill } from "@daangn/react-monochrome-icon";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ToggleButton, type ToggleButtonProps } from "../design-system/ui/toggle-button";
import { PrefixIcon } from "@seed-design/react";

const initialVariants = {
  variant: "brandSolid",
  size: "small",
} satisfies ToggleButtonProps;

const ActivityToggleButton: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Toggle Button</AppBarMain>
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

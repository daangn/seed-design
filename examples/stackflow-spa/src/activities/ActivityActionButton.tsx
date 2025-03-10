import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { actionButtonVariantMap } from "@seed-design/css/recipes/action-button";

import { IconChevronDownFill } from "@daangn/react-monochrome-icon";
import IconPlusFill from "@daangn/react-monochrome-icon/IconPlusFill";
import { Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ActionButton, type ActionButtonProps } from "../design-system/ui/action-button";

const initialVariants = {
  variant: "brandSolid",
  size: "xsmall",
  layout: "withText",
} satisfies ActionButtonProps;

const ActivityActionButton: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Action Button</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={actionButtonVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <ActionButton key={JSON.stringify(variants)} {...variants}>
              {variants.layout === "withText" ? (
                <>
                  <PrefixIcon svg={<IconPlusFill />} />
                  야옹
                  <SuffixIcon svg={<IconChevronDownFill />} />
                </>
              ) : (
                <Icon svg={<IconPlusFill />} />
              )}
            </ActionButton>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityActionButton;

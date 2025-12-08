import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { actionButtonVariantMap } from "@seed-design/css/recipes/action-button";

import { IconChevronDownFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import IconPlusFill from "@karrotmarket/react-monochrome-icon/IconPlusFill";
import { Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ActionButton, type ActionButtonProps } from "seed-design/ui/action-button";

const initialVariants = {
  variant: "brandSolid",
  size: "xsmall",
  layout: "withText",
} satisfies ActionButtonProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityActionButton: {};
  }
}

const ActivityActionButton: StaticActivityComponentType<"ActivityActionButton"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Action Button</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
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

import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { mannerTempBadgeVariantMap } from "@seed-design/css/recipes/manner-temp-badge";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { MannerTempBadge, type MannerTempBadgeProps } from "seed-design/ui/manner-temp-badge";

const initialVariants = {
  temperature: 36.5,
  level: "l1",
} satisfies MannerTempBadgeProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityMannerTempLevel: {};
  }
}

const ActivityMannerTempLevel: StaticActivityComponentType<"ActivityMannerTempLevel"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>MannerTempLevel</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={mannerTempBadgeVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <MannerTempBadge key={JSON.stringify(variants)} temperature={36.5} {...variants} />
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMannerTempLevel;

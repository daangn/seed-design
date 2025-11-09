import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { mannerTempBadgeVariantMap } from "@seed-design/css/recipes/manner-temp-badge";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { MannerTempBadge, type MannerTempBadgeProps } from "seed-design/ui/manner-temp-badge";
import { useTheme } from "../contexts/ThemeContext";

const initialVariants = {
  temperature: 36.5,
  level: "l1",
} satisfies MannerTempBadgeProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityMannerTempLevel: {};
  }
}

const ActivityMannerTempLevel: ActivityComponentType<"ActivityMannerTempLevel"> = () => {
  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>MannerTempLevel</AppBarMain>
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

import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { checkboxVariantMap } from "@seed-design/css/recipes/checkbox";
import { checkmarkVariantMap } from "@seed-design/css/recipes/checkmark";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Checkbox } from "seed-design/ui/checkbox";

const variantsMap = {
  size: [...checkboxVariantMap.size],
  weight: [...checkboxVariantMap.weight],
  tone: [...checkmarkVariantMap.tone],
  checked: ["false", "true"],
  disabled: ["false", "true"],
};

const initialVariants = {
  size: "medium",
  weight: "regular",
  tone: "brand",
  checked: "false",
  disabled: "false",
} satisfies { [K in keyof typeof variantsMap]: (typeof variantsMap)[K][number] };

declare module "@stackflow/config" {
  interface Register {
    ActivityCheckbox: {};
  }
}

const LONG_LABEL = "개인정보 처리방침과 서비스 이용약관을 읽고 이해했으며, 이에 동의합니다.";

const ActivityCheckbox: StaticActivityComponentType<"ActivityCheckbox"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Checkbox</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={variantsMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <Checkbox
              key={JSON.stringify(variants)}
              size={variants.size as "medium" | "large"}
              weight={variants.weight as "regular" | "bold"}
              tone={variants.tone as "neutral" | "brand"}
              defaultChecked={variants.checked === "true"}
              disabled={variants.disabled === "true"}
              label={LONG_LABEL}
            />
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityCheckbox;

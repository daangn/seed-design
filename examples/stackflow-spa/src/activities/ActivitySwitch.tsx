import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { switchVariantMap } from "@seed-design/css/recipes/switch";
import { switchmarkVariantMap } from "@seed-design/css/recipes/switchmark";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Switch } from "seed-design/ui/switch";

const variantsMap = {
  size: [...switchVariantMap.size],
  tone: [...switchmarkVariantMap.tone],
  checked: ["false", "true"],
  disabled: ["false", "true"],
};

const initialVariants = {
  size: "32",
  tone: "brand",
  checked: "false",
  disabled: "false",
} satisfies { [K in keyof typeof variantsMap]: (typeof variantsMap)[K][number] };

declare module "@stackflow/config" {
  interface Register {
    ActivitySwitch: {};
  }
}

const LONG_LABEL =
  "새로운 메시지가 도착할 때마다 푸시 알림을 받을 수 있습니다. 언제든지 변경할 수 있어요.";

const ActivitySwitch: StaticActivityComponentType<"ActivitySwitch"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Switch</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <ComponentAnalyzer
          variantsMap={variantsMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <Switch
              key={JSON.stringify(variants)}
              size={variants.size as "16" | "24" | "32"}
              tone={variants.tone as "neutral" | "brand"}
              defaultChecked={variants.checked === "true"}
              disabled={variants.disabled === "true"}
              label={LONG_LABEL}
            />
          )}
        />
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivitySwitch;

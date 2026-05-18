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
import { radioVariantMap } from "@seed-design/css/recipes/radio";
import { radiomarkVariantMap } from "@seed-design/css/recipes/radiomark";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

const variantsMap = {
  size: [...radioVariantMap.size],
  weight: [...radioVariantMap.weight],
  tone: [...radiomarkVariantMap.tone],
  disabled: ["false", "true"],
};

const initialVariants = {
  size: "medium",
  weight: "regular",
  tone: "brand",
  disabled: "false",
} satisfies { [K in keyof typeof variantsMap]: (typeof variantsMap)[K][number] };

declare module "@stackflow/config" {
  interface Register {
    ActivityRadioGroup: {};
  }
}

const LONG_LABEL_A =
  "이메일로 알림 받기 — 업데이트와 프로모션 소식을 이메일로 받아보세요. 수신 거부는 언제든 가능합니다.";
const LONG_LABEL_B =
  "문자 메시지로 알림 받기 — 긴급한 알림과 인증 코드를 문자로 받아보세요. 통신사 요금이 부과될 수 있습니다.";
const LONG_LABEL_C =
  "푸시 알림으로 받기 — 앱 푸시 알림을 통해 실시간으로 소식을 받아보세요. 기기 설정에서 관리 가능합니다.";

const ActivityRadioGroup: StaticActivityComponentType<"ActivityRadioGroup"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>RadioGroup</AppBarMain>
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
            <RadioGroup
              key={JSON.stringify(variants)}
              name={`radio-${JSON.stringify(variants)}`}
              defaultValue="a"
              disabled={variants.disabled === "true"}
            >
              <RadioGroupItem
                value="a"
                label={LONG_LABEL_A}
                size={variants.size as "medium" | "large"}
                weight={variants.weight as "regular" | "bold"}
                tone={variants.tone as "neutral" | "brand"}
              />
              <RadioGroupItem
                value="b"
                label={LONG_LABEL_B}
                size={variants.size as "medium" | "large"}
                weight={variants.weight as "regular" | "bold"}
                tone={variants.tone as "neutral" | "brand"}
              />
              <RadioGroupItem
                value="c"
                label={LONG_LABEL_C}
                size={variants.size as "medium" | "large"}
                weight={variants.weight as "regular" | "bold"}
                tone={variants.tone as "neutral" | "brand"}
              />
            </RadioGroup>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityRadioGroup;

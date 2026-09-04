import "./styles";

import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ActionableCallout, Callout, DismissibleCallout } from "@/components/ui/callout";

const description =
  "기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요.";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        <Callout tone="magic" prefixIcon={<IconSparkle2 />} description={description} />
        <ActionableCallout tone="magic" prefixIcon={<IconSparkle2 />} description={description} />
        <DismissibleCallout tone="magic" prefixIcon={<IconSparkle2 />} description={description} />
      </view>
    </page>
  );
}

root.render(<Root />);

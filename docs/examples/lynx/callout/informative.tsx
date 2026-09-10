import "./styles";

import IconCalendarFill from "@karrotmarket/lynx-monochrome-icon/IconCalendarFill";

import { useSeedClassName } from "@seed-design/lynx-react";
import { ActionableCallout, Callout, DismissibleCallout } from "@/components/ui/callout";

const description =
  "기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요.";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-callout-root`}>
      <view className="callout-preview">
        <Callout tone="informative" prefixIcon={<IconCalendarFill />} description={description} />
        <ActionableCallout
          tone="informative"
          prefixIcon={<IconCalendarFill />}
          description={description}
        />
        <DismissibleCallout
          tone="informative"
          prefixIcon={<IconCalendarFill />}
          description={description}
        />
      </view>
    </view>
  );
}

import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Callout, DismissibleCallout } from "@/components/ui/callout";

const description =
  "기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요.";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-callout-root`}>
      <view className="callout-preview">
        <Callout description={description} linkProps={{ children: "시도해 보기" }} />
        <DismissibleCallout description={description} linkProps={{ children: "시도해 보기" }} />
      </view>
    </view>
  );
}

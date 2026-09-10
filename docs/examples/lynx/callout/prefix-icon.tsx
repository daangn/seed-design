import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Callout } from "@/components/ui/callout";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        <Callout
          tone="informative"
          prefixIcon={<IconBellFill />}
          title="알림"
          description="새로운 소식을 확인해 보세요."
        />
      </view>
    </page>
  );
}

root.render(<Root />);

import "./styles";

import IconPictureFill from "@karrotmarket/lynx-monochrome-icon/IconPictureFill";
import { Icon, useSeedClassName } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-content-placeholder-root`}>
      <ContentPlaceholder style={{ width: "160px", height: "160px" }}>
        <Icon icon={<IconPictureFill />} />
      </ContentPlaceholder>
      <ContentPlaceholder style={{ width: "240px", height: "120px" }}>
        <Icon icon={<IconPictureFill />} />
      </ContentPlaceholder>
    </view>
  );
}

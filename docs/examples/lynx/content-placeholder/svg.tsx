import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
import IconCarrotFill from "@karrotmarket/lynx-monochrome-icon/IconCarrotFill";
export default function Example() {
  const theme = useSeedClassName();
  return (
    <view className={`${theme} docs-lynx-content-placeholder-root`}>
      <ContentPlaceholder width="160px" height="160px">
        <IconCarrotFill tint-color="#ff6600" />
      </ContentPlaceholder>
    </view>
  );
}

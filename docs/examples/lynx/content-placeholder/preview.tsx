import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
export default function Example() {
  const theme = useSeedClassName();
  return (
    <view className={`${theme} docs-lynx-content-placeholder-root`}>
      <ContentPlaceholder width="160px" height="160px" />
      <ContentPlaceholder type="car" width="240px" height="120px" />
    </view>
  );
}

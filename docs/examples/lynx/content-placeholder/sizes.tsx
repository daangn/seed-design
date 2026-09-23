import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
export default function Example() {
  const theme = useSeedClassName();
  return (
    <view className={`${theme} docs-lynx-content-placeholder-root`}>
      <ContentPlaceholder type="food" width="80px" height="80px" />
      <ContentPlaceholder type="food" width="160px" height="160px" />
      <ContentPlaceholder type="food" width="240px" height="120px" />
    </view>
  );
}

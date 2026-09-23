import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
const types = [
  "default",
  "buySell",
  "car",
  "commerce",
  "coupon",
  "food",
  "group",
  "image",
  "jobs",
  "business",
  "post",
  "realty",
] as const;
export default function Example() {
  const theme = useSeedClassName();
  return (
    <view className={`${theme} docs-lynx-content-placeholder-grid`}>
      {types.map((type) => (
        <view key={type}>
          <ContentPlaceholder type={type} width="96px" height="96px" />
          <text>{type}</text>
        </view>
      ))}
    </view>
  );
}

import { car } from "@seed-design/lynx-react/content-placeholder-presets/car";
import { food } from "@seed-design/lynx-react/content-placeholder-presets/food";
import { ContentPlaceholder } from "../seed-design/ui/content-placeholder";
export function ContentPlaceholderPage() {
  return (
    <view className="flex flex-col pb-x10">
      <text className="t6-bold mb-x4 text-fg-neutral">ContentPlaceholder</text>
      <ContentPlaceholder preset={car} width="160px" height="160px" />
      <ContentPlaceholder preset={food} width="100%" height="120px" />
    </view>
  );
}

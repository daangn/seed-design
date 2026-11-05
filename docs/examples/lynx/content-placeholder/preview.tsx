import { defaultPreset } from "@seed-design/lynx-react/content-placeholder-presets/default";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";

export default function ContentPlaceholderPreview() {
  return <ContentPlaceholder preset={defaultPreset} width="200px" height="200px" />;
}

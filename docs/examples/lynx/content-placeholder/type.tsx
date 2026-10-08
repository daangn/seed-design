import { HStack } from "@seed-design/lynx-react";
import { contentPlaceholderVariantMap } from "@seed-design/lynx-css/recipes/content-placeholder";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";

export default function ContentPlaceholderTypeExample() {
  return (
    <HStack gap="x3" wrap="wrap">
      {contentPlaceholderVariantMap.type.map((type) => (
        <ContentPlaceholder key={type} type={type} width="120px" height="120px" />
      ))}
    </HStack>
  );
}

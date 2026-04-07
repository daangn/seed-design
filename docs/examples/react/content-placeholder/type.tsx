import { HStack } from "@ride-developer/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { contentPlaceholderVariantMap } from "@ride-developer/css/recipes/content-placeholder";

export default function ContentPlaceholderTypeExample() {
  return (
    <HStack gap="x3" wrap>
      {contentPlaceholderVariantMap.type.map((type) => (
        <ContentPlaceholder key={type} type={type} style={{ width: 120, height: 120 }} />
      ))}
    </HStack>
  );
}

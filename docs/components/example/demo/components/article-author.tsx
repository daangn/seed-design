import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Text } from "@seed-design/react";
import { Inline } from "@seed-design/react";

export function ArticleAuthor({ author }: { author: string }) {
  return (
    <Inline gap="x1_5" alignItems="center">
      <Avatar
        fallback={<IdentityPlaceholder identity="person" />}
        size="20"
        style={{ zIndex: -1 }}
      />
      <Text textStyle="t4Medium" color="fg.neutral">
        {author}
      </Text>
    </Inline>
  );
}

import { NextList, NextListItem } from "seed-design/ui/next-list";
import { HStack } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar } from "seed-design/ui/avatar";

export default function ListAlignment() {
  return (
    <HStack width="full" align="flex-start" gap="x4">
      <NextList>
        <NextListItem
          prefix={<Avatar size="48" fallback={<IdentityPlaceholder />} />}
          title="Prefix에 Avatar 넣기. Veniam elit velit esse ea incididunt sunt sit aute."
          detail="Et proident sit ullamco ut voluptate. Voluptate eiusmod occaecat adipisicing quis qui esse."
        />
      </NextList>
      <NextList>
        <NextListItem
          alignItems="flex-start"
          prefix={<Avatar size="48" fallback={<IdentityPlaceholder />} />}
          title="Prefix에 Avatar 넣고 상단으로 정렬하기. Veniam elit velit esse ea incididunt sunt sit aute."
          detail="일반적으로 `title`이 길어질 때 `alignItems`를 `flex-start`로 설정합니다."
        />
      </NextList>
    </HStack>
  );
}

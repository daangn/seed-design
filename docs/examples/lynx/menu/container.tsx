import IconPencilLine from "@karrotmarket/lynx-monochrome-icon/IconPencilLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";
import { ActionButton, Text, VStack } from "@seed-design/lynx-react";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function Example() {
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  function handleOpenChange(open: boolean, details: { reason: string }) {
    "background only";
    if (!open) setCloseReason(details.reason);
  }

  function handleUnderlyingTap() {
    "background only";
    setCount((current) => current + 1);
  }

  return (
    <VStack width="full" gap="x4">
      <MenuRoot onOpenChange={handleOpenChange}>
        <MenuTrigger>
          <ActionButton variant="neutralSolid">window에 열기</ActionButton>
        </MenuTrigger>
        <MenuContent container="window">
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
      <ActionButton variant="neutralWeak" bindtap={handleUnderlyingTap}>
        {`아래 버튼 ${count}`}
      </ActionButton>
      <Text textStyle="t3Regular" color="fg.neutralMuted">
        {`마지막 닫힘 이유: ${closeReason ?? "-"}`}
      </Text>
    </VStack>
  );
}

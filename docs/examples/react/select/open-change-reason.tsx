import { Box, HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <Box width="240px">
        <SelectRoot
          open={open}
          onOpenChange={(open, details) => {
            setOpen(open);

            (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
          }}
          defaultValue={["apple"]}
        >
          <SelectTrigger aria-label="과일" placeholder="과일 선택" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple" label="사과" />
              <SelectItem value="banana" label="바나나" />
              <SelectItem value="cherry" label="체리" />
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </Box>

      <HStack gap="x4">
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 열림 이유: {openReason ?? "-"}
        </Text>
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </Text>
      </HStack>
    </VStack>
  );
}

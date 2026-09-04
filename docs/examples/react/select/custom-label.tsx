"use client";

import {
  IconCarLine,
  IconFigureBikeLine,
  IconMetroFrontsideLine,
} from "@karrotmarket/react-monochrome-icon";
import { Badge, Box, HStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectCustomLabel() {
  return (
    <Box width="280px">
      <SelectRoot defaultValue={["metro"]}>
        <SelectTrigger aria-label="이동 수단" placeholder="이동 수단 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="bike" label="자전거" prefixIcon={<IconFigureBikeLine />} />
            <SelectItem
              value="metro"
              textValue="지하철"
              prefixIcon={<IconMetroFrontsideLine />}
              label={
                <HStack as="span" align="center" gap="x1_5">
                  지하철
                  <Badge.Root variant="weak" tone="informative">
                    <Badge.Label>가장 빠름</Badge.Label>
                  </Badge.Root>
                </HStack>
              }
            />
            <SelectItem
              value="car"
              textValue="자동차"
              disabled
              prefixIcon={<IconCarLine />}
              label={
                <HStack as="span" align="center" gap="x1_5">
                  자동차
                  <Badge.Root variant="weak" tone="warning">
                    <Badge.Label>고객지원에 문의</Badge.Label>
                  </Badge.Root>
                </HStack>
              }
            />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}

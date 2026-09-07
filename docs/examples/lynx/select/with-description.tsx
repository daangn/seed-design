import "./styles";

import { root } from "@lynx-js/react";
import { Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const DELIVERY_OPTIONS = [
  { value: "standard", textValue: "일반 배송", description: "3-5일 소요" },
  { value: "express", textValue: "빠른 배송", description: "1-2일 소요" },
  { value: "same-day", textValue: "당일 배송", description: "오늘 도착" },
] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example">
        <Box className="select-example__stack">
          <SelectRoot options={DELIVERY_OPTIONS} defaultValue={["standard"]}>
            <SelectTrigger accessibility-label="배송 방법" placeholder="배송 방법 선택" />
            <SelectContent>
              <SelectGroup>
                {DELIVERY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    description={option.description}
                  />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
      </VStack>
    </page>
  );
}

root.render(<Root />);

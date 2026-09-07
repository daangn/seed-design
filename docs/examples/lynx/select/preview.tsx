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

const FRUIT_OPTIONS = [
  { value: "apple", textValue: "사과" },
  { value: "banana", textValue: "바나나" },
  { value: "cherry", textValue: "체리" },
] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example">
        <Box className="select-example__stack">
          <SelectRoot options={FRUIT_OPTIONS} defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="과일" placeholder="과일을 선택하세요" />
            <SelectContent>
              <SelectGroup>
                {FRUIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} />
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

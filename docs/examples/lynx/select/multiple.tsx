import "./styles";

import { root, useState } from "@lynx-js/react";
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
  { value: "grape", textValue: "포도" },
] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState<string[]>(["apple", "cherry"]);

  return (
    <page className={seedClassName}>
      <VStack className="select-example" gap="x3">
        <Box className="select-example__stack">
          <SelectRoot
            multiple
            options={FRUIT_OPTIONS}
            value={value}
            defaultOpen
            onValueChange={setValue}
          >
            <SelectTrigger accessibility-label="과일" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                {FRUIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
        <text className="select-example__status">선택 값: [{value.join(", ")}]</text>
      </VStack>
    </page>
  );
}

root.render(<Root />);

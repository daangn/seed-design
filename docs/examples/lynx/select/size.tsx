import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
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
] as const;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example">
        <VStack className="select-example__stack" gap="x4">
          <SelectRoot size="large" options={FRUIT_OPTIONS} defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="과일, 큰 크기" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                {FRUIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
          <SelectRoot size="medium" options={FRUIT_OPTIONS} defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="과일, 중간 크기" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                {FRUIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);

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

const REGION_GROUPS = [
  {
    label: "아시아",
    options: [
      { value: "seoul", textValue: "서울" },
      { value: "tokyo", textValue: "도쿄" },
      { value: "singapore", textValue: "싱가포르" },
      { value: "dubai", textValue: "두바이" },
    ],
  },
  {
    label: "유럽",
    options: [
      { value: "london", textValue: "런던" },
      { value: "paris", textValue: "파리" },
      { value: "berlin", textValue: "베를린" },
    ],
  },
  {
    label: "아메리카",
    options: [
      { value: "new-york", textValue: "뉴욕" },
      { value: "sao-paulo", textValue: "상파울루" },
    ],
  },
] as const;

const REGION_OPTIONS = [
  ...REGION_GROUPS[0].options,
  ...REGION_GROUPS[1].options,
  ...REGION_GROUPS[2].options,
];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example">
        <Box className="select-example__stack">
          <SelectRoot options={REGION_OPTIONS} defaultValue={["seoul"]}>
            <SelectTrigger accessibility-label="지역" placeholder="지역 선택" />
            <SelectContent>
              {REGION_GROUPS.map((group) => (
                <SelectGroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} />
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
      </VStack>
    </page>
  );
}

root.render(<Root />);

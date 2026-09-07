import "./styles";

import IconGlobeLine from "@karrotmarket/lynx-monochrome-icon/IconGlobeLine";
import IconLockLine from "@karrotmarket/lynx-monochrome-icon/IconLockLine";
import IconPerson2Line from "@karrotmarket/lynx-monochrome-icon/IconPerson2Line";
import IconPersonLine from "@karrotmarket/lynx-monochrome-icon/IconPersonLine";
import { root } from "@lynx-js/react";
import { Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const AUDIENCE_GROUPS = [
  {
    label: "그룹",
    options: [
      { value: "public", textValue: "전체 공개", prefixIcon: <IconGlobeLine /> },
      { value: "followers", textValue: "팔로워만", prefixIcon: <IconLockLine /> },
      { value: "private", textValue: "나만", prefixIcon: <IconPersonLine /> },
    ],
  },
  {
    label: "사람",
    options: [
      { value: "kim", textValue: "김하늘" },
      { value: "lee", textValue: "이하늘" },
    ],
  },
] as const;

const AUDIENCE_OPTIONS = [...AUDIENCE_GROUPS[0].options, ...AUDIENCE_GROUPS[1].options];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="select-example">
        <Box className="select-example__stack">
          <SelectRoot options={AUDIENCE_OPTIONS}>
            <SelectTrigger
              accessibility-label="공유 대상"
              placeholder="공유 대상"
              prefixIcon={<IconPerson2Line />}
            />
            <SelectContent>
              {AUDIENCE_GROUPS.map((group) => (
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

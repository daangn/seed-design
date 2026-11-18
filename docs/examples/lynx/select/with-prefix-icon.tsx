import IconGlobeLine from "@karrotmarket/lynx-monochrome-icon/IconGlobeLine";
import IconLockLine from "@karrotmarket/lynx-monochrome-icon/IconLockLine";
import IconPerson2Line from "@karrotmarket/lynx-monochrome-icon/IconPerson2Line";
import IconPersonLine from "@karrotmarket/lynx-monochrome-icon/IconPersonLine";
import { Box } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  return (
    <Box width="full">
      <SelectRoot>
        <SelectTrigger
          accessibility-label="공유 대상"
          placeholder="공유 대상"
          prefixIcon={<IconPerson2Line />}
        />
        <SelectContent>
          <SelectGroup label="그룹">
            <SelectItem value="public" label="전체 공개" prefixIcon={<IconGlobeLine />} />
            <SelectItem value="followers" label="팔로워만" prefixIcon={<IconLockLine />} />
            <SelectItem value="private" label="나만" prefixIcon={<IconPersonLine />} />
          </SelectGroup>
          <SelectGroup label="사람">
            <SelectItem value="kim" label="김하늘" />
            <SelectItem value="lee" label="이하늘" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}

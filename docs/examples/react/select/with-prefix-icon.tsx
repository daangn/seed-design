import {
  IconGlobeLine,
  IconLockLine,
  IconPerson2Line,
  IconPersonLine,
} from "@karrotmarket/react-monochrome-icon";
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectWithPrefixIcon() {
  return (
    <Box width="280px">
      <SelectRoot>
        <SelectTrigger
          aria-label="공유 대상"
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

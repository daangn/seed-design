import { IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon, SearchInput } from "@seed-design/react";

export default function SearchInputPreview() {
  return (
    <div style={{ width: "320px" }}>
      <SearchInput.Root>
        <SearchInput.Input aria-label="검색" placeholder="검색어를 입력해주세요" />
        <SearchInput.ClearButton aria-label="지우기">
          <Icon svg={<IconXmarkCircleFill />} />
        </SearchInput.ClearButton>
      </SearchInput.Root>
    </div>
  );
}

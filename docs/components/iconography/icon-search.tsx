"use client";

import { useIcon } from "./icon-context";

import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import { TextFieldInput } from "seed-design/ui/text-field";

export const IconSearch = () => {
  const { search, setSearch } = useIcon();

  return (
    <TextFieldInput
      description={search === "" ? "아이콘을 검색해보세요." : `\`${search}\`로 검색한 결과입니다.`}
      prefixIcon={<IconMagnifyingglassLine />}
      onValueChange={(values) => setSearch(values.value)}
      value={search}
      autoFocus
      size="xlarge"
      className="mb-10 mt-4"
      inputProps={{
        placeholder: "person, car, 알파벳, etc...",
      }}
    />
  );
};

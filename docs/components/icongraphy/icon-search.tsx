"use client";

import * as React from "react";

import { useIcon } from "./icon-context";

export const IconSearch = () => {
  const { search, setSearch } = useIcon();

  return (
    <div>
      <span className="text-sm">
        {search === "" ? "아이콘을 검색해보세요." : `\`${search}\`로 검색한 결과입니다.`}
      </span>
      <input
        className="w-full h-16 text-xl font-extrabold border border-gray-300 rounded-md px-3 focus:outline-none focus:border-blue-500 mb-4"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

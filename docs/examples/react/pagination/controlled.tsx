"use client";

import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { Pagination } from "seed-design/ui/pagination";

export default function PaginationControlled() {
  const [page, setPage] = useState(5);

  return (
    <VStack gap="x3" align="center">
      <Pagination
        totalPages={10}
        page={page}
        onPageChange={setPage}
        aria-label="검색 결과 페이지"
      />
      <Text textStyle="t4Regular">현재 페이지: {page}</Text>
    </VStack>
  );
}

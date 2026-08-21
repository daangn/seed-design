"use client";

import { Box } from "@seed-design/react";
import { useState } from "react";
import { TablePagination, type TablePaginationValue } from "seed-design/ui/table-pagination";

export default function TablePaginationUnknownTotal() {
  const [value, setValue] = useState<TablePaginationValue>({ page: 2, pageSize: 10 });

  return (
    <Box width="full" overflowX="auto">
      <Box minWidth="640px">
        <TablePagination
          value={value}
          onValueChange={setValue}
          hasPreviousPage={value.page > 1}
          hasNextPage={value.page < 5}
          currentPageItemCount={value.page === 5 ? 7 : value.pageSize}
          aria-label="전체 개수를 알 수 없는 상품 표 페이지"
        />
      </Box>
    </Box>
  );
}

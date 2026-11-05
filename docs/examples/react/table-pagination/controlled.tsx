"use client";

import { Box, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { TablePagination, type TablePaginationValue } from "seed-design/ui/table-pagination";

export default function TablePaginationControlled() {
  const [value, setValue] = useState<TablePaginationValue>({ page: 3, pageSize: 25 });

  return (
    <VStack width="640px" maxWidth="full" gap="x3" align="stretch">
      <Box width="full" overflowX="auto">
        <Box minWidth="640px">
          <TablePagination
            totalItems={237}
            value={value}
            onValueChange={setValue}
            aria-label="상품 표 페이지"
          />
        </Box>
      </Box>
      <Text textStyle="t4Regular" align="center">
        {value.page}페이지 · 페이지당 {value.pageSize}개
      </Text>
    </VStack>
  );
}

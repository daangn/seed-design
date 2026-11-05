import { Box } from "@seed-design/react";
import { TablePagination } from "seed-design/ui/table-pagination";

export default function TablePaginationEmpty() {
  return (
    <Box width="full" overflowX="auto">
      <Box minWidth="640px">
        <TablePagination totalItems={0} aria-label="빈 상품 표 페이지" />
      </Box>
    </Box>
  );
}

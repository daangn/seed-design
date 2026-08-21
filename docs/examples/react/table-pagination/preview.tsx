import { Box } from "@seed-design/react";
import { TablePagination } from "seed-design/ui/table-pagination";

export default function TablePaginationPreview() {
  return (
    <Box width="full" overflowX="auto">
      <Box minWidth="640px">
        <TablePagination
          totalItems={237}
          defaultValue={{ page: 2, pageSize: 10 }}
          aria-label="상품 표 페이지"
        />
      </Box>
    </Box>
  );
}

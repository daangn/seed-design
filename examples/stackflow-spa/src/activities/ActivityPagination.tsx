import type { StaticActivityComponentType } from "@stackflow/react/future";
import { Box, Text, VStack } from "@seed-design/react";
import * as React from "react";

import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { Pagination } from "seed-design/ui/pagination";
import { TablePagination, type TablePaginationValue } from "seed-design/ui/table-pagination";

declare module "@stackflow/config" {
  interface Register {
    ActivityPagination: {};
  }
}

const ActivityPagination: StaticActivityComponentType<"ActivityPagination"> = () => {
  const [page, setPage] = React.useState(5);
  const [tableValue, setTableValue] = React.useState<TablePaginationValue>({
    page: 3,
    pageSize: 25,
  });
  const [unknownValue, setUnknownValue] = React.useState<TablePaginationValue>({
    page: 2,
    pageSize: 10,
  });

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Pagination</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x8" px="x4" py="x6" align="stretch">
          <VStack gap="x3" align="flex-start">
            <Text textStyle="t5Bold">Pagination</Text>
            <Pagination
              totalPages={10}
              page={page}
              onPageChange={setPage}
              alignSelf="center"
              aria-label="게시글 페이지"
            />
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              현재 페이지: {page}
            </Text>
          </VStack>

          <VStack gap="x3" align="stretch">
            <Text textStyle="t5Bold">Table Pagination</Text>
            <Box overflowX="auto">
              <Box minWidth="640px">
                <TablePagination
                  totalItems={237}
                  value={tableValue}
                  onValueChange={setTableValue}
                  aria-label="상품 표 페이지"
                />
              </Box>
            </Box>
            <Text textStyle="t4Regular" color="fg.neutralMuted">
              {tableValue.page}페이지 · 페이지당 {tableValue.pageSize}개
            </Text>
          </VStack>

          <VStack gap="x3" align="stretch">
            <Text textStyle="t5Bold">Unknown Total</Text>
            <Box overflowX="auto">
              <Box minWidth="640px">
                <TablePagination
                  value={unknownValue}
                  onValueChange={setUnknownValue}
                  hasPreviousPage={unknownValue.page > 1}
                  hasNextPage={unknownValue.page < 5}
                  currentPageItemCount={unknownValue.page === 5 ? 7 : unknownValue.pageSize}
                  aria-label="전체 개수를 알 수 없는 상품 표 페이지"
                />
              </Box>
            </Box>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPagination;

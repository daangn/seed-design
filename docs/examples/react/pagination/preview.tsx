import { Pagination } from "seed-design/ui/pagination";

export default function PaginationPreview() {
  return <Pagination totalPages={10} defaultPage={5} aria-label="검색 결과 페이지" />;
}

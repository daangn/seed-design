const SEARCH_ERROR_MESSAGE = "검색 결과를 불러오지 못했어요. 페이지를 새로고침해 주세요.";

export function SearchError() {
  return (
    <p className="px-4 py-12 text-center text-sm text-fg-neutral-subtle" role="alert">
      {SEARCH_ERROR_MESSAGE}
    </p>
  );
}

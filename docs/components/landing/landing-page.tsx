import { LazySearch } from "../../src/shell/SiteHeader";
import { LandingExperience } from "./landing-experience";

/**
 * landing(`/`) island(`src/pages/index.astro`, `client:load`). 문서 셸 밖이라 헤더의 검색 버튼이 여는 다이얼로그를
 * 여기서 둔다. 열림 상태는 셸 store(`src/shell/store.ts`)라 Meta/Ctrl+K(`src/shell/client.ts`)도 같은 다이얼로그를 연다.
 * 테마는 `<html data-theme-locked="light">`가 고정한다.
 */
export function LandingPage() {
  return (
    <>
      <LandingExperience />
      <LazySearch sectionId={null} landing />
    </>
  );
}
